const Setting = require('../models/setting');
const fetch = require('node-fetch');

class IntegrationsService {
  // Send a message to Slack
  static async sendSlackNotification(message) {
    const webhookSetting = await Setting.findOne({ key: 'slackWebhookUrl' });
    if (!webhookSetting || !webhookSetting.value) {
      throw new Error('Slack webhook URL not configured');
    }
    const response = await fetch(webhookSetting.value, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message })
    });
    if (!response.ok) {
      throw new Error('Failed to send Slack notification');
    }
    return true;
  }

  // Create a Jira issue
  static async createJiraIssue({ summary, description, severity }) {
    const urlSetting = await Setting.findOne({ key: 'jiraUrl' });
    const emailSetting = await Setting.findOne({ key: 'jiraEmail' });
    const apiTokenSetting = await Setting.findOne({ key: 'jiraApiToken' });
    const projectKeySetting = await Setting.findOne({ key: 'jiraProjectKey' });
    if (!urlSetting || !emailSetting || !apiTokenSetting || !projectKeySetting) {
      throw new Error('Jira integration not fully configured');
    }
    const jiraUrl = urlSetting.value;
    const jiraEmail = emailSetting.value;
    const jiraApiToken = apiTokenSetting.value;
    const jiraProjectKey = projectKeySetting.value;
    const auth = Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString('base64');
    const response = await fetch(`${jiraUrl}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          project: { key: jiraProjectKey },
          summary,
          description,
          issuetype: { name: 'Bug' },
          priority: { name: severity === 'critical' ? 'Highest' : severity.charAt(0).toUpperCase() + severity.slice(1) },
        }
      })
    });
    if (!response.ok) {
      throw new Error('Failed to create Jira issue');
    }
    return true;
  }
}

module.exports = IntegrationsService; 