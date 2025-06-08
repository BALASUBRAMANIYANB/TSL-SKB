import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  Divider,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Collapse,
  CircularProgress,
  Stack,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Card,
  CardContent,
  Slider,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Speed as SpeedIcon,
  BugReport as BugReportIcon,
  Assessment as AssessmentIcon,
  Language as LanguageIcon,
  Public as PublicIcon,
  Router as RouterIcon,
  Code as CodeIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  Timeline as TimelineIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Timer as TimerIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
  Compare as CompareIcon,
  History as HistoryIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  VerifiedUser as VerifiedUserIcon,
  PriorityHigh as PriorityHighIcon,
  LowPriority as LowPriorityIcon,
  Score as ScoreIcon,
  Summarize as SummarizeIcon,
  ViewModule as ViewModuleIcon,
  TableChart as TableChartIcon,
  PictureAsPdf as PictureAsPdfIcon,
  DataObject as DataObjectIcon,
  TableView as TableViewIcon,
  BubbleChart as BubbleChartIcon,
  ScatterPlot as ScatterPlotIcon,
  ShowChart as ShowChartIcon,
  Map as MapIcon,
  GridOn as GridOnIcon,
} from '@mui/icons-material';
import { API_URL } from '../../services/auth';
import axios from 'axios';

const scanPresets = {
  quick: {
    name: 'Quick Scan',
    description: 'Basic security check focusing on common vulnerabilities',
    stages: [
      {
        name: 'Port Scan',
        description: 'Quick port scan to identify open services',
        duration: '1-2 minutes',
        checks: ['Common ports', 'Service detection'],
      },
      {
        name: 'Basic Vulnerability Check',
        description: 'Check for common security misconfigurations',
        duration: '2-3 minutes',
        checks: ['Default credentials', 'Outdated services', 'Basic misconfigurations'],
      },
    ],
  },
  standard: {
    name: 'Standard Scan',
    description: 'Comprehensive security assessment with moderate depth',
    stages: [
      {
        name: 'Port Scan',
        description: 'Detailed port scan with service enumeration',
        duration: '3-5 minutes',
        checks: ['All ports', 'Service detection', 'Version detection'],
      },
      {
        name: 'Vulnerability Assessment',
        description: 'Check for known vulnerabilities and misconfigurations',
        duration: '5-10 minutes',
        checks: ['Common vulnerabilities', 'Security misconfigurations', 'Weak configurations'],
      },
      {
        name: 'Web Application Scan',
        description: 'Basic web application security testing',
        duration: '5-10 minutes',
        checks: ['SQL injection', 'XSS', 'CSRF', 'Directory traversal'],
      },
    ],
  },
  thorough: {
    name: 'Thorough Scan',
    description: 'In-depth security analysis with advanced testing',
    stages: [
      {
        name: 'Port Scan',
        description: 'Comprehensive port and service analysis',
        duration: '5-10 minutes',
        checks: ['All ports', 'Service detection', 'Version detection', 'OS detection'],
      },
      {
        name: 'Vulnerability Assessment',
        description: 'Detailed vulnerability scanning',
        duration: '10-15 minutes',
        checks: ['All known vulnerabilities', 'Security misconfigurations', 'Weak configurations'],
      },
      {
        name: 'Web Application Scan',
        description: 'Advanced web application security testing',
        duration: '15-20 minutes',
        checks: ['All OWASP Top 10', 'Advanced injection tests', 'Authentication testing'],
      },
      {
        name: 'Advanced Testing',
        description: 'Specialized security testing',
        duration: '10-15 minutes',
        checks: ['Custom vulnerability checks', 'Advanced exploitation attempts', 'Privilege escalation'],
      },
    ],
  },
  custom: {
    name: 'Custom Scan',
    description: 'Configure your own scanning parameters',
    stages: [],
  },
};

const scanTemplates = {
  owasp: {
    name: 'OWASP Top 10',
    description: 'Focuses on OWASP Top 10 vulnerabilities',
    stages: [
      {
        name: 'Injection Testing',
        description: 'SQL, NoSQL, Command Injection',
        duration: '5-10 minutes',
        checks: ['SQL Injection', 'NoSQL Injection', 'Command Injection'],
      },
      {
        name: 'Authentication Testing',
        description: 'Broken Authentication & Session Management',
        duration: '5-10 minutes',
        checks: ['Session Management', 'Password Policy', 'Multi-factor Authentication'],
      },
      {
        name: 'Sensitive Data Exposure',
        description: 'Data encryption and protection',
        duration: '5-10 minutes',
        checks: ['Data Encryption', 'Secure Headers', 'Cookie Security'],
      },
    ],
  },
  pci: {
    name: 'PCI DSS Compliance',
    description: 'Payment Card Industry compliance checks',
    stages: [
      {
        name: 'Network Security',
        description: 'Network segmentation and access control',
        duration: '10-15 minutes',
        checks: ['Network Segmentation', 'Firewall Rules', 'Access Control'],
      },
      {
        name: 'Data Protection',
        description: 'Cardholder data protection',
        duration: '10-15 minutes',
        checks: ['Data Encryption', 'Key Management', 'Secure Storage'],
      },
    ],
  },
  iso27001: {
    name: 'ISO 27001',
    description: 'Information security management system checks',
    stages: [
      {
        name: 'Access Control',
        description: 'User access management',
        duration: '10-15 minutes',
        checks: ['User Management', 'Access Rights', 'Password Policy'],
      },
      {
        name: 'Cryptography',
        description: 'Encryption and key management',
        duration: '10-15 minutes',
        checks: ['Encryption Policy', 'Key Management', 'Cryptographic Controls'],
      },
    ],
  },
};

const severityLevels = {
  critical: {
    label: 'Critical',
    color: 'error',
    icon: ErrorIcon,
    description: 'Immediate action required',
  },
  high: {
    label: 'High',
    color: 'error',
    icon: ErrorIcon,
    description: 'Action required soon',
  },
  medium: {
    label: 'Medium',
    color: 'warning',
    icon: WarningIcon,
    description: 'Action recommended',
  },
  low: {
    label: 'Low',
    color: 'info',
    icon: InfoIcon,
    description: 'Consider addressing',
  },
  info: {
    label: 'Info',
    color: 'info',
    icon: InfoIcon,
    description: 'Informational only',
  },
};

const isValidDomain = (domain) => {
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return domainRegex.test(domain) && domain.length <= 255;
};

