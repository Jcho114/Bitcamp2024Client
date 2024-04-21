import { useQuery } from "@tanstack/react-query";
import PulseLoader from "react-spinners/PulseLoader";
import AppointmentAPI from "../api/AppointmentAPI";
import { useAppSelector } from "../redux/redux.hooks";
import { useDispatch } from "react-redux";
import { updateAppointment } from "../redux/appointmentSlice";
import { useNavigate } from "react-router-dom";

function Teach() {
  return(
    <div className="flex flex-col items-center gap-4">
      <h1 className="font-bold text-4xl">Teaching Panel</h1>
      <div className="flex w-[90vw] border-black border h-[70vh] items-center justify-center">
        <div className="flex flex-col justify-center border-r border-black items-center bg-gray-400 w-[25%] h-[100%]">
          <h1 className="font-bold text-lg">Appointment Requests</h1>
        </div>
        <div className="flex flex-col bg-gray-200 w-[75%] h-[100%] items-center justify-center">
          <Appointments />
        </div>
      </div>
    </div>
  )
}

interface AppointmentRequest {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  request: string;
  tags: string[];
}

function Appointments() {
  const token = useAppSelector(state => state.token.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      return await AppointmentAPI.getAppointmentRequests(token);
    }
  });

  function handleAssistClick(roomId: string) {
    dispatch(updateAppointment([roomId, "TEACHER"]));
    navigate("/call");
  }

  if (isLoading) {
    return <PulseLoader color="red" loading={true} size={15} />
  }

  if (error) {
    return "Error...";
  }
  
  return (
    <div className="flex flex-col w-full items-center p-5 gap-4 overflow-y-auto">
      {data.length > 0 ? data.map((appointmentRequest: AppointmentRequest, index: number) => (
        <div
          key={index}
          className="flex flex-col gap-2 w-full items-start bg-gray-200 justify-center p-5 border-black border rounded"
        >
          <h1><span className="font-bold">Student Name:</span> {appointmentRequest.studentName}</h1>
          <h1><span className="font-bold">Date Requested:</span> {appointmentRequest.date} {appointmentRequest.time}</h1>
          <h1 className="font-bold">Request:</h1>
          <h1>"{appointmentRequest.request}"</h1>
          <h1 className="font-bold">Tags:</h1>
          <div className="flex gap-1">
            {appointmentRequest.tags.map((tag, index) => <div className="px-2 bg-gray-300 border-black border rounded-md" key={index}>{tag}</div>)}
          </div>
          <button
            className="border border-black bg-gray-300 px-2 py-1 rounded-md mt-2"
            onClick={() => handleAssistClick(appointmentRequest.id)}
          >
            Assist Student
          </button>
        </div>
      )) : <h1>No appointments at the moment...</h1>}
    </div>
  )
}

export default Teach;