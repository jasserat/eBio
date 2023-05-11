/* eslint-disable */
import axios from 'axios';

export const api = axios.create({ baseURL: 'https://ebio-backend.onrender.com/user', responseType: 'json' });

/* emna */
export const UserApi = {
  async register(body) {
    const { data } = await api.post('/register', body);
    return data;
  },
  async getUserById(token) {
    const { data } = await api.get(`/profile/${token}`);
    return data;
  },
  async getUserByRole(role) {
    const { data } = await api.get(`/getUserByRole?role=${role}`);
    return data;
  },
  async editUserProfile(userId, body) {
    const { data } = await api.put(`/${userId}`, body);
    return data;
  }, async getUsers() {
    const { data } = await api.get('/listUsers');
    return data;
  },async searchUsers(body) {

    const { data } = await api.get('/userSearch', body)
    return data;
  },
  async editUserProfilling(userId, body) {
    const { data } = await api.put(`/editUserProfilling/${userId}`, body);
    return data;
  }
};

export const PassApi ={
  async forgetPassword(email){
      const {data} = await api.post('/forgetPassword',email)
      return data;
  },
  async newPassword(newPass,code,id){
      const {data} = await api.put(`/newPass/${code}/${id}`,newPass);

      return data;
  },
  async resetPassword(oldPassword,newPassword,id){

    const {data} = await api.put(`/resetPassword/${id}`,oldPassword,newPassword);

    return data;
}
};
//   async getUsers() {
//     const { data } = await api.get('/listUsers');
//     return data;
//   },
//   async searchUsers(body) {
//     const { data } = await api.get('/userSearch', body);
//     return data;
//   },
// };
