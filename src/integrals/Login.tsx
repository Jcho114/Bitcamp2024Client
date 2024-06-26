import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthAPI from "../api/AuthAPI";
import { toast } from "react-toastify";
import { useAppDispatch } from "../redux/redux.hooks";
import { updateToken } from "../redux/tokenSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const token = await AuthAPI.login(formData);
      dispatch(updateToken(token));
      navigate("/");
    } catch (e) {
      toast.error("Unable to login");
    }
  }

  return (
    <div className="flex text-white flex-col gap-6 justify-center items-center px-10 py-16 rounded w-fit bg-red-600">
      <h1 className="font-bold text-3xl">Log In</h1>
      <form className="flex flex-col gap-6 items-center" onSubmit={submitForm}>
        <label className="border-b">
          <h1 className="font-bold text-xs">Email:</h1>
          <input
            className="bg-transparent py-1.5 focus:outline-none border-none text-sm w-[15rem] placeholder-white"
            placeholder="Type your username"
            value={formData.email}
            onChange={(e) => setFormData({
              ...formData,
              email: e.target.value
            })}
            type="email"
          />
        </label>
        <label className="border-b">
        <h1 className="font-bold text-xs">Password:</h1>
          <input
            className="bg-transparent py-1.5 focus:outline-none border-none text-sm w-[15rem] placeholder-white"
            placeholder="Type your password"
            value={formData.password}
            onChange={(e) => setFormData({
              ...formData,
              password: e.target.value
            })}
            type="password"
          />
        </label>
        <input className="cursor-pointer font-semibold text-sm py-2 bg-white text-black w-full border-none rounded-full" type="submit" />
        <Link to="/signup">
          <h1 className="font-bold text-sm">Sign Up</h1>
        </Link>
      </form>
    </div>
  );
}

export default Login;
