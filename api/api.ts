import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const api = axios.create({
  baseURL: 'https://prod.outdoorcommunityproject.com',
  // baseURL: 'https://staging.outdoorcommunityproject.com',
  // baseURL: Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (req) => {
  req.headers = req.headers || {};
  req.headers.Authorization = `Bearer ${await SecureStore.getItemAsync('accessToken')}`;
  return req;
})

api.interceptors.response.use((response) => response, async (error) => {
  const { response: errorResponse, config: originalRequest } = error;
  try {
    if (errorResponse.status === 401 && originalRequest && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      originalRequest._retry = true;
      await api.post('/auth/refresh', {
        refreshToken: await SecureStore.getItemAsync('refreshToken'),
      }).then(async (response) => {
        if (response.status === 201 && response.data.refreshToken) {
          await SecureStore.setItemAsync('accessToken', response.data.refreshToken);
          api.defaults.headers!.Authorization = `Bearer ${await SecureStore.getItemAsync('accessToken')}`;
          return api.request(originalRequest);
        }
      }).catch(async (e) => {
        if (e.response.status === 401) {
          await SecureStore.deleteItemAsync('refreshToken');
          await SecureStore.deleteItemAsync('accessToken');
        }
      });
    } else if (originalRequest.url === '/auth/refresh' && originalRequest._retry) {
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('accessToken');
      return Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  } catch (authError) {
    return Promise.reject(error);
  }
  originalRequest._retry = true;
  return api.request(originalRequest);
});

export default api;
