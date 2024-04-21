import { toast } from "react-toastify";
import api from "./axios.config";

interface Thread {
  title: string;
  content: string;
}

interface RootReply {
  content: string;
}

async function createThread(thread: Thread, token: string) {
  try {
    const newThread = {
      ...thread,
      date: new Date(),
    };
    const response = await api.post("/threads/create", newThread, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (e) {
    toast.error("Unable to create thread");
  }
}

async function getThreads(token: string) {
  try {
    const response = await api.get("/threads/", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (e) {
    toast.error("Unable to get threads");
  }
}

async function getThreadById(token: string, id: string) {
  try {
    const response = await api.get(`/threads/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (e) {
    toast.error("Unable to get thread");
  }
}

async function createRootReply(rootReply: RootReply, id: string, token: string) {
  try {
    const newRootReply = {
      ...rootReply,
      date: new Date(),
    }
    const response = await api.post(`/threads/${id}/reply`, newRootReply, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (e) {
    toast.error("Unable to create root reply");
  }
}

const ThreadAPI = {
  createThread,
  getThreads,
  getThreadById,
  createRootReply,
}

export default ThreadAPI;
