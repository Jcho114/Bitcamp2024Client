import { SetStateAction, useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";
import ClipLoader from "react-spinners/ClipLoader";
import Avatar from "react-avatar";
import { MdCallEnd } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import UserAPI from "../api/UserAPI";
import { useAppSelector } from "../redux/redux.hooks";
import AppointmentAPI from "../api/AppointmentAPI";
import { useNavigate } from "react-router-dom";
import { IoIosCall } from "react-icons/io";

const socket = io(`/cors-proxy/https://bitcamp2024server.onrender.com/teach`, {
  autoConnect: true,
});

interface Message {
  name: string;
  content: string;
}

const MAX_CHARS = 256;

function Call() {
  const token = useAppSelector(state => state.token.value);
  const appointment = useAppSelector(state => state.appointment.value);
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ["usercallinfo"],
    queryFn: async () => {
      return await UserAPI.getUserInfo(token);
    },
  });

  const [stream, setStream] = useState<MediaStream>();
  const [me, setMe] = useState<string>("");
  const [receivingCall, setReceivingCall] = useState<boolean>();
  const [_, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState<string | Peer.SignalData>("");
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [messageContent, setMessageContent] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [ready, setReady] = useState(false);

  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<Peer.Instance | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  async function resolveAppointment() {
    await AppointmentAPI.resolveAppointment(appointment[0], token);
  }

  useEffect(() => {
    console.log(appointment);

    if (!appointment[0]) {
      navigate("/");
    }

    window.addEventListener("beforeunload", resolveAppointment);

    socket.emit("joinRoom", appointment);

    socket.on("me", (id: string) => {
      setMe(id);
    });

    if (appointment[1] === "STUDENT") {
      socket.on("getFrom", (id: string) => {
        console.log("getFrom", me);
        socket.emit("sendFrom", {
          from: me,
          to: id,
        });
      });

      socket.on("callUser", (data: { from: string, name: string, signal: string | Peer.SignalData }) => {
        setReceivingCall(true);
        console.log("callUser", data);
        setCaller(data.from);
        setName(data.name);
        setCallerSignal(data.signal);
      });
    }

    return () => {
      window.removeEventListener("beforeunload", resolveAppointment)
    }
  }, []);

  useEffect(() => {
    // Ask for webcam and mic permission
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
    });
  }, [ready]);

  function handleMessageEvent(name: string, content: string) {
    setMessages([...messages, { name, content }]);
  }

  useEffect(() => {
    socket.on("message", handleMessageEvent);

    if (messagesRef.current) {
      messagesRef.current.scrollIntoView();
    }
  }, [messages]);

  function callUser() {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    
    peer.on("signal", (data) => {
      console.log("signal me", me);
      socket.emit("callUser", {
        roomId: appointment[0],
        signal: data,
        from: me,
        name: name
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  }

  function answerCall() {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, roomId: appointment[0] });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  }

  function leaveCall() {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    navigate("/");
  }

  function handleMessageChange(e: { target: { value: SetStateAction<string>; }; }) {
    if (e.target.value.length <= MAX_CHARS) {
      setMessageContent(e.target.value);
    }
  }

  function handleMessageInput(e: { keyCode: number; shiftKey: boolean; preventDefault: () => void; }) {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      if (messageContent === "/clear") {
        setMessages([]);
      } else {
        setMessages([...messages, { name: data?.name || "dummy", content: messageContent }]);
        socket.emit("message", {
          roomId: appointment[0],
          name: data?.name,
          content: messageContent
        });
      }
      setMessageContent("");
    }
  }

  if (isLoading) {
    return "Loading...";
  }

  if (error) {
    return "Error...";
  }

  function studentReady() {
    setReady(true);
  }

  function teacherReady() {
    setReady(true);
    callUser();
  }

  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center absolute w-full gap-5">
          <h1 className="text-xl">Take a few moments to get ready...</h1>
          <button
            className="border border-black rounded-md px-2 py-1 hover:bg-gray-100"
            onClick={() => {
              appointment[1] === "TEACHER" ? teacherReady() : studentReady();
            }}
          >
            Ready!
          </button>
        </div>
    )
  }

  return (
    <div className="flex gap-10 w-screen p-10 justify-center items-center">
      <div className="flex flex-col gap-2.5">
        <div className="flex w-[65vw] h-[72vh] border-black border rounded">
          <div className="flex z-10 p-5 justify-center items-center w-[50%] h-[100%]">
            {stream ? (
              <video
                className="w-[100%] h-[100%] object-cover"
                playsInline
                muted
                ref={myVideo}
                autoPlay
              />
            ) : (
              <ClipLoader color="red" loading={true} size={30} />
            )}
          </div>
          <div className="flex p-5 justify-center z-0 items-center w-[50%] h-[100%]">
            {callAccepted && !callEnded ? (
              <>
              <video
                className="w-[100%] h-[100%] object-cover"
                playsInline
                ref={userVideo}
                autoPlay
              />
              </>
            ) : (
              <ClipLoader color="red" loading={true} size={30} />
            )}
          </div>
        </div>
        <div className="flex w-[65vw] h-[7vh] items-center justify-end gap-2 p-5 border-black border rounded">
          {callAccepted && !callEnded ? (
            <MdCallEnd style={{cursor: "pointer"}} onClick={leaveCall} size={30} />
          ): null}
          {receivingCall && !callAccepted ? (
            <IoIosCall style={{cursor: "pointer"}} onClick={answerCall} size={25} />
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-4 justify-center items-center w-[25vw] h-[80vh] rounded border-black border p-5">
        <h1 className="font-bold text-2xl">Chat</h1>
        <div className="flex flex-col h-[85%] w-[100%] gap-4 overflow-y-auto items-start">
          {messages.map((message, index) => (
            <div key={index} ref={messagesRef} className="flex justify-center gap-4">
              <Avatar
                name={message.name}
                round={true}
                size="34"
                textSizeRatio={2}
                maxInitials={2}
                style={{
                  paddingTop: "10px"
                }}
              />
              <div className="flex flex-col">
                <h1 className="font-bold break-all">{message.name}</h1>
                <h1 className="break-all">{message.content}</h1>
              </div>
            </div>
          ))}
        </div>
        <hr className="h-0.5 my-4 w-[100%] bg-black"/>
        <textarea
          className="w-[100%] h-[10%] text-sm resize-none p-1.5 focus:outline-none"
          placeholder="Type message here..."
          value={messageContent}
          onChange={handleMessageChange}
          onKeyDown={handleMessageInput}
        />
        <h1 className="text-xs">{messageContent.length}/{MAX_CHARS}</h1>
      </div>
    </div>
  );
}

export default Call;
