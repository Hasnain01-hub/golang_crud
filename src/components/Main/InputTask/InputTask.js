import React, { useState, useContext } from "react";
import "./InputTask.css";
import Addbutton from "../Addbutton/Addbutton";
import TaskContext from "../TaskContext";

const InputTask = () => {
  const TasksList = useContext(TaskContext);
  const [inputTaskValue, setInputTaskValue] = useState({
    inputTaskValue: "",
    inputTaskDisc: "",
  });
  //   const [inputTaskDisc, setInputDiscValue] = useState("");

  const handleInputChange = (event) => {
    setInputTaskValue((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  };
  const addTask = () => {
    if (inputTaskValue.inputTaskValue.trim() !== "") {
      TasksList.addTask(
        inputTaskValue.inputTaskValue,
        inputTaskValue.inputTaskDisc
      );
    }
    setInputTaskValue({
      inputTaskValue: "",
      inputTaskDisc: "",
    });
  };

  return (
    <div>
      {console.log(inputTaskValue)}
      <div className="Task">
        <Addbutton
          disabled={inputTaskValue === "" ? true : false}
          onClick={addTask}
        ></Addbutton>

        <input
          type="text"
          onChange={handleInputChange}
          name="inputTaskValue"
          placeholder="Creat a New Todo.."
          value={inputTaskValue.inputTaskValue}
        ></input>
      </div>
      {inputTaskValue.inputTaskValue.length >= 1 && (
        <div className="Task">
          <input
            type="text"
            onChange={handleInputChange}
            onKeyDown={(e) => {
              e.key === "Enter" && addTask();
            }}
            name="inputTaskDisc"
            placeholder="Enter Description"
            value={inputTaskValue.inputTaskDisc}
          />
        </div>
      )}
    </div>
  );
};
export default InputTask;
