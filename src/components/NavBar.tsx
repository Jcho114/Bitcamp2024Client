import { Link } from "react-router-dom";
import UserAvatar from "./UserAvatar";
import { useAppSelector } from "../redux/redux.hooks";

function NavBar() {
  const token = useAppSelector(state => state.token.value);
  
  return (
    <div className="text-white flex justify-between items-center bg-red-600 w-full h-12">
      <Link to="/">
      <div className="flex px-4 items-center justify-center gap-2">
        <img className="w-[2.5rem] invert" src="/logo.png" />
        <h1 className="font-bold">PeerSphere</h1>
      </div>
      </Link>
      <div className="flex px-4 gap-6">
        {
          token ?
          <>
            <Link to="/learn">
              <h1 className="font-bold">Learn</h1>
            </Link>
            <Link to="/teach">
              <h1 className="font-bold">Teach</h1>
            </Link>
            <Link to="/threads">
              <h1 className="font-bold">Threads</h1>
            </Link>
            <UserAvatar />
          </> :
          <Link to="/login">
            <h1 className="font-bold">Login</h1>
          </Link>
        }
      </div>
    </div>
  )
}

export default NavBar;
