import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Login from "./components/auth/login";
import { loginSuccess } from "./reducers";
import axios from "axios";
import { useDispatch } from "react-redux";
function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    let cookieArray = document.cookie.split("; ");
    var token = cookieArray.find((row) => row.startsWith("jwt="));
    token = token ? token.split("=")[1] : null;

    if (token) {
      getcurrentuser(token)
        .then((res) => {
          dispatch(
            loginSuccess({
              email: res.data.user.email,
              imgURL: res.data.user.imgURL,
              lastLogin: res.data.user.lastLogin,
              firstName: res.data.user.firstName,
            })
          );
        })
        .catch();
    }
  }, [dispatch]);
  const getcurrentuser = async (token) => {
    if (token) {
      return await axios.get("http://localhost:8000/api/auth/current_user", {
        headers: {
          authtoken: token,
        },
      });
    }
  };
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
