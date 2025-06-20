const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const Report = require('../../models/report');

class ReportService {
  constructor(report) {
    this.report = report;
    this.doc = new PDFDocument({ margin: 50 });
    this.reportsDir = path.join(__dirname, '..', '..', '..', 'reports');
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
    this.filePath = path.join(this.reportsDir, `report-${this.report._id}.pdf`);
  }

  async generate() {
    try {
      this.doc.pipe(fs.createWriteStream(this.filePath));

      await this._generateHeader();
      await this._generateTitle();
      await this._generateSummary();
      await this._generateVulnerabilities();
      await this._generateFooter();

      this.doc.end();

      // Save file path to the report model
      const downloadUrl = `/api/reports/download/${this.report._id}`;
      await Report.findByIdAndUpdate(this.report._id, {
        status: 'completed',
        filePath: this.filePath,
        downloadUrl: downloadUrl,
      });

      console.log(`Report generated successfully: ${this.filePath}`);
      return { filePath: this.filePath, downloadUrl };
    } catch (error) {
      console.error('Error generating report:', error);
      await Report.findByIdAndUpdate(this.report._id, { status: 'failed' });
      throw error;
    }
  }

  async _generateHeader() {
    this.doc
      .image(path.join(__dirname, '..', '..', 'assets', 'logo.png'), 50, 45, { width: 50 })
      .fillColor('#444444')
      .fontSize(20)
      .text('Security Scan Report', 110, 57)
      .fontSize(10)
      .text('Generated on: ' + new Date().toLocaleDateString(), 200, 65, { align: 'right' });
  }

  async _generateTitle() {
    this.doc.moveDown(4);
    this.doc
      .fillColor('#000')
      .fontSize(24)
      .text(this.report.name, { align: 'center' })
      .fontSize(16)
      .text(`Target: ${this.report.target.name}`, { align: 'center' })
      .moveDown(2);
  }

  async _generateSummary() {
    this.doc.addPage();
    this.doc.fontSize(18).text('Executive Summary', { underline: true }).moveDown();

    const summary = this.report.content.summary;
    const chartWidth = 400;
    const chartHeight = 250;
    const chartJsNodeCanvas = new ChartJSNodeCanvas({ width: chartWidth, height: chartHeight });

    const configuration = {
      type: 'doughnut',
      data: {
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [{
          label: 'Vulnerabilities by Severity',
          data: [
            summary.criticalCount || 0,
            summary.highCount || 0,
            summary.mediumCount || 0,
            summary.lowCount || 0,
          ],
          backgroundColor: ['#d32f2f', '#f57c00', '#1976d2', '#388e3c'],
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: { position: 'right' },
        }
      }
    };

    const image = await chartJsNodeCanvas.renderToBuffer(configuration);
    this.doc.image(image, { fit: [chartWidth, chartHeight], align: 'center' });
    this.doc.moveDown(2);
  }

  _generateVulnerabilities() {
    this.doc.addPage();
    this.doc.fontSize(18).text('Vulnerabilities Details', { underline: true }).moveDown();

    this.report.content.vulnerabilities.forEach(vuln => {
      this.doc.fontSize(14).fillColor('#000').text(vuln.name, { continued: true });
      this.doc.fontSize(10).fillColor(this._getSeverityColor(vuln.severity)).text(` (${vuln.severity.toUpperCase()})`, { underline: false }).moveDown();
      
      this.doc.fontSize(10).fillColor('#555').text(`Status: ${vuln.status.replace('_', ' ')}`);
      this.doc.moveDown(0.5);
      
      this.doc.fontSize(11).fillColor('#000').text(vuln.description);
      this.doc.moveDown(0.5);
      
      if (vuln.remediation?.description) {
        this.doc.fontSize(10).fillColor('#333').text('Remediation: ' + vuln.remediation.description);
      }
      this.doc.moveDown(2);
    });
  }

  async _generateFooter() {
    const pageCount = this.doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
        this.doc.switchToPage(i);
        this.doc
          .fontSize(8)
          .text(`Page ${i + 1} of ${pageCount}`, 50, this.doc.page.height - 50, { align: 'center' });
    }
  }

  _getSeverityColor(severity) {
    switch (severity) {
      case 'critical': return '#d32f2f';
      case 'high': return '#f57c00';
      case 'medium': '##1976d2';
      case 'low': return '#388e3c';
      default: return '#333';
    }
  }
}

module.exports = ReportService; 