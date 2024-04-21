import axios from 'axios';

const api = axios.create({
  baseURL: `https://bitcamp2024server.onrender.com`,
  headers: { 'content-type': 'application/json' },
});

export default api;
