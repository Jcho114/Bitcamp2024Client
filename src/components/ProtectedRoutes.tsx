import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/redux.hooks";

function ProtectedRoutes() {
  const token = useAppSelector(state => state.token.value);

  return (
    token ? <Outlet /> : <Navigate to="/login" replace />
  );
}

export default ProtectedRoutes;