const mongoose = require('mongoose');
const Scan = require('../models/scan');
const Vulnerability = require('../models/vulnerability');
const Target = require('../models/target');
const User = require('../models/user');
require('dotenv').config();

const createSampleReport = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create a sample target
    const target = await Target.create({
      name: 'Sample Website',
      url: 'https://example.com',
      type: 'web',
      description: 'A sample website for testing'
    });

    // Create a sample user if not exists
    let user = await User.findOne({ email: 'admin@example.com' });
    if (!user) {
      user = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      });
    }

    // Create a sample scan
    const scan = await Scan.create({
      target: target._id,
      name: 'Sample Security Scan',
      status: 'completed',
      scanType: 'full',
      tools: ['zap', 'nmap', 'nikto'],
      startedAt: new Date(Date.now() - 3600000), // 1 hour ago
      completedAt: new Date(),
      duration: 3600, // 1 hour
      createdBy: user._id
    });

    // Create sample vulnerabilities
    const vulnerabilities = [
      {
        scan: scan._id,
        target: target._id,
        name: 'SQL Injection Vulnerability',
        description: 'The application is vulnerable to SQL injection attacks through the login form.',
        severity: 'high',
        cvssScore: 8.5,
        cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
        cweId: 'CWE-89',
        cveId: 'CVE-2023-1234',
        location: {
          url: 'https://example.com/login',
          method: 'POST',
          parameter: 'username',
          evidence: 'SQL syntax error in response'
        },
        tool: 'zap',
        remediation: {
          description: 'Use parameterized queries or prepared statements',
          steps: [
            'Implement input validation',
            'Use parameterized queries',
            'Implement proper error handling'
          ],
          references: [
            'https://owasp.org/www-community/attacks/SQL_Injection',
            'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html'
          ]
        }
      },
      {
        scan: scan._id,
        target: target._id,
        name: 'Cross-Site Scripting (XSS)',
        description: 'Reflected XSS vulnerability in search functionality.',
        severity: 'medium',
        cvssScore: 6.1,
        cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N',
        cweId: 'CWE-79',
        cveId: 'CVE-2023-5678',
        location: {
          url: 'https://example.com/search',
          method: 'GET',
          parameter: 'q',
          evidence: 'JavaScript execution in response'
        },
        tool: 'zap',
        remediation: {
          description: 'Implement proper output encoding and input validation',
          steps: [
            'Encode all user input before displaying',
            'Implement Content Security Policy',
            'Use modern frameworks with built-in XSS protection'
          ],
          references: [
            'https://owasp.org/www-community/attacks/xss/',
            'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html'
          ]
        }
      },
      {
        scan: scan._id,
        target: target._id,
        name: 'Outdated SSL/TLS Version',
        description: 'Server is using an outdated SSL/TLS version (TLS 1.0).',
        severity: 'medium',
        cvssScore: 5.8,
        cvssVector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:L/A:L',
        cweId: 'CWE-326',
        location: {
          url: 'https://example.com',
          method: 'GET',
          evidence: 'TLS 1.0 detected'
        },
        tool: 'nmap',
        remediation: {
          description: 'Upgrade to a modern TLS version',
          steps: [
            'Disable TLS 1.0 and 1.1',
            'Enable TLS 1.2 and 1.3',
            'Configure secure cipher suites'
          ],
          references: [
            'https://www.ssl.com/guide/ssl-best-practices/',
            'https://www.owasp.org/index.php/Transport_Layer_Protection_Cheat_Sheet'
          ]
        }
      },
      {
        scan: scan._id,
        target: target._id,
        name: 'Information Disclosure',
        description: 'Server reveals detailed error messages to users.',
        severity: 'low',
        cvssScore: 3.7,
        cvssVector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:N/A:N',
        cweId: 'CWE-209',
        location: {
          url: 'https://example.com/api/users',
          method: 'GET',
          evidence: 'Detailed stack trace in error response'
        },
        tool: 'nikto',
        remediation: {
          description: 'Implement proper error handling and logging',
          steps: [
            'Use generic error messages in production',
            'Implement proper logging',
            'Configure error pages'
          ],
          references: [
            'https://owasp.org/www-community/attacks/Information_Disclosure',
            'https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html'
          ]
        }
      }
    ];

    await Vulnerability.insertMany(vulnerabilities);
    console.log('Sample report created successfully');
    console.log('Scan ID:', scan._id);
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample report:', error);
    process.exit(1);
  }
};

createSampleReport(); 