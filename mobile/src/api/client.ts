import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'https://footstep-tracker-1.onrender.com/api/v1';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('user_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
