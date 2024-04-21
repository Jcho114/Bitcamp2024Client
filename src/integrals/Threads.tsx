import { useQueries, useQuery } from "@tanstack/react-query";
import ThreadAPI from "../api/ThreadAPI";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { useAppSelector } from "../redux/redux.hooks";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UserAPI from "../api/UserAPI";
import Avatar from "react-avatar";

interface Reply {
  author: {
    name: string
  };
  content: string;
}

interface Thread {
  id: string;
  title: string;
  author: {
    name: string
  }
}

function Threads() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Outlet />
    </div>
  )
}

export function ThreadContent() {
  const token = useAppSelector(state => state.token.value);

  const { data, isLoading, error } = useQuery({
    queryKey: ["threads"],
    queryFn: async () => {
      return await ThreadAPI.getThreads(token);
    }
  });

  const navigate = useNavigate();

  if (isLoading) {
    return <PulseLoader color="red" loading={true} size={15} />
  }
  
  if (error) {
    return "Error...";
  }
  
  return (
    <div className="flex flex-col break-all w-[40vw] my-[10vh] items-center justify-center p-5 gap-4 overflow-y-auto">
      <h1 className="font-bold text-3xl">Threads</h1>
      {data.length > 0 ? data.map((thread: Thread, index: number) => (
        <div
          key={index}
          className="flex cursor-pointer gap-2 flex-col border border-black p-4 rounded-md justify-center items-start w-full"
          onClick={() => navigate(`/threads/thread/${thread.id}`)}  
        >
          <div className="flex items-center gap-4 w-full">
            <Avatar
              name={thread.author.name}
              round={true}
              size="34"
              textSizeRatio={2}
              maxInitials={2}
            />
            <h1 className="font-bold">{thread.title}</h1>
          </div>
          <h1><span className="font-bold">Posted by:</span> {thread.author.name}</h1>
        </div>
      )): <h1>No threads at the moment</h1>}
      <button
        className="border border-black rounded px-2 py-1 hover:bg-gray-200"
        onClick={() => navigate("/threads/create")}
      >
        Create Thread
      </button>
    </div>
  )
}

export function ThreadCreate() {
  const token = useAppSelector(state => state.token.value);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  async function createThreadHandler(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error("Empty fields");
    } else {
      const { id } = await ThreadAPI.createThread(formData, token);
      navigate(`/threads/thread/${id}`);
    }
  }

  return (
    <form className="flex flex-col gap-4 justify-center rounded p-5 w-[50vw] items-center" onSubmit={createThreadHandler}>
      <h1 className="font-bold text-3xl">Start Thread</h1>
      <label>
        Title:
        <input
          className="bg-transparent border-b border-black w-[50vw] focus:outline-none"
          type="text"
          placeholder="Enter a title..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </label>
      <label>
        Content:<br/>
        <textarea
          className="w-[50vw] h-[40vh] p-2 bg-transparent border border-black rounded-md resize-none focus:outline-none"
          value={formData.content}
          placeholder="Start your thread..."
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        />
      </label>
      <input
        className="border-black border w-[50vw] py-1 rounded hover:bg-gray-50 cursor-pointer"
        type="submit"
      />
    </form>
  );
}

export function ThreadPage() {
  const token = useAppSelector(state => state.token.value);
  const { id } = useParams();
  const [
    {
      data: threadData,
      isLoading: threadIsLoading,
      error: threadError
    },
    {
      data: userData,
      isLoading: userIsLoading,
      error: userError
    }
  ] = useQueries({
    queries: [
      {
        queryKey: ["thread"],
        queryFn: async () => {
          return await ThreadAPI.getThreadById(token, id as string);
        },
      },
      {
        queryKey: ["userinfo"],
        queryFn: async () => {
          return await UserAPI.getUserInfo(token);
        },
      }
    ]
  });

  const [replies, setReplies] = useState(threadData?.rootReplies as Reply[]);
  const [reply, setReply] = useState("");

  useEffect(() => {
    setReplies(threadData?.rootReplies);
  }, [threadData?.rootReplies]);

  if (threadIsLoading || userIsLoading) {
    return <PulseLoader color="red" loading={true} size={15} />
  }

  if (threadError || userError) {
    return "Error...";
  }

  async function handleKeyDown(e: { keyCode: number; shiftKey: boolean; preventDefault: () => void; }) {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      await ThreadAPI.createRootReply({ content: reply }, id as string, token);
      setReply("");
      setReplies([{ author: { name: userData?.name || "" }, content: reply }, ...replies]);
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center w-[100vw] mb-10 max-h-[calc(100vh-3rem)] overflow-auto rounded-md p-4">
      <div className="flex flex-col gap-2 w-[80%] mt-[10vh]">
        <h1 className="font-bold text-xl">Thread: {threadData.title}</h1>
        <div className="flex items-center gap-2">
          <span className="font-bold">Author:</span>
          <Avatar
            name={threadData.author.name}
            round={true}
            size="34"
            textSizeRatio={2}
            maxInitials={2}
          />
          <h1>{threadData.author.name}</h1>
        </div>
        <h1><span className="font-bold">Date:</span> {threadData.date}</h1>
        <hr className="border-black"/>
        <h1>{threadData.content}</h1>
        <hr className="border-black"/>
      </div>
      <div className="flex flex-col gap-1 w-[80%]">
        <h1 className="font-bold pl-1">Make a reply</h1>
        <textarea
          className="w-full h-[15vh] focus:outline-none p-1.5 border border-black rounded resize-none"
          value={reply}
          placeholder="Make a reply...."
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="w-[80%]">
        <h1 className="font-bold">Replies</h1>
      </div>
      <div className="flex flex-col justify-start gap-4 w-[80%]">
        {replies && replies.length > 0 ? replies.map((reply: Reply, index: number) => (
          <div key={index}>
            <div className="flex items-center gap-3">
              <Avatar
                name={threadData.author.name}
                round={true}
                size="34"
                textSizeRatio={2}
                maxInitials={2}
              />
              <div>
                <h1 className="font-bold">{reply.author.name}</h1>
                <h1>{reply.content}</h1>
              </div>
            </div>
          </div>
        )) : <h1>No replies yet...</h1>}
      </div>
    </div>
  )
}

export default Threads;