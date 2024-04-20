import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-3rem)]">
        <Outlet />
      </div>
    </>
  )
}

export default App;
