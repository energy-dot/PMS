import axios from 'axios';

const API_URL = '/api/workflows';

class WorkflowService {
  async getRequestHistories() {
    const response = await axios.get(`${API_URL}/request-histories`);
    return response.data;
  }

  async getRequestHistoryById(id: string) {
    const response = await axios.get(`${API_URL}/request-histories/${id}`);
    return response.data;
  }

  async getRequestHistoriesByProjectId(projectId: string) {
    const response = await axios.get(`${API_URL}/request-histories/project/${projectId}`);
    return response.data;
  }

  async getRequestHistoriesByRequesterId(requesterId: string) {
    const response = await axios.get(`${API_URL}/request-histories/requester/${requesterId}`);
    return response.data;
  }

  async getRequestHistoriesByStatus(status: string) {
    const response = await axios.get(`${API_URL}/request-histories/status/${status}`);
    return response.data;
  }

  async createRequestHistory(requestHistoryData: any) {
    const response = await axios.post(`${API_URL}/request-histories`, requestHistoryData);
    return response.data;
  }

  async updateRequestHistory(id: string, requestHistoryData: any) {
    const response = await axios.patch(`${API_URL}/request-histories/${id}`, requestHistoryData);
    return response.data;
  }

  async removeRequestHistory(id: string) {
    const response = await axios.delete(`${API_URL}/request-histories/${id}`);
    return response.data;
  }

  async requestProjectApproval(projectId: string, data: { requesterId: string; remarks?: string }) {
    const response = await axios.post(`${API_URL}/projects/${projectId}/request-approval`, data);
    return response.data;
  }

  async approveProject(requestHistoryId: string, data: { approverId: string; remarks?: string }) {
    const response = await axios.post(
      `${API_URL}/request-histories/${requestHistoryId}/approve`,
      data
    );
    return response.data;
  }

  async rejectProject(
    requestHistoryId: string,
    data: { approverId: string; rejectionReason: string }
  ) {
    const response = await axios.post(
      `${API_URL}/request-histories/${requestHistoryId}/reject`,
      data
    );
    return response.data;
  }

  async getPendingApprovals() {
    const response = await axios.get(`${API_URL}/pending-approvals`);
    return response.data;
  }
}

export default new WorkflowService();
