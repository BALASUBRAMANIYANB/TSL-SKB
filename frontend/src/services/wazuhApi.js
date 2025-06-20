import axios from 'axios';

const API_BASE = '/api/wazuh'; // Adjust if your backend uses a different route

// --- Agent Management ---
export const listAgents = async () => axios.get(`${API_BASE}/agents`);
export const getAgent = async (id) => axios.get(`${API_BASE}/agents/${id}`);
export const addAgent = async (data) => axios.post(`${API_BASE}/agents`, data);
export const deleteAgent = async (id) => axios.delete(`${API_BASE}/agents/${id}`);

// --- Manager & Cluster ---
export const getManagerInfo = async () => axios.get(`${API_BASE}/manager/info`);
export const getManagerStats = async () => axios.get(`${API_BASE}/stats`);
export const getClusterInfo = async () => axios.get(`${API_BASE}/cluster`);

// --- File Integrity Monitoring (FIM) ---
export const getFIMEvents = async (agentId) => axios.get(`${API_BASE}/fim/${agentId}`);

// --- MITRE ATT&CK ---
export const getMitreInfo = async () => axios.get(`${API_BASE}/mitre`);

// --- Ruleset & Rule/Decoder Testing ---
export const getRules = async () => axios.get(`${API_BASE}/rules`);
export const getRule = async (id) => axios.get(`${API_BASE}/rules/${id}`);
export const testRule = async (data) => axios.post(`${API_BASE}/rules/test`, data);

// --- Syscollector ---
export const getSyscollectorInfo = async (agentId) => axios.get(`${API_BASE}/syscollector/${agentId}`);

// --- RBAC ---
export const getRoles = async () => axios.get(`${API_BASE}/roles`);

// --- API Management ---
export const getApiConfig = async () => axios.get(`${API_BASE}/api-config`);

// --- Users Management ---
export const listUsers = async () => axios.get(`${API_BASE}/users`);
export const getUser = async (id) => axios.get(`${API_BASE}/users/${id}`);

// --- Stats ---
export const getStats = async () => axios.get(`${API_BASE}/stats`);

// --- Remote Config ---
export const getRemoteConfig = async (agentId) => axios.get(`${API_BASE}/remote-config/${agentId}`);

// --- Advanced Wazuh Features ---
export const listActiveResponses = async () => axios.get(`${API_BASE}/active-responses`);
export const triggerActiveResponse = async (data) => axios.post(`${API_BASE}/active-responses/trigger`, data);
export const listDecoders = async () => axios.get(`${API_BASE}/decoders`);
export const testDecoder = async (data) => axios.post(`${API_BASE}/decoders/test`, data);
export const listRules = async () => axios.get(`${API_BASE}/rules`);
export const createRule = async (data) => axios.post(`${API_BASE}/rules`, data);
export const updateRule = async (id, data) => axios.put(`${API_BASE}/rules/${id}`, data);
export const deleteRule = async (id) => axios.delete(`${API_BASE}/rules/${id}`);
export const listAgentGroups = async () => axios.get(`${API_BASE}/agent-groups`);
export const createAgentGroup = async (data) => axios.post(`${API_BASE}/agent-groups`, data);
export const assignAgentToGroup = async (agentId, groupId) => axios.post(`${API_BASE}/agent-groups/${groupId}/assign`, { agentId });
export const removeAgentFromGroup = async (agentId, groupId) => axios.post(`${API_BASE}/agent-groups/${groupId}/remove`, { agentId });
export const upgradeAgent = async (agentId) => axios.post(`${API_BASE}/agents/${agentId}/upgrade`);
export const restartAgent = async (agentId) => axios.post(`${API_BASE}/agents/${agentId}/restart`);
export const runRemoteCommand = async (agentId, command) => axios.post(`${API_BASE}/agents/${agentId}/command`, { command });
export const getVulnerabilities = async (agentId) => axios.get(`${API_BASE}/agents/${agentId}/vulnerabilities`);
export const searchEvents = async (params) => axios.get(`${API_BASE}/events/search`, { params });
export const getFIMConfig = async (agentId) => axios.get(`${API_BASE}/fim/${agentId}/config`);
export const updateFIMConfig = async (agentId, data) => axios.put(`${API_BASE}/fim/${agentId}/config`, data);
export const getSyscollectorHistory = async (agentId) => axios.get(`${API_BASE}/syscollector/${agentId}/history`);
export const getMitreMapping = async () => axios.get(`${API_BASE}/mitre/mapping`); 