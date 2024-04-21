import axios from 'axios';

const api = axios.create({
  baseURL: `/cors-proxy/`,
  headers: { 'content-type': 'application/json' },
});

export default api;
