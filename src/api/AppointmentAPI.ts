import { toast } from "react-toastify";
import api from "./axios.config";

interface CreateAppointmentData {
  tags: string[],
  request: string,
}

async function createAppointmentRequest(data: CreateAppointmentData, token: string) {
  try {
    const updatedData = {
      ...data,
      date: new Date(),
    }
    const response = await api.post("/appointments/create", updatedData, {
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
    const response = await api.get("/appointments/", {
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
    const response = await api.put("/appointments/resolve", { id }, {
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