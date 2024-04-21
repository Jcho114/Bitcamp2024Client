import axios from 'axios';

const api = axios.create({
  baseURL: "/cors-proxy/",
});

export default api;
