import axios from 'axios';

export const api = axios.create({ baseURL: 'https://ebio-backend.onrender.com/appointments', responseType: 'json' });

/* emna */
export const AppointmentApi = {
  async getAppointments(body) {
    const { data } = await api.get('/', body);
    return data;
  },
  async getAppointmentById(token) {
    const { data } = await api.get(`/${token}`);
    return data;
  },
  async createAppointment(body) {
    const { data } = await api.post(`/`, body);
    return data;
  },
  async updateAppointment(appointmentId, body) {
    const { data } = await api.put(`/${appointmentId}`, body);
    return data;
  },
  async deleteAppointment(appointmentId) {
    const { data } = await api.delete(`/${appointmentId}`);
    return data;
  },
  async getAppointmentsByDate(body) {
    const { data } = await api.get(`/date`, body);
    return data;
  },
  async getAppointmentsByLocation(body) {
    const { data } = await api.get(`/location`, body);
    return data;
  },
  async getAppointmentsByNutritionist(nutId) {
    const { data } = await api.get(`/nutritionist?nutritionist=${nutId}`);
    return data;
  },
  async getAppointmentsByNutritionistCalendar(nutId) {
    const { data } = await api.get(`/nutritionistCalendar?nutritionist=${nutId}`);
    return data;
  },
  async getAppointmentsByClient(clientId) {
    const { data } = await api.get(`/client?client=${clientId}`);
    return data;
  },
  async getAppointmentsByStatus(body) {
    const { data } = await api.get(`/status`, body);
    return data;
  },
  async acceptOrDeclineAppointment(appointmentId, action) {
    const { data } = await api.put(`/acceptOrDecline/${appointmentId}?action=${action}`);
    return data;
  },
};
