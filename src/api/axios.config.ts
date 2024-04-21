import axios from 'axios';

axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';

const api = axios.create({
  baseURL: "https://bitcamp2024server.onrender.com",
});

export default api;
