import axios from 'axios';

export const api = axios.create({ baseURL: 'https://ebio-backend.onrender.com/basket', responseType: 'json' });

export const orderApi = {
  
    async addToBasket( userId,productId){
      const {data} = await api.post(`/add-to-basket/${userId}`, {productId}  );
  
      return data;
  },
  async showBasket( userId){
    const {data} = await api.get(`/show-basket/${userId}`  );
  
    return data;
  },
  async deleteFromBasket( userId ,productId){
    const {data} = await api.delete(`/delete/${userId}` , {productId} );
  
    return data;
  },

  async createOrder( userId , consumptionDate , members , deliverySpot ){
    const {data} = await api.post(`/createOrder/${userId}` , {consumptionDate , members , deliverySpot} );

  
    return data;
  },
  async getAllOrders( ){
    const {data} = await api.get(`/orders/` );
  
    return data;
  },
  async getOrderById(orderId ){
    
    const {data} = await api.get(`/order/${orderId}` );
  
    return data;
  },
  async updateState(orderId ){
    
    const {data} = await api.post(`/updateState/${orderId}` );
  
    return data;
  }
  };

  
