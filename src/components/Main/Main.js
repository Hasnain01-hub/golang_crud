import React from "react";
import "./Main.css";
import ThemeSwitcher from "./ThemeSwitcher/ThemeSwitcher";
import InputTask from "./InputTask/InputTask";
import ControlPanel from "./ControlPanel/ControlPanel";
import TasksList from "./TasksList/TasksList";
import { useSelector } from "react-redux";
import TaskProvider from "./TasksProvider";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../../reducers";
const Main = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleLogout = () => {
    document.cookie =
      "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure";
    dispatch(logoutSuccess({}));
    window.location.href = "/";
    return;
  };
  return (
    <div className="mainContainer">
      {user && user.email ? (
        <p
          onClick={handleLogout}
          style={{
            float: "right",
            color: "black",
            position: "relative",
            top: "-67px",
            right: "0px",
            fontSize: "20px",
            fontWeight: "700",
            padding: "4px 5px",
            borderRadius: "15px",
            background: "aliceblue",
            cursor: "pointer",
          }}
        >
          Logout
        </p>
      ) : (
        ""
      )}
      <div className="header">
        <p style={{ color: "black" }}>TODO</p>
        <ThemeSwitcher></ThemeSwitcher>
      </div>
      <TaskProvider>
        <InputTask></InputTask>
        <TasksList></TasksList>
        <ControlPanel></ControlPanel>
        <div className="footer">Drag to reorder list</div>
      </TaskProvider>
    </div>
  );
};
export default Main;
