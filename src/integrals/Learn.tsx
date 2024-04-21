import { useState } from "react";
import hardcodedTags from "../utils/HardcodeTags";
import AppointmentAPI from "../api/AppointmentAPI";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/redux.hooks";
import { updateAppointment } from "../redux/appointmentSlice";

const tagInfoDefault = hardcodedTags.map(tag => {
  return {
    tag: tag,
    selected: false,
  }
});

function Learn() {
  const [request, setRequest] = useState("");
  const [tagInfo, setTagInfo] = useState(tagInfoDefault);
  const token = useAppSelector(state => state.token.value);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleSearchChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setRequest(e.target.value);
  }

  function handleTagClick(tag: string) {
    setTagInfo(tagInfo.map(el => {
      if (el.tag === tag) {
        return {
          ...el,
          selected: !el.selected
        }
      } else {
        return el;
      }
    }));
  }

  function handleMessageInput(e: { keyCode: number; shiftKey: boolean; preventDefault: () => void; }) {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();

      AppointmentAPI.createAppointmentRequest({
        tags: tagInfo.filter(tag => tag.selected).map(tag => tag.tag),
        request: request
      }, token);
  
      navigate("/call");
    }
  }

  async function handleSubmitClick() {
    const { id: roomId } = await AppointmentAPI.createAppointmentRequest({
      tags: tagInfo.filter(tag => tag.selected).map(tag => tag.tag),
      request: request
    }, token);

    dispatch(updateAppointment([roomId, "STUDENT"]));

    navigate("/call");
  }

  return(
    <div className="flex items-center justify-center flex-col gap-4 w-[30rem]">
      <h1 className="text-5xl font-bold">Learn</h1>
      <textarea
        className="focus:outline-none p-3 w-[100%] h-[20vh] block resize-none border-2 rounded border-black"
        placeholder="What is your request?"
        value={request}
        onChange={handleSearchChange}
      />
      <div className="w-full font-bold">Tags:</div>
      <div className="flex gap-2 w-[30rem] flex-wrap">
        {
          tagInfo.map((tag, index: number) => (
            <div
              key={index}
              className="px-2 py-1 border-black border rounded-md hover:bg-gray-200"
              onClick={() => handleTagClick(tag.tag)}
              onKeyDown={handleMessageInput}
              style={{
                backgroundColor: tag.selected ? "lightgray" : "white"
              }}
            >
              {tag.tag}
            </div>
          ))
        }
      </div>
      <button
        className="border-black border px-2 py-1 rounded hover:bg-gray-200 w-full"
        onClick={handleSubmitClick}
      >
        Submit
      </button>
    </div>
  )
}

export default Learn;
