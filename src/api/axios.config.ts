import axios from 'axios';

const api = axios.create({
  baseURL: "https://bitcamp2024server.onrender.com",
});

export default api;
