import { toast } from "react-toastify";
import api from "./axios.config";

interface UserInfo {
  name: string;
  email: string;
  profilePicture: string;
}

async function getUserInfo(token: string) {
  try {
    const response = await api.get("/users/info", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data as UserInfo;
  } catch (e) {
    toast.error("Unable to get user info");
  }
}

const UserAPI = {
  getUserInfo,
};

export default UserAPI;