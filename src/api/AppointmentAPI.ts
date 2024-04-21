import { toast } from "react-toastify";
import axios from "axios";

interface CreateAppointmentData {
  tags: string[],
  request: string,
}

async function createAppointmentRequest(data: CreateAppointmentData, token: string) {
  try {
    console.log(new Date().getDate(), new Date().getTime());
    const updatedData = {
      ...data,
      date: new Date().toISOString(),
    }
    const response = await axios.post("/cors-proxy/appointments/create", updatedData, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (e) {
    toast.error("Unable to create appointment request");
  }
}

async function getAppointmentRequests(token: string) {
  try {
    const response = await axios.get("/cors-proxy/appointments/", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (e) {
    toast.error("Unable to get appointment requests");
  }
}

async function resolveAppointment(id: string, token: string) {
  try {
    const response = await axios.put("/cors-proxy/https://bitcamp2024server.onrender.com/appointments/resolve", { id }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch(e) {
    toast.error("Unable to resolve appointment");
  }
}

const AppointmentAPI = {
  getAppointmentRequests,
  createAppointmentRequest,
  resolveAppointment,
};

export default AppointmentAPI;