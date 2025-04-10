import axios from 'axios';

const API_URL = '/api/file-upload';

class FileUploadService {
  async uploadFile(formData: FormData) {
    const response = await axios.post(`${API_URL}/single`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async uploadMultipleFiles(formData: FormData) {
    const response = await axios.post(`${API_URL}/multiple`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getFilesByEntity(entityType: string, entityId: string) {
    const response = await axios.get(`${API_URL}/entity/${entityType}/${entityId}`);
    return response.data;
  }

  async getFileById(id: string) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  }

  async downloadFile(id: string) {
    window.open(`${API_URL}/download/${id}`, '_blank');
  }

  async deleteFile(id: string) {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
}

export default new FileUploadService();
