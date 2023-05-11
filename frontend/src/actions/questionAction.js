import axios from 'axios';

export const api = axios.create({ baseURL: 'https://ebio-backend.onrender.com/questions', responseType: 'json' });

/* emna */
export const QuestionApi = {
  async getQuestions(body) {
    const { data } = await api.get('/getall', body);
    return data;
  },
  async getQuestionById(token) {
    const { data } = await api.get(`/${token}`);
    return data;
  },
  async getQuestionsByClient(clientId) {
    const { data } = await api.get(`/client/${clientId}`);
    return data;
  },
  async createQuestion(body) {
    const { data } = await api.post('/', body);
    return data;
  },
  async editQuestion(questionId, body) {
    const { data } = await api.put(`/${questionId}`, body);
    return data;
  },
  async deleteQuestion(questionId) {
    const { data } = await api.delete(`/${questionId}`);
    return data;
  },
  async getUnansweredQuestions() {
    const { data } = await api.get('/unanswered');
    return data;
  },
  async getAnsweredQuestions() {
    const { data } = await api.get('/answered');
    return data;
  },
  async answerQuestion(questionId, body) {
    const { data } = await api.post(`/${questionId}/answer/`, body);
    return data;
  },
};
