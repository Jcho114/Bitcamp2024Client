import { useQuery } from "@tanstack/react-query";
import React from "react";
import UserAPI from "../api/UserAPI";
import { useAppDispatch, useAppSelector } from "../redux/redux.hooks";
import Avatar from "react-avatar";
import { updateToken } from "../redux/tokenSlice";

function UserAvatar() {
  const token = useAppSelector((state) => state.token.value);
  const dispatch = useAppDispatch();

  const { data, isLoading, error } = useQuery({
    queryKey: ["userinfo"],
    queryFn: async () => {
      return await UserAPI.getUserInfo(token);
    },
  });

  const [focus, setFocus] = React.useState<boolean>(false);

  function logout() {
    dispatch(updateToken(""));
  }

  if (isLoading) {
    return <h1 className="font-bold">Loading...</h1>;
  }

  if (error) {
    dispatch(updateToken(""));
  }

  return (
    <div className="z-50 cursor-pointer">
      <Avatar
        name={data?.name}
        round={true}
        size="28"
        textSizeRatio={2}
        maxInitials={2}
        onClick={() => setFocus(!focus)}
      />
      {focus ? (
        <div className="fixed flex items-center flex-col p-3.5 rounded shadow-xl gap-1 bg-red-600 right-0">
          <h1 className="font-bold">{data?.name}</h1>
          <h1 className="font-normal">{data?.email}</h1>
          <button className="font-bold" onClick={logout}>Logout</button>
        </div>
      ) : null}
    </div>
  );
}

export default UserAvatar;
