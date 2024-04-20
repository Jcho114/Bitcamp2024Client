import api from "./axios.config";

interface LoginData {
  email: string;
  password: string;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

// TODO - Handle Refresh Tokens

async function login(data: LoginData) {
  try {
    const response = await api.post("/auth/login", data);
    return response.data.accessToken;
  } catch (e) {
    throw e;
  }
}

async function signup(data: SignUpData) {
  try {
    const response = await api.post("/auth/signup", data);
    return response.data.accessToken;
  } catch(e) {
    throw e;
  }
}

const AuthAPI = {
  login,
  signup,
}

export default AuthAPI;