const isValidIP = (ip) => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?:(?::[0-9a-fA-F]{1,4}){1,6})|:(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(?:ffff(?::0{1,4}){0,1}:){0,1}(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])|(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

const isValidURL = (url) => {
  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    if (!isValidDomain(urlObj.hostname)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

const getTargetPlaceholder = (type) => {
  switch (type) {
    case 'domain':
      return 'example.com';
    case 'url':
      return 'https://example.com';
    case 'ip':
      return '192.168.1.1';
    default:
      return '';
  }
};

const getTargetHelperText = (type) => {
  switch (type) {
    case 'domain':
      return 'Enter a valid domain name (e.g., example.com)';
    case 'url':
      return 'Enter a valid website URL with http:// or https://';
    case 'ip':
      return 'Enter a valid IPv4 or IPv6 address';
    default:
      return '';
  }
};

// Add these constants at the top level
const RISK_WEIGHTS = {
  critical: {
    base: 10,
    factors: {
      exploitability: 1.5,
      impact: 2.0,
      prevalence: 1.2,
    },
  },
  high: {
    base: 7,
    factors: {
      exploitability: 1.3,
      impact: 1.5,
      prevalence: 1.1,
    },
  },
  medium: {
    base: 4,
    factors: {
      exploitability: 1.1,
      impact: 1.2,
      prevalence: 1.0,
    },
  },
  low: {
    base: 1,
    factors: {
      exploitability: 1.0,
      impact: 1.0,
      prevalence: 0.9,
    },
  },
};

const VISUALIZATION_TYPES = {
  bar: {
    name: 'Bar Chart',
    icon: BarChartIcon,
    description: 'Compare values across categories',
  },
  pie: {
    name: 'Pie Chart',
    icon: PieChartIcon,
    description: 'Show proportion of findings by category',
  },
  line: {
    name: 'Line Chart',
    icon: ShowChartIcon,
    description: 'Track trends over time',
  },
  scatter: {
    name: 'Scatter Plot',
    icon: ScatterPlotIcon,
    description: 'Correlation between severity and impact',
  },
  bubble: {
    name: 'Bubble Chart',
    icon: BubbleChartIcon,
    description: 'Three-dimensional data visualization',
  },
  heatmap: {
    name: 'Heat Map',
    icon: GridOnIcon,
    description: 'Density of findings by category and severity',
  },
  timeline: {
    name: 'Timeline',
    icon: TimelineIcon,
    description: 'Chronological view of findings',
  },
  map: {
    name: 'Geographic Map',
    icon: MapIcon,
    description: 'Geographic distribution of findings',
  },
};

const REPORT_TEMPLATES = {
  standard: {
    name: 'Standard Report',
    sections: ['summary', 'findings', 'recommendations', 'timeline'],
  },
  executive: {
    name: 'Executive Summary',
    sections: ['summary', 'riskScore', 'criticalFindings', 'recommendations'],
  },
  technical: {
    name: 'Technical Deep Dive',
    sections: ['summary', 'findings', 'timeline', 'technicalDetails', 'recommendations'],
  },
  compliance: {
    name: 'Compliance Report',
    sections: ['summary', 'findings', 'complianceStatus', 'recommendations'],
  },
  detailed: {
    name: 'Detailed Analysis',
    sections: ['summary', 'findings', 'timeline', 'technicalDetails', 'recommendations', 'metrics'],
  },
  quick: {
    name: 'Quick Overview',
    sections: ['summary', 'criticalFindings', 'recommendations'],
  },
  trend: {
    name: 'Trend Analysis',
    sections: ['summary', 'findings', 'trends', 'comparison', 'recommendations'],
  },
  security: {
    name: 'Security Assessment',
    sections: ['summary', 'findings', 'vulnerabilities', 'threats', 'recommendations'],
  },
  audit: {
    name: 'Audit Report',
    sections: ['summary', 'findings', 'compliance', 'controls', 'recommendations'],
  },
  risk: {
    name: 'Risk Assessment',
    sections: ['summary', 'findings', 'riskAnalysis', 'mitigation', 'recommendations'],
  },
};

const EXPORT_FORMATS = {
  pdf: {
    name: 'PDF Document',
    icon: PictureAsPdfIcon,
    mimeType: 'application/pdf',
    extension: 'pdf',
  },
  html: {
    name: 'HTML Report',
    icon: CodeIcon,
    mimeType: 'text/html',
    extension: 'html',
  },
  csv: {
    name: 'CSV Spreadsheet',
    icon: TableChartIcon,
    mimeType: 'text/csv',
    extension: 'csv',
  },
  json: {
    name: 'JSON Data',
    icon: DataObjectIcon,
    mimeType: 'application/json',
    extension: 'json',
  },
  excel: {
    name: 'Excel Workbook',
    icon: TableViewIcon,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extension: 'xlsx',
  },
  markdown: {
    name: 'Markdown',
    icon: DescriptionIcon,
    mimeType: 'text/markdown',
    extension: 'md',
  },
  xml: {
    name: 'XML',
    icon: CodeIcon,
    mimeType: 'application/xml',
    extension: 'xml',
  },
  yaml: {
    name: 'YAML',
    icon: CodeIcon,
    mimeType: 'application/yaml',
    extension: 'yaml',
  },
  docx: {
    name: 'Word Document',
    icon: DescriptionIcon,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    extension: 'docx',
  },
  pptx: {
    name: 'PowerPoint Presentation',
    icon: ViewModuleIcon,
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    extension: 'pptx',
  },
};

const ScanForm = ({ targets, onSubmit, onCancel }) => {
  const [selectedPreset, setSelectedPreset] = useState('standard');
  const [scanConfig, setScanConfig] = useState({
    name: '',
    target: '',
    targetType: 'domain', // 'domain', 'url', or 'ip'
    preset: 'standard',
    schedule: false,
    scheduleTime: '',
    scheduleFrequency: 'once',
    customStages: [],
    customScript: {
      type: 'inline', // 'inline' or 'file'
      content: '',
      file: null,
      language: 'python', // default language
    },
    template: 'standard',
    customProfile: null,
    severityThreshold: 'medium',
    notificationSettings: {
      email: '',
      notifyOnComplete: true,
      notifyOnError: true,
      notifyOnCritical: true,
    },
    schedule: {
      enabled: false,
      frequency: 'once',
      startDate: '',
      endDate: '',
      time: '',
      days: [],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });
  const [targetError, setTargetError] = useState('');
  const [scriptTab, setScriptTab] = useState(0);
  const [scanStatus, setScanStatus] = useState({
    isRunning: false,
    currentStage: '',
    progress: 0,
    logs: [],
    showLogs: false,
    stageDetails: {},
    logFilters: {
      info: true,
      success: true,
      warning: true,
      error: true,
    },
    showStageDetails: false,
    metrics: {
      cpu: 0,
      memory: 0,
      network: 0,
      duration: 0,
    },
  });
  const [wsConnection, setWsConnection] = useState(null);
  const [scanSettings, setScanSettings] = useState({
    timeout: 30,
    threads: 2,
    depth: 1,
    advanced: {
      followRedirects: true,
      verifySSL: true,
      rateLimit: 100,
    },
  });
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [selectedScans, setSelectedScans] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [showTrends, setShowTrends] = useState(false);
  const [trendsData, setTrendsData] = useState(null);
  const [reportData, setReportData] = useState({
    summary: {
      totalFindings: 0,
      criticalFindings: 0,
      highFindings: 0,
      mediumFindings: 0,
      lowFindings: 0,
      scanDuration: 0,
      scanDate: new Date(),
    },
    findings: [],
    recommendations: [],
    timeline: [],
  });
  const [reportFilters, setReportFilters] = useState({
    severity: ['critical', 'high', 'medium', 'low'],
    category: [],
    dateRange: null,
    status: ['open', 'in-progress', 'resolved'],
    impact: [],
    exploitability: [],
    customTags: [],
    searchQuery: '',
  });
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [visualizationType, setVisualizationType] = useState('bar');
  const [chartData, setChartData] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    severity: ['critical', 'high', 'medium', 'low'],
    category: [],
    dateRange: null,
    status: ['open', 'in-progress', 'resolved'],
    impact: [],
    exploitability: [],
    customTags: [],
    searchQuery: '',
    timeRange: 'all',
    customDateRange: null,
    affectedComponents: [],
    riskLevel: [],
    compliance: [],
    customFilters: {},
  });

  useEffect(() => {
    // Cleanup WebSocket connection on component unmount
    return () => {
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, [wsConnection]);

  const validateTarget = (value, type) => {
    if (!value.trim()) {
      return 'Target is required';
    }

    switch (type) {
      case 'domain':
        return isValidDomain(value) ? '' : 'Please enter a valid domain (e.g., example.com)';
      case 'url':
        return isValidURL(value) ? '' : 'Please enter a valid URL (e.g., https://example.com)';
      case 'ip':
        return isValidIP(value) ? '' : 'Please enter a valid IP address';
      default:
        return '';
    }
  };

  const handleTargetChange = (e) => {
    const value = e.target.value;
    const error = validateTarget(value, scanConfig.targetType);
    setTargetError(error);
    setScanConfig(prev => ({ ...prev, target: value }));
  };

  const handleTargetTypeChange = (type) => {
    const error = validateTarget(scanConfig.target, type);
    setTargetError(error);
    setScanConfig(prev => ({ ...prev, targetType: type }));
  };

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    setScanConfig(prev => ({
      ...prev,
      preset,
      customStages: preset === 'custom' ? [] : scanPresets[preset].stages,
    }));
  };

  const handleTemplateChange = (template) => {
    setScanConfig(prev => ({
      ...prev,
      template,
      stages: scanTemplates[template]?.stages || scanPresets[template]?.stages || [],
    }));
  };

  const startScan = async (e) => {
    e.preventDefault();
    if (targetError) return;

    setScanStatus(prev => ({
      ...prev,
      isRunning: true,
      logs: [],
      showLogs: true,
    }));

    // Create WebSocket connection
    const ws = new WebSocket(`${API_URL.replace('http', 'ws')}/scans/ws`);
    setWsConnection(ws);

    ws.onopen = () => {
      addLog('WebSocket connection established', 'info');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    ws.onerror = (error) => {
      addLog('WebSocket error: ' + error.message, 'error');
    };

    ws.onclose = () => {
      addLog('WebSocket connection closed', 'info');
      setScanStatus(prev => ({ ...prev, isRunning: false }));
    };

    // Submit scan configuration
    try {
      const response = await fetch(`${API_URL}/scans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...scanConfig,
          stages: scanConfig.preset === 'custom' ? scanConfig.customStages : scanPresets[scanConfig.preset].stages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start scan');
      }

      const data = await response.json();
      addLog(`Scan started with ID: ${data.scanId}`, 'success');
      
      // Add to history
      addToHistory({
        ...scanConfig,
        scanId: data.scanId,
        status: 'running',
      });
    } catch (error) {
      addLog(`Error starting scan: ${error.message}`, 'error');
      setScanStatus(prev => ({ ...prev, isRunning: false }));
    }
  };

  const stopScan = () => {
    if (wsConnection) {
      wsConnection.close();
    }
    setScanStatus(prev => ({ ...prev, isRunning: false }));
    addLog('Scan stopped by user', 'warning');
  };

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'stage_start':
        setScanStatus(prev => ({
          ...prev,
          currentStage: data.stage,
          progress: 0,
          stageDetails: {
            ...prev.stageDetails,
            [data.stage]: {
              startTime: new Date(),
              endTime: null,
              status: 'running',
              details: [],
            },
          },
        }));
        addLog(`Starting stage: ${data.stage}`, 'info');
        break;
      case 'progress':
        setScanStatus(prev => ({
          ...prev,
          progress: data.progress,
          stageDetails: {
            ...prev.stageDetails,
            [prev.currentStage]: {
              ...prev.stageDetails[prev.currentStage],
              details: [
                ...(prev.stageDetails[prev.currentStage]?.details || []),
                { timestamp: new Date(), message: data.message, type: 'progress' },
              ],
            },
          },
        }));
        break;
      case 'log':
        addLog(data.message, data.level || 'info');
        if (scanStatus.currentStage) {
          setScanStatus(prev => ({
            ...prev,
            stageDetails: {
              ...prev.stageDetails,
              [prev.currentStage]: {
                ...prev.stageDetails[prev.currentStage],
                details: [
                  ...(prev.stageDetails[prev.currentStage]?.details || []),
                  { timestamp: new Date(), message: data.message, type: data.level || 'info' },
                ],
              },
            },
          }));
        }
        break;
      case 'stage_complete':
        setScanStatus(prev => ({
          ...prev,
          stageDetails: {
            ...prev.stageDetails,
            [data.stage]: {
              ...prev.stageDetails[data.stage],
              endTime: new Date(),
              status: 'completed',
            },
          },
        }));
        addLog(`Completed stage: ${data.stage}`, 'success');
        break;
      case 'scan_complete':
        addLog('Scan completed successfully', 'success');
        setScanStatus(prev => ({ ...prev, isRunning: false }));
        break;
      case 'error':
        addLog(`Error: ${data.message}`, 'error');
        setScanStatus(prev => ({
          ...prev,
          isRunning: false,
          stageDetails: {
            ...prev.stageDetails,
            [prev.currentStage]: {
              ...prev.stageDetails[prev.currentStage],
              status: 'failed',
              error: data.message,
            },
          },
        }));
        break;
      case 'metrics':
        setScanStatus(prev => ({
          ...prev,
          metrics: {
            ...prev.metrics,
            ...data.metrics,
          },
        }));
        break;
    }
  };

  const addLog = (message, level = 'info') => {
    setScanStatus(prev => ({
      ...prev,
      logs: [...prev.logs, { timestamp: new Date(), message, level }],
    }));
  };

  const toggleLogs = () => {
    setScanStatus(prev => ({ ...prev, showLogs: !prev.showLogs }));
  };

  const getLogColor = (level) => {
    switch (level) {
      case 'error': return 'error.main';
      case 'warning': return 'warning.main';
      case 'success': return 'success.main';
      default: return 'text.secondary';
    }
  };

  const handleScriptTypeChange = (event, newValue) => {
    setScriptTab(newValue);
    setScanConfig(prev => ({
      ...prev,
      customScript: {
        ...prev.customScript,
        type: newValue === 0 ? 'inline' : 'file',
        content: newValue === 0 ? prev.customScript.content : '',
        file: newValue === 1 ? prev.customScript.file : null,
      }
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setScanConfig(prev => ({
          ...prev,
          customScript: {
            ...prev.customScript,
            file: file,
            content: e.target.result,
          }
        }));
      };
      reader.readAsText(file);
    }
  };

  const handleLanguageChange = (event) => {
    setScanConfig(prev => ({
      ...prev,
      customScript: {
        ...prev.customScript,
        language: event.target.value,
      }
    }));
  };

  const removeFile = () => {
    setScanConfig(prev => ({
      ...prev,
      customScript: {
        ...prev.customScript,
        file: null,
        content: '',
      }
    }));
  };

  const toggleLogFilter = (level) => {
    setScanStatus(prev => ({
      ...prev,
      logFilters: {
        ...prev.logFilters,
        [level]: !prev.logFilters[level],
      },
    }));
  };

  const getFilteredLogs = () => {
    return scanStatus.logs.filter(log => scanStatus.logFilters[log.level]);
  };

  const exportScanResults = async (format) => {
    try {
      const response = await axios.get(`${API_URL}/scans/${scanConfig._id}/export?format=${format}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `scan-report-${scanConfig._id}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting scan results:', error);
      addLog('Failed to export scan results', 'error');
    }
  };

  const generatePDFContent = (scan) => {
    // This would typically use a PDF generation library
    return `PDF content for scan ${scan.id}`;
  };

  const generateCSVContent = (scan) => {
    const headers = ['ID', 'Severity', 'Description', 'Location', 'Timestamp'];
    const rows = scan.findings.map(f => [
      f.id,
      f.severity,
      f.description,
      f.location,
      f.timestamp,
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateHTMLContent = (scan) => {
    return `
      <html>
        <head>
          <title>Scan Results - ${scan.name}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .finding { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
            .severity { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Scan Results: ${scan.name}</h1>
          <p>Date: ${new Date(scan.timestamp).toLocaleString()}</p>
          <div class="findings">
            ${scan.findings.map(f => `
              <div class="finding">
                <div class="severity">${f.severity}</div>
                <div>${f.description}</div>
                <div>Location: ${f.location}</div>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;
  };

  // Add trends analysis
  const analyzeTrends = () => {
    const recentScans = scanHistory.slice(0, 10); // Last 10 scans
    const trends = {
      severityTrends: {
        critical: [],
        high: [],
        medium: [],
        low: [],
      },
      findingTypes: {},
      resolutionRate: [],
    };

    recentScans.forEach(scan => {
      const findings = scan.findings || [];
      
      // Count findings by severity
      Object.keys(severityLevels).forEach(severity => {
        trends.severityTrends[severity].push(
          findings.filter(f => f.severity === severity).length
        );
      });

      // Count finding types
      findings.forEach(finding => {
        const type = finding.type || 'unknown';
        trends.findingTypes[type] = (trends.findingTypes[type] || 0) + 1;
      });

      // Calculate resolution rate
      const resolvedFindings = findings.filter(f => f.status === 'resolved').length;
      trends.resolutionRate.push(
        findings.length > 0 ? (resolvedFindings / findings.length) * 100 : 0
      );
    });

    setTrendsData(trends);
  };

  const exportLogs = () => {
    const logs = getFilteredLogs();
    let content = '';
    
    switch (exportFormat) {
      case 'txt':
        content = logs.map(log => 
          `[${log.timestamp.toLocaleString()}] ${log.level.toUpperCase()}: ${log.message}`
        ).join('\n');
        break;
      case 'json':
        content = JSON.stringify(logs, null, 2);
        break;
      case 'csv':
        content = 'Timestamp,Level,Message\n' + 
          logs.map(log => 
            `${log.timestamp.toLocaleString()},${log.level},${log.message}`
          ).join('\n');
        break;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan-logs-${new Date().toISOString()}.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportDialogOpen(false);
  };

  const clearLogs = () => {
    setScanStatus(prev => ({ ...prev, logs: [] }));
  };

  const getLogCount = (level) => {
    return scanStatus.logs.filter(log => log.level === level).length;
  };

  const saveCustomProfile = () => {
    const profile = {
      name: scanConfig.name,
      stages: scanConfig.stages,
      settings: scanSettings,
      created: new Date().toISOString(),
    };
    // Save to localStorage for now (can be moved to backend later)
    const profiles = JSON.parse(localStorage.getItem('scanProfiles') || '[]');
    profiles.push(profile);
    localStorage.setItem('scanProfiles', JSON.stringify(profiles));
  };

  const loadCustomProfile = (profile) => {
    setScanConfig(prev => ({
      ...prev,
      name: profile.name,
      stages: profile.stages,
      customProfile: profile,
    }));
    setScanSettings(profile.settings);
  };

  const handleNotificationChange = (setting) => {
    setScanConfig(prev => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        [setting]: !prev.notificationSettings[setting],
      },
    }));
  };

  const handleScheduleChange = (field, value) => {
    setScanConfig(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [field]: value,
      },
    }));
  };

  const SeverityIndicator = ({ level }) => {
    const severity = severityLevels[level];
    const Icon = severity.icon;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon color={severity.color} />
        <Typography color={`${severity.color}.main`}>
          {severity.label}
        </Typography>
      </Box>
    );
  };

  // Add scan history handlers
  const loadScanHistory = () => {
    // Load from localStorage for now (can be moved to backend later)
    const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
    setScanHistory(history);
  };

  const addToHistory = (scan) => {
    const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
    history.unshift({
      ...scan,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('scanHistory', JSON.stringify(history));
    setScanHistory(history);
  };

  const compareScans = () => {
    if (selectedScans.length !== 2) return;

    const scan1 = scanHistory.find(s => s.id === selectedScans[0]);
    const scan2 = scanHistory.find(s => s.id === selectedScans[1]);

    const comparison = {
      timestamp: new Date().toISOString(),
      scan1: {
        id: scan1.id,
        name: scan1.name,
        findings: scan1.findings || [],
      },
      scan2: {
        id: scan2.id,
        name: scan2.name,
        findings: scan2.findings || [],
      },
      differences: {
        newFindings: scan2.findings.filter(f => !scan1.findings.some(f1 => f1.id === f.id)),
        resolvedFindings: scan1.findings.filter(f => !scan2.findings.some(f2 => f2.id === f.id)),
        severityChanges: scan1.findings
          .filter(f1 => scan2.findings.some(f2 => f2.id === f1.id))
          .map(f1 => {
            const f2 = scan2.findings.find(f => f.id === f1.id);
            return {
              id: f1.id,
              oldSeverity: f1.severity,
              newSeverity: f2.severity,
            };
          }),
      },
    };

    setComparisonResults(comparison);
  };

  // Add this function to handle report generation
  const generateReport = (scanResults) => {
    const findings = scanResults.findings || [];
    const summary = {
      totalFindings: findings.length,
      criticalFindings: findings.filter(f => f.severity === 'critical').length,
      highFindings: findings.filter(f => f.severity === 'high').length,
      mediumFindings: findings.filter(f => f.severity === 'medium').length,
      lowFindings: findings.filter(f => f.severity === 'low').length,
      scanDuration: scanResults.duration || 0,
      scanDate: new Date(),
    };

    const recommendations = findings.map(finding => ({
      id: finding.id,
      severity: finding.severity,
      title: finding.title,
      description: finding.description,
      recommendation: finding.recommendation,
      references: finding.references || [],
    }));

    const timeline = scanResults.stages.map(stage => ({
      timestamp: stage.timestamp,
      stage: stage.name,
      status: stage.status,
      details: stage.details,
    }));

    setReportData({
      summary,
      findings,
      recommendations,
      timeline,
    });
  };

  // Add this after the scan completion handler
  useEffect(() => {
    if (scanStatus.isRunning === false && scanStatus.currentStage === '') {
      // Generate report when scan completes
      generateReport(scanStatus);
    }
  }, [scanStatus.isRunning, scanStatus.currentStage]);

  // Add these functions
  const calculateRiskScore = (findings) => {
    const weightedSum = findings.reduce((sum, finding) => {
      const severity = finding.severity;
      const weight = RISK_WEIGHTS[severity];
      if (!weight) return sum;

      const exploitabilityFactor = finding.exploitability ? weight.factors.exploitability : 1;
      const impactFactor = finding.impact ? weight.factors.impact : 1;
      const prevalenceFactor = finding.prevalence ? weight.factors.prevalence : 1;

      return sum + (weight.base * exploitabilityFactor * impactFactor * prevalenceFactor);
    }, 0);

    const maxPossibleScore = findings.length * RISK_WEIGHTS.critical.base * 
      RISK_WEIGHTS.critical.factors.exploitability * 
      RISK_WEIGHTS.critical.factors.impact * 
      RISK_WEIGHTS.critical.factors.prevalence;

    return (weightedSum / maxPossibleScore) * 100;
  };

  const generateExecutiveSummary = () => {
    const criticalFindings = reportData.findings.filter(f => f.severity === 'critical');
    const highFindings = reportData.findings.filter(f => f.severity === 'high');
    
    return {
      riskScore: calculateRiskScore(reportData.findings),
      criticalIssues: criticalFindings.length,
      highPriorityIssues: highFindings.length,
      topRecommendations: reportData.recommendations
        .filter(r => ['critical', 'high'].includes(r.severity))
        .slice(0, 3),
      scanDuration: reportData.summary.scanDuration,
      scanDate: reportData.summary.scanDate,
    };
  };

  const filterFindings = (findings) => {
    return findings.filter(finding => {
      const matchesSeverity = reportFilters.severity.includes(finding.severity);
      const matchesCategory = reportFilters.category.length === 0 || 
                             reportFilters.category.includes(finding.category);
      const matchesStatus = reportFilters.status.includes(finding.status);
      const matchesDate = !reportFilters.dateRange || 
                         (new Date(finding.timestamp) >= reportFilters.dateRange[0] &&
                          new Date(finding.timestamp) <= reportFilters.dateRange[1]);
      const matchesImpact = reportFilters.impact.length === 0 ||
                           reportFilters.impact.includes(finding.impact);
      const matchesExploitability = reportFilters.exploitability.length === 0 ||
                                   reportFilters.exploitability.includes(finding.exploitability);
      const matchesTags = reportFilters.customTags.length === 0 ||
                         finding.tags?.some(tag => reportFilters.customTags.includes(tag));
      const matchesSearch = !reportFilters.searchQuery ||
                           finding.title.toLowerCase().includes(reportFilters.searchQuery.toLowerCase()) ||
                           finding.description.toLowerCase().includes(reportFilters.searchQuery.toLowerCase());

      return matchesSeverity && matchesCategory && matchesStatus && matchesDate &&
             matchesImpact && matchesExploitability && matchesTags && matchesSearch;
    });
  };

  const exportReport = (format) => {
    const filteredFindings = filterFindings(reportData.findings);
    const executiveSummary = generateExecutiveSummary();
    
    const formatConfig = EXPORT_FORMATS[format];
    if (!formatConfig) return;

    let content = '';
    switch (format) {
      case 'csv':
        content = generateCSVReport(filteredFindings, executiveSummary);
        break;
      case 'json':
        content = JSON.stringify({
          summary: executiveSummary,
          findings: filteredFindings,
          recommendations: reportData.recommendations,
          timeline: reportData.timeline,
        }, null, 2);
        break;
      case 'markdown':
        content = generateMarkdownReport(filteredFindings, executiveSummary);
        break;
      case 'xml':
        content = generateXMLReport(filteredFindings, executiveSummary);
        break;
      // ... handle other formats
    }

    const blob = new Blob([content], { type: formatConfig.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan-report-${new Date().toISOString()}.${formatConfig.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateCSVReport = (findings, summary) => {
    const headers = [
      'ID',
      'Severity',
      'Title',
      'Description',
      'Recommendation',
      'Status',
      'Category',
      'Timestamp',
    ];
    
    const rows = findings.map(f => [
      f.id,
      f.severity,
      f.title,
      f.description,
      f.recommendation,
      f.status,
      f.category,
      new Date(f.timestamp).toISOString(),
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateMarkdownReport = (findings, summary) => {
    // Implement markdown report generation logic
    return `Markdown report for scan ${summary.totalFindings} findings`;
  };

  const generateXMLReport = (findings, summary) => {
    // Implement XML report generation logic
    return `XML report for scan ${summary.totalFindings} findings`;
  };

  // Add visualization components
  const renderVisualizations = () => (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Data Visualizations
      </Typography>
      
      {/* Visualization Type Selector */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Select Visualization Type
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(VISUALIZATION_TYPES).map(([key, type]) => {
            const Icon = type.icon;
            return (
              <Grid item xs={6} sm={4} md={3} key={key}>
                <Paper
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: visualizationType === key ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  }}
                  onClick={() => {
                    setVisualizationType(key);
                    setChartData(prepareChartData(key));
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Icon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="subtitle2">{type.name}</Typography>
                    <Typography variant="caption" color="text.secondary" align="center">
                      {type.description}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Chart Display */}
      {chartData && (
        <Box sx={{ mt: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ height: 400 }}>
              {/* Add your preferred charting library component here */}
              <Typography variant="body2" color="text.secondary">
                Chart will be rendered here using the selected visualization type
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );

  // Enhanced filter dialog
  const renderFilterDialog = () => (
    <Dialog open={showFilterDialog} onClose={() => setShowFilterDialog(false)} maxWidth="md" fullWidth>
      <DialogTitle>Advanced Filtering</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Existing filters */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Severity</Typography>
            <FormGroup>
              {Object.keys(severityLevels).map(level => (
                <FormControlLabel
                  key={level}
                  control={
                    <Checkbox
                      checked={filterOptions.severity.includes(level)}
                      onChange={(e) => {
                        const newSeverity = e.target.checked
                          ? [...filterOptions.severity, level]
                          : filterOptions.severity.filter(s => s !== level);
                        setFilterOptions(prev => ({ ...prev, severity: newSeverity }));
                      }}
                    />
                  }
                  label={severityLevels[level].label}
                />
              ))}
            </FormGroup>
          </Grid>

          {/* New filters */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Time Range</Typography>
            <FormControl fullWidth>
              <Select
                value={filterOptions.timeRange}
                onChange={(e) => setFilterOptions(prev => ({ ...prev, timeRange: e.target.value }))}
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">Last 7 Days</MenuItem>
                <MenuItem value="month">Last 30 Days</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Risk Level</Typography>
            <FormGroup>
              {['critical', 'high', 'medium', 'low'].map(level => (
                <FormControlLabel
                  key={level}
                  control={
                    <Checkbox
                      checked={filterOptions.riskLevel.includes(level)}
                      onChange={(e) => {
                        const newLevel = e.target.checked
                          ? [...filterOptions.riskLevel, level]
                          : filterOptions.riskLevel.filter(l => l !== level);
                        setFilterOptions(prev => ({ ...prev, riskLevel: newLevel }));
                      }}
                    />
                  }
                  label={level.charAt(0).toUpperCase() + level.slice(1)}
                />
              ))}
            </FormGroup>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Compliance</Typography>
            <FormGroup>
              {['OWASP', 'PCI-DSS', 'ISO27001', 'GDPR'].map(standard => (
                <FormControlLabel
                  key={standard}
                  control={
                    <Checkbox
                      checked={filterOptions.compliance.includes(standard)}
                      onChange={(e) => {
                        const newStandard = e.target.checked
                          ? [...filterOptions.compliance, standard]
                          : filterOptions.compliance.filter(s => s !== standard);
                        setFilterOptions(prev => ({ ...prev, compliance: newStandard }));
                      }}
                    />
                  }
                  label={standard}
                />
              ))}
            </FormGroup>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Search"
              value={filterOptions.searchQuery}
              onChange={(e) => setFilterOptions(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Search in findings..."
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowFilterDialog(false)}>Cancel</Button>
        <Button onClick={() => setShowFilterDialog(false)} variant="contained">
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Enhanced export dialog
  const renderExportDialog = () => (
    <Dialog open={showExportDialog} onClose={() => setShowExportDialog(false)}>
      <DialogTitle>Export Report</DialogTitle>
      <DialogContent>
        <List>
          {Object.entries(EXPORT_FORMATS).map(([key, format]) => {
            const Icon = format.icon;
            return (
              <ListItem
                key={key}
                button
                onClick={() => {
                  exportReport(key);
                  setShowExportDialog(false);
                }}
              >
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={format.name} />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowExportDialog(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );

  // Update the export options in the report section
  const renderExportOptions = () => (
    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
      <Button
        variant="outlined"
        startIcon={<FilterListIcon />}
        onClick={() => setShowFilterDialog(true)}
      >
        Filter
      </Button>
      <Button
        variant="outlined"
        startIcon={<ViewModuleIcon />}
        onClick={() => setShowTemplateDialog(true)}
      >
        Template
      </Button>
      <Button
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={() => setShowExportDialog(true)}
      >
        Export
      </Button>
    </Box>
  );

  // Update the renderReportSection function
  const renderReportSection = () => (
    <Grid item xs={12}>
      <Paper sx={{ p: 2 }}>
        {/* ... existing report content ... */}
        
        {/* Add Visualizations */}
        {renderVisualizations()}
        
        {/* Add Filter and Export Dialogs */}
        {renderFilterDialog()}
        {renderTemplateDialog()}
        {renderExportDialog()}
        
        {/* Update Export Options */}
        {renderExportOptions()}
      </Paper>
    </Grid>
  );

  // Add visualization data preparation
  const prepareChartData = (type) => {
    const findings = filterFindings(reportData.findings);
    
    switch (type) {
      case 'bar':
        return {
          labels: Object.keys(severityLevels),
          datasets: [{
            label: 'Findings by Severity',
            data: Object.keys(severityLevels).map(severity => 
              findings.filter(f => f.severity === severity).length
            ),
            backgroundColor: Object.keys(severityLevels).map(severity => 
              severityLevels[severity].color
            ),
          }],
        };
      
      case 'pie':
        return {
          labels: Object.keys(severityLevels),
          datasets: [{
            data: Object.keys(severityLevels).map(severity => 
              findings.filter(f => f.severity === severity).length
            ),
            backgroundColor: Object.keys(severityLevels).map(severity => 
              severityLevels[severity].color
            ),
          }],
        };
      
      case 'line':
        return {
          labels: findings.map(f => new Date(f.timestamp).toLocaleDateString()),
          datasets: [{
            label: 'Findings Over Time',
            data: findings.map(f => 1),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          }],
        };
      
      case 'scatter':
        return {
          datasets: [{
            label: 'Severity vs Impact',
            data: findings.map(f => ({
              x: RISK_WEIGHTS[f.severity].base,
              y: f.impact || 0,
            })),
            backgroundColor: findings.map(f => severityLevels[f.severity].color),
          }],
        };
      
      case 'bubble':
        return {
          datasets: [{
            label: 'Findings Analysis',
            data: findings.map(f => ({
              x: RISK_WEIGHTS[f.severity].base,
              y: f.impact || 0,
              r: f.exploitability || 1,
            })),
            backgroundColor: findings.map(f => severityLevels[f.severity].color),
          }],
        };
      
      case 'heatmap':
        return {
          labels: Object.keys(severityLevels),
          datasets: findings.reduce((acc, f) => {
            const category = f.category || 'Uncategorized';
            if (!acc[category]) {
              acc[category] = Object.keys(severityLevels).map(() => 0);
            }
            acc[category][Object.keys(severityLevels).indexOf(f.severity)]++;
            return acc;
          }, {}),
        };
      
      default:
        return null;
    }
  };

  const renderTemplateDialog = () => (
    <Dialog
      open={showTemplateDialog}
      onClose={() => setShowTemplateDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Select Scan Template</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {Object.entries(scanTemplates).map(([key, template]) => (
            <Grid item xs={12} md={6} key={key}>
              <Paper
                sx={{
                  p: 2,
                  border: selectedTemplate === key ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  cursor: 'pointer',
                }}
                onClick={() => handleTemplateChange(key)}
              >
                <Typography variant="subtitle1">{template.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {template.description}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {template.stages.map((stage, index) => (
                    <Chip
                      key={index}
                      label={stage.name}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowTemplateDialog(false)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => {
            handleTemplateChange(selectedTemplate);
            setShowTemplateDialog(false);
          }}
        >
          Apply Template
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box component="form" onSubmit={startScan} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Scan Name"
                  value={scanConfig.name}
                  onChange={(e) => setScanConfig(prev => ({ ...prev, name: e.target.value }))}
                  required
                  helperText="Enter a descriptive name for this scan"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Target Type</InputLabel>
                  <Select
                    value={scanConfig.targetType}
                    label="Target Type"
                    onChange={(e) => handleTargetTypeChange(e.target.value)}
                  >
                    <MenuItem value="domain">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LanguageIcon fontSize="small" />
                        <Box>
                          <Typography variant="body1">Domain</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Scan a domain name
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                    <MenuItem value="url">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PublicIcon fontSize="small" />
                        <Box>
                          <Typography variant="body1">Website URL</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Scan a complete website
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                    <MenuItem value="ip">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RouterIcon fontSize="small" />
                        <Box>
                          <Typography variant="body1">IP Address</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Scan an IP address
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={`Target ${scanConfig.targetType === 'domain' ? 'Domain' : 
                          scanConfig.targetType === 'url' ? 'URL' : 'IP Address'}`}
                  value={scanConfig.target}
                  onChange={handleTargetChange}
                  error={!!targetError}
                  helperText={targetError || getTargetHelperText(scanConfig.targetType)}
                  required
                  placeholder={getTargetPlaceholder(scanConfig.targetType)}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, color: 'text.secondary' }}>
                        {scanConfig.targetType === 'domain' ? <LanguageIcon /> :
                         scanConfig.targetType === 'url' ? <PublicIcon /> :
                         <RouterIcon />}
                      </Box>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Scan Preset Selection */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Scan Preset
            </Typography>
            <RadioGroup
              value={selectedPreset}
              onChange={(e) => handlePresetChange(e.target.value)}
            >
              <Grid container spacing={2}>
                {Object.entries(scanPresets).map(([key, preset]) => (
                  <Grid item xs={12} md={6} key={key}>
                    <Paper
                      sx={{
                        p: 2,
                        border: selectedPreset === key ? '2px solid #1976d2' : '1px solid #e0e0e0',
                        cursor: 'pointer',
                      }}
                      onClick={() => handlePresetChange(key)}
                    >
                      <FormControlLabel
                        value={key}
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="subtitle1">{preset.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {preset.description}
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>
          </Paper>
        </Grid>

        {/* Scan Stages */}
        {selectedPreset !== 'custom' && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Scan Stages
              </Typography>
              <Stepper orientation="vertical">
                {scanPresets[selectedPreset].stages.map((stage, index) => (
                  <Step key={index} active={true}>
                    <StepLabel>
                      <Typography variant="subtitle1">{stage.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stage.description}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Estimated duration: {stage.duration}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {stage.checks.map((check, checkIndex) => (
                            <Chip
                              key={checkIndex}
                              label={check}
                              size="small"
                              sx={{ mr: 1, mb: 1 }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          </Grid>
        )}

        {/* Scheduling Options */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={scanConfig.schedule}
                    onChange={(e) => setScanConfig(prev => ({ ...prev, schedule: e.target.checked }))}
                  />
                }
                label="Schedule Scan"
              />
            </FormGroup>
            {scanConfig.schedule && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Schedule Time"
                    value={scanConfig.scheduleTime}
                    onChange={(e) => setScanConfig(prev => ({ ...prev, scheduleTime: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Frequency</InputLabel>
                    <Select
                      value={scanConfig.scheduleFrequency}
                      label="Frequency"
                      onChange={(e) => setScanConfig(prev => ({ ...prev, scheduleFrequency: e.target.value }))}
                    >
                      <MenuItem value="once">Once</MenuItem>
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>

        {/* Custom Scan Configuration */}
        {selectedPreset === 'custom' && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Custom Scan Configuration
              </Typography>
              <Box sx={{ mb: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Script Language</InputLabel>
                  <Select
                    value={scanConfig.customScript.language}
                    label="Script Language"
                    onChange={handleLanguageChange}
                  >
                    <MenuItem value="python">Python</MenuItem>
                    <MenuItem value="bash">Bash</MenuItem>
                    <MenuItem value="powershell">PowerShell</MenuItem>
                    <MenuItem value="javascript">JavaScript</MenuItem>
                  </Select>
                </FormControl>

                <Tabs
                  value={scriptTab}
                  onChange={handleScriptTypeChange}
                  sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
                >
                  <Tab label="Inline Script" />
                  <Tab label="Upload File" />
                </Tabs>

                {scriptTab === 0 ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    label="Custom Script"
                    value={scanConfig.customScript.content}
                    onChange={(e) => setScanConfig(prev => ({
                      ...prev,
                      customScript: {
                        ...prev.customScript,
                        content: e.target.value,
                      }
                    }))}
                    placeholder={`Enter your ${scanConfig.customScript.language} script here...`}
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ mr: 1, color: 'text.secondary' }}>
                          <CodeIcon />
                        </Box>
                      ),
                    }}
                  />
                ) : (
                  <Box>
                    <input
                      accept=".py,.sh,.ps1,.js"
                      style={{ display: 'none' }}
                      id="script-file-upload"
                      type="file"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="script-file-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<UploadIcon />}
                        sx={{ mb: 2 }}
                      >
                        Upload Script File
                      </Button>
                    </label>
                    {scanConfig.customScript.file && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Chip
                          label={scanConfig.customScript.file.name}
                          onDelete={removeFile}
                          color="primary"
                          variant="outlined"
                        />
                        <Tooltip title="Remove file">
                          <IconButton onClick={removeFile} size="small">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>
                )}

                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Your script should implement the scanning logic and return results in a structured format.
                    Available variables: target, scanId, timestamp.
                  </Typography>
                </Alert>
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Scan Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Scan Settings</Typography>
              <Button
                startIcon={<SettingsIcon />}
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              >
                {showAdvancedSettings ? 'Hide Advanced' : 'Show Advanced'}
              </Button>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography gutterBottom>Timeout (seconds)</Typography>
                <Slider
                  value={scanSettings.timeout}
                  onChange={(e, value) => setScanSettings(prev => ({ ...prev, timeout: value }))}
                  min={10}
                  max={600}
                  step={10}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography gutterBottom>Threads</Typography>
                <Slider
                  value={scanSettings.threads}
                  onChange={(e, value) => setScanSettings(prev => ({ ...prev, threads: value }))}
                  min={1}
                  max={16}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography gutterBottom>Scan Depth</Typography>
                <Slider
                  value={scanSettings.depth}
                  onChange={(e, value) => setScanSettings(prev => ({ ...prev, depth: value }))}
                  min={1}
                  max={5}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
            </Grid>

            <Collapse in={showAdvancedSettings}>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={scanSettings.advanced.followRedirects}
                            onChange={(e) => setScanSettings(prev => ({
                              ...prev,
                              advanced: {
                                ...prev.advanced,
                                followRedirects: e.target.checked,
                              },
                            }))}
                          />
                        }
                        label="Follow Redirects"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={scanSettings.advanced.verifySSL}
                            onChange={(e) => setScanSettings(prev => ({
                              ...prev,
                              advanced: {
                                ...prev.advanced,
                                verifySSL: e.target.checked,
                              },
                            }))}
                          />
                        }
                        label="Verify SSL"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom>Rate Limit (requests/second)</Typography>
                    <Slider
                      value={scanSettings.advanced.rateLimit}
                      onChange={(e, value) => setScanSettings(prev => ({
                        ...prev,
                        advanced: {
                          ...prev.advanced,
                          rateLimit: value,
                        },
                      }))}
                      min={1}
                      max={1000}
                      step={1}
                      marks
                      valueLabelDisplay="auto"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Paper>
        </Grid>

        {/* Template Selection */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Scan Template
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(scanTemplates).map(([key, template]) => (
                <Grid item xs={12} md={4} key={key}>
                  <Paper
                    sx={{
                      p: 2,
                      border: scanConfig.template === key ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleTemplateChange(key)}
                  >
                    <Typography variant="subtitle1">{template.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {template.description}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {template.stages.map((stage, index) => (
                        <Chip
                          key={index}
                          label={stage.name}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Custom Profiles */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Custom Profiles</Typography>
              <Button
                startIcon={<SaveIcon />}
                onClick={saveCustomProfile}
                disabled={!scanConfig.name}
              >
                Save Current Profile
              </Button>
            </Box>
            <Grid container spacing={2}>
              {JSON.parse(localStorage.getItem('scanProfiles') || '[]').map((profile, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper
                    sx={{
                      p: 2,
                      border: scanConfig.customProfile?.name === profile.name ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      cursor: 'pointer',
                    }}
                    onClick={() => loadCustomProfile(profile)}
                  >
                    <Typography variant="subtitle1">{profile.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Created: {new Date(profile.created).toLocaleDateString()}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={scanConfig.notificationSettings.email}
                  onChange={(e) => setScanConfig(prev => ({
                    ...prev,
                    notificationSettings: {
                      ...prev.notificationSettings,
                      email: e.target.value,
                    },
                  }))}
                />
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={scanConfig.notificationSettings.notifyOnComplete}
                        onChange={() => handleNotificationChange('notifyOnComplete')}
                      />
                    }
                    label="Notify on Scan Completion"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={scanConfig.notificationSettings.notifyOnError}
                        onChange={() => handleNotificationChange('notifyOnError')}
                      />
                    }
                    label="Notify on Errors"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={scanConfig.notificationSettings.notifyOnCritical}
                        onChange={() => handleNotificationChange('notifyOnCritical')}
                      />
                    }
                    label="Notify on Critical Findings"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Schedule Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Schedule Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={scanConfig.schedule.enabled}
                      onChange={(e) => handleScheduleChange('enabled', e.target.checked)}
                    />
                  }
                  label="Enable Scheduling"
                />
              </Grid>
              {scanConfig.schedule.enabled && (
                <>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Frequency</InputLabel>
                      <Select
                        value={scanConfig.schedule.frequency}
                        label="Frequency"
                        onChange={(e) => handleScheduleChange('frequency', e.target.value)}
                      >
                        <MenuItem value="once">Once</MenuItem>
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="time"
                      label="Time"
                      value={scanConfig.schedule.time}
                      onChange={(e) => handleScheduleChange('time', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Start Date"
                      value={scanConfig.schedule.startDate}
                      onChange={(e) => handleScheduleChange('startDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="End Date"
                      value={scanConfig.schedule.endDate}
                      onChange={(e) => handleScheduleChange('endDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Enhanced Live Monitoring Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Live Monitoring
              </Typography>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Filter Logs">
                  <IconButton onClick={() => setScanStatus(prev => ({ ...prev, showLogs: true }))}>
                    <Badge badgeContent={Object.values(scanStatus.logFilters).filter(Boolean).length} color="primary">
                      <FilterListIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Export Logs">
                  <IconButton onClick={() => setExportDialogOpen(true)}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Clear Logs">
                  <IconButton onClick={clearLogs}>
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
                {scanStatus.isRunning ? (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<StopIcon />}
                    onClick={stopScan}
                  >
                    Stop Scan
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<PlayArrowIcon />}
                    disabled={!!targetError}
                  >
                    Start Scan
                  </Button>
                )}
              </Stack>
            </Box>

            {scanStatus.isRunning && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Current Stage: {scanStatus.currentStage || 'Initializing...'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress
                    variant="determinate"
                    value={scanStatus.progress}
                    size={20}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {scanStatus.progress}%
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Real-time Metrics */}
            {scanStatus.isRunning && (
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <SpeedIcon sx={{ mr: 1 }} />
                          <Typography variant="h6">CPU Usage</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={scanStatus.metrics.cpu}
                          sx={{ height: 10, borderRadius: 5 }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {scanStatus.metrics.cpu}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <MemoryIcon sx={{ mr: 1 }} />
                          <Typography variant="h6">Memory Usage</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={scanStatus.metrics.memory}
                          sx={{ height: 10, borderRadius: 5 }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {scanStatus.metrics.memory}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <StorageIcon sx={{ mr: 1 }} />
                          <Typography variant="h6">Network I/O</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={scanStatus.metrics.network}
                          sx={{ height: 10, borderRadius: 5 }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {scanStatus.metrics.network} MB/s
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <TimerIcon sx={{ mr: 1 }} />
                          <Typography variant="h6">Duration</Typography>
                        </Box>
                        <Typography variant="h4">
                          {Math.floor(scanStatus.metrics.duration / 60)}m {scanStatus.metrics.duration % 60}s
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Log Filters */}
            <Collapse in={scanStatus.showLogs}>
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={`Info (${getLogCount('info')})`}
                    onClick={() => toggleLogFilter('info')}
                    color={scanStatus.logFilters.info ? 'primary' : 'default'}
                    variant={scanStatus.logFilters.info ? 'filled' : 'outlined'}
                  />
                  <Chip
                    label={`Success (${getLogCount('success')})`}
                    onClick={() => toggleLogFilter('success')}
                    color={scanStatus.logFilters.success ? 'success' : 'default'}
                    variant={scanStatus.logFilters.success ? 'filled' : 'outlined'}
                  />
                  <Chip
                    label={`Warning (${getLogCount('warning')})`}
                    onClick={() => toggleLogFilter('warning')}
                    color={scanStatus.logFilters.warning ? 'warning' : 'default'}
                    variant={scanStatus.logFilters.warning ? 'filled' : 'outlined'}
                  />
                  <Chip
                    label={`Error (${getLogCount('error')})`}
                    onClick={() => toggleLogFilter('error')}
                    color={scanStatus.logFilters.error ? 'error' : 'default'}
                    variant={scanStatus.logFilters.error ? 'filled' : 'outlined'}
                  />
                </Stack>
              </Box>
            </Collapse>

            {/* Log Viewer */}
            <Collapse in={scanStatus.showLogs}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  maxHeight: 300,
                  overflow: 'auto',
                  bgcolor: 'grey.50',
                }}
              >
                {getFilteredLogs().map((log, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      gap: 1,
                      mb: 1,
                      fontFamily: 'monospace',
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      {log.timestamp.toLocaleTimeString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={getLogColor(log.level)}
                    >
                      {log.message}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </Collapse>

            {/* Stage Details */}
            {Object.keys(scanStatus.stageDetails).length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Button
                  onClick={() => setScanStatus(prev => ({ ...prev, showStageDetails: !prev.showStageDetails }))}
                  startIcon={<TimelineIcon />}
                >
                  {scanStatus.showStageDetails ? 'Hide Stage Details' : 'Show Stage Details'}
                </Button>
                <Collapse in={scanStatus.showStageDetails}>
                  <Box sx={{ mt: 2 }}>
                    {Object.entries(scanStatus.stageDetails).map(([stage, details]) => (
                      <Paper key={stage} sx={{ p: 2, mb: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {stage}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Status: {details.status}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Duration: {details.startTime && details.endTime ? 
                            `${(details.endTime - details.startTime) / 1000}s` : 
                            'In progress'}
                        </Typography>
                        {details.error && (
                          <Typography variant="body2" color="error">
                            Error: {details.error}
                          </Typography>
                        )}
                        {details.details && details.details.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Details:
                            </Typography>
                            {details.details.map((detail, index) => (
                              <Typography key={index} variant="caption" display="block">
                                [{detail.timestamp.toLocaleTimeString()}] {detail.message}
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </Paper>
                    ))}
                  </Box>
                </Collapse>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Export Dialog */}
        <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
          <DialogTitle>Export Scan Results</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Format</InputLabel>
              <Select
                value={exportFormat}
                label="Format"
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <MenuItem value="pdf">PDF Document</MenuItem>
                <MenuItem value="json">JSON</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
                <MenuItem value="html">HTML Report</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => exportScanResults(exportFormat)} variant="contained">
              Export
            </Button>
          </DialogActions>
        </Dialog>

        {/* Trends Analysis */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Trends Analysis</Typography>
              <Button
                startIcon={<TrendingUpIcon />}
                onClick={() => {
                  setShowTrends(!showTrends);
                  if (!showTrends) {
                    analyzeTrends();
                  }
                }}
              >
                {showTrends ? 'Hide Trends' : 'Show Trends'}
              </Button>
            </Box>
            {showTrends && trendsData && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Severity Trends
                    </Typography>
                    <Box sx={{ height: 200 }}>
                      {/* This would typically use a charting library */}
                      <Typography variant="body2" color="text.secondary">
                        Severity distribution over time
                      </Typography>
                      {Object.entries(trendsData.severityTrends).map(([severity, counts]) => (
                        <Box key={severity} sx={{ mt: 1 }}>
                          <Typography variant="caption">
                            {severityLevels[severity].label}: {counts.join(' → ')}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Finding Types
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {Object.entries(trendsData.findingTypes).map(([type, count]) => (
                        <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">{type}</Typography>
                          <Typography variant="body2">{count}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Resolution Rate
                    </Typography>
                    <Box sx={{ height: 200 }}>
                      {/* This would typically use a charting library */}
                      <Typography variant="body2" color="text.secondary">
                        Average resolution rate: {Math.round(
                          trendsData.resolutionRate.reduce((a, b) => a + b, 0) / 
                          trendsData.resolutionRate.length
                        )}%
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>

        {/* Scan History */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Scan History</Typography>
              <Button
                startIcon={<CompareIcon />}
                onClick={() => setShowComparison(!showComparison)}
                disabled={selectedScans.length !== 2}
              >
                Compare Selected Scans
              </Button>
            </Box>
            <Grid container spacing={2}>
              {scanHistory.map((scan) => (
                <Grid item xs={12} md={6} key={scan.id}>
                  <Paper
                    sx={{
                      p: 2,
                      border: selectedScans.includes(scan.id) ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      if (selectedScans.includes(scan.id)) {
                        setSelectedScans(selectedScans.filter(id => id !== scan.id));
                      } else if (selectedScans.length < 2) {
                        setSelectedScans([...selectedScans, scan.id]);
                      }
                    }}
                  >
                    <Typography variant="subtitle1">{scan.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(scan.timestamp).toLocaleString()}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        Status: {scan.status}
                      </Typography>
                      {scan.findings && (
                        <Box sx={{ mt: 1 }}>
                          {Object.entries(severityLevels).map(([level, { label, color }]) => {
                            const count = scan.findings.filter(f => f.severity === level).length;
                            return count > 0 ? (
                              <Chip
                                key={level}
                                label={`${label}: ${count}`}
                                color={color}
                                size="small"
                                sx={{ mr: 1, mb: 1 }}
                              />
                            ) : null;
                          })}
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Scan Comparison */}
        {showComparison && comparisonResults && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Scan Comparison
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1">
                    {comparisonResults.scan1.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comparisonResults.scan1.timestamp).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1">
                    {comparisonResults.scan2.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comparisonResults.scan2.timestamp).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    New Findings
                  </Typography>
                  {comparisonResults.differences.newFindings.map((finding, index) => (
                    <Paper key={index} sx={{ p: 1, mb: 1 }}>
                      <Typography variant="body2">
                        {finding.description}
                      </Typography>
                      <SeverityIndicator level={finding.severity} />
                    </Paper>
                  ))}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Resolved Findings
                  </Typography>
                  {comparisonResults.differences.resolvedFindings.map((finding, index) => (
                    <Paper key={index} sx={{ p: 1, mb: 1 }}>
                      <Typography variant="body2">
                        {finding.description}
                      </Typography>
                      <SeverityIndicator level={finding.severity} />
                    </Paper>
                  ))}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Severity Changes
                  </Typography>
                  {comparisonResults.differences.severityChanges.map((change, index) => (
                    <Paper key={index} sx={{ p: 1, mb: 1 }}>
                      <Typography variant="body2">
                        Finding ID: {change.id}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <SeverityIndicator level={change.oldSeverity} />
                        <Typography>→</Typography>
                        <SeverityIndicator level={change.newSeverity} />
                      </Box>
                    </Paper>
                  ))}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}

        {/* Add Report Section */}
        {!scanStatus.isRunning && reportData.summary.totalFindings > 0 && renderReportSection()}

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScanForm; 