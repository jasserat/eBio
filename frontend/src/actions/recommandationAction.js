import axios from 'axios';

export const api = axios.create({ baseURL: 'http://127.0.0.1:5555', responseType: 'json' });

/* emna */
export const RecommandationApi = {
  async generateRecommandationList(body) {
    const { data } = await api.post(`/predict`, body);
    return data;
  },
};
