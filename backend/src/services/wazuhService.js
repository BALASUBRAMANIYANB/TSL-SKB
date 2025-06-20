const axios = require('axios');
const Setting = require('../models/setting');

// Helper function to create a dynamic Axios instance
const getWazuhInstance = async () => {
  const apiUrlSetting = await Setting.findOne({ key: 'wazuhApiUrl' });
  const apiKeySetting = await Setting.findOne({ key: 'wazuhApiKey' });

  if (!apiUrlSetting || !apiKeySetting) {
    throw new Error('Wazuh API URL or Key not configured.');
  }

  return axios.create({
    baseURL: apiUrlSetting.value,
    headers: {
      'Authorization': `Bearer ${apiKeySetting.value}`,
      'Content-Type': 'application/json'
    }
  });
};

class WazuhService {
  constructor() {
    this.apiUrl = process.env.WAZUH_API_URL;
    this.username = process.env.WAZUH_API_USER;
    this.password = process.env.WAZUH_API_PASS;
    this.token = null;
  }

  async authenticate() {
    if (this.token) return this.token;
    const response = await axios.post(
      `${this.apiUrl}/security/user/authenticate`,
      {
        username: this.username,
        password: this.password
      }
    );
    this.token = response.data.data.token;
    return this.token;
  }

  async getHeaders() {
    const token = await this.authenticate();
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // --- Agent Management ---
  async listAgents() {
    const wazuh = await getWazuhInstance();
    const response = await wazuh.get('/agents');
    return response.data.data.affected_items;
  }

  async getAgent(agentId) {
    const headers = await this.getHeaders();
    const response = await axios.get(`${this.apiUrl}/agents/${agentId}`, { headers });
    return response.data.data.affected_items[0];
  }

  async addAgent(agentData) {
    const headers = await this.getHeaders();
    const response = await axios.post(`${this.apiUrl}/agents`, agentData, { headers });
    return response.data.data.affected_items[0];
  }

  async deleteAgent(agentId) {
    const headers = await this.getHeaders();
    const response = await axios.delete(`${this.apiUrl}/agents/${agentId}`, { headers });
    return response.data.data.affected_items[0];
  }

  // --- Manager Control & Overview ---
  async getManagerInfo() {
    const wazuh = await getWazuhInstance();
    const response = await wazuh.get('/manager/info');
    return response.data.data;
  }

  async getManagerStats() {
    const wazuh = await getWazuhInstance();
    const response = await wazuh.get('/manager/stats/hourly');
    return response.data.data;
  }

  async getSystemStats() {
    const wazuh = await getWazuhInstance();
    const response = await wazuh.get('/stats');
    return response.data.data;
  }

  // --- Cluster Control & Overview ---
  async getClusterInfo() {
    const headers = await this.getHeaders();
    const response = await axios.get(`${this.apiUrl}/cluster/status`, { headers });
    return response.data.data;
  }

  // --- File Integrity Monitoring (FIM) ---
  async getFIMEvents(agentId) {
    const headers = await this.getHeaders();
    const response = await axios.get(`${this.apiUrl}/fim/${agentId}/events`, { headers });
    return response.data.data.affected_items;
  }

  // --- MITRE ATT&CK Overview ---
  async getMitreInfo() {
    const headers = await this.getHeaders();
    const response = await axios.get(`${this.apiUrl}/mitre`, { headers });
    return response.data.data.affected_items;
  }

  // --- Ruleset Information ---
  async getRules() {
    const headers = await this.getHeaders();
    const response = await axios.get(`${this.apiUrl}/rules`, { headers });
    return response.data.data.affected_items;
  }

  async getRule(ruleId) {
    const headers = await this.getHeaders();
    const response = await axios.get(`${this.apiUrl}/rules/${ruleId}`, { headers });
    return response.data.data.affected_items[0];
  }

  // --- Rules/Decoders Testing & Verification ---
  async testRule(ruleTestData) {
    // Stub: Implement rule testing logic as per Wazuh API
    // POST /rules/test
    const headers = await this.getHeaders();
    const response = await axios.post(`${this.apiUrl}/rules/test`, ruleTestData, { headers });
    return response.data.data;
  }

  // --- Syscollector Information ---
  async getSyscollectorInfo(agentId) {
    const headers = await this.getHeaders();
    const response = await axios.get(`${this.apiUrl}/syscollector/${agentId}/hardware`, { headers });
    return response.data.data.affected_items;
  }

  // --- RBAC ---
  async getRoles() {
    const headers = await this.getHeaders();
    const response = await axios.get(`${this.apiUrl}/security/roles`, { headers });
    return response.data.data.affected_items;
  }

  // --- API Management ---
  async getApiConfig() {
    const headers = await this.getHeaders();
    const response = await axios.get(`${this.apiUrl}/manager/configuration/api`, { headers });
    return response.data.data;
  }

  // --- Users Management ---
  async listUsers() {
    const headers = await this.getHeaders();
    const response = await axios.get(`${this.apiUrl}/security/users`, { headers });
    return response.data.data.affected_items;
  }

  async getUser(userId) {
    const headers = await this.getHeaders();
    const response = await axios.get(`${this.apiUrl}/security/users/${userId}`, { headers });
    return response.data.data.affected_items[0];
  }

  // --- Statistical Information ---
  async getStats() {
    const headers = await this.getHeaders();
    const response = await axios.get(`${this.apiUrl}/stats/summary`, { headers });
    return response.data.data;
  }

  // --- Error Handling ---
  // All methods throw on error; you can add custom error handling as needed.

  // --- Query Remote Configuration ---
  async getRemoteConfig(agentId) {
    const headers = await this.getHeaders();
    const response = await axios.get(`${this.apiUrl}/agents/${agentId}/config`, { headers });
    return response.data.data.affected_items;
  }
}

const wazuhService = new WazuhService();

// Export the service instance AND the helper function for the /test endpoint
module.exports = {
  wazuhService,
  getWazuhInstance
}; 