import React, { useEffect, useReducer, useState } from "react";
import TaskContext from "./TaskContext";
import axios from "axios";
const getdata = async () => {
  let cookieArray = document.cookie.split("; ");
  var token = cookieArray.find((row) => row.startsWith("jwt="));
  token = token ? token.split("=")[1] : null;
  const storedTasks = await axios.get("http://localhost:8000/api/gettodo", {
    headers: {
      "Content-Type": "application/json",
      authtoken: token,
    },
  });
  return storedTasks;
};
const getTasks = async () => {
  try {
    const storedTasks = await getdata();

    if (storedTasks.data && storedTasks.data.length > 0) {
      console.log(storedTasks.data);
      return storedTasks.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};
const ApiCall = () => {
  async function gettodo(token) {
    await axios.get("http://localhost:8000/api/gettodo", {
      headers: {
        authtoken: token,
      },
    });
  }
  async function postodo(data, token) {
    console.log(token);
    return await axios
      .post(
        "http://localhost:8000/api/createtodo",
        {
          _id: data._id,
          taskContent: data.taskContent,
          desc: data.desc,
          completed: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authtoken: token,
          },
          withCredentials: true, // Include this if you need cookies to be sent along with the request
        }
      )
      .catch((err) => {
        console.log(err);
      });
  }
  async function clearComplete(token) {
    await axios.delete("http://localhost:8000/api/clearCompletetodo", {
      headers: {
        authtoken: token,
      },
    });
  }
  async function updateTodo(task, token) {
    console.log(task, token, "InsideKJKJKJKJK");
    return await axios
      .post(
        "http://localhost:8000/api/updateTodo",
        {
          _id: task[0]._id,
          completed: task[0].completed,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authtoken: token,
          },
          withCredentials: true, // Include this if you need cookies to be sent along with the request
        }
      )
      .then((response) => {
        console.log("Success:", response.data);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }
  async function deletetodo(_id, token) {
    await axios.get("http://localhost:8000/api/deletetodo/" + _id, {
      headers: {
        authtoken: token,
      },
    });
  }

  return { gettodo, postodo, updateTodo, clearComplete, deletetodo };
};

const TasklistReducer = (state, action) => {
  const api = ApiCall();
  console.log(state);
  if (action.type === "ADD") {
    console.log(state, action.newTask);
    var updatedTasks = [...state, action.newTask];

    api.postodo(action.newTask, action.token);
    console.log(updatedTasks);
    return updatedTasks;
  }
  if (action.type === "RMV") {
    const updatedTasks = state.filter((task) => {
      return task._id !== action._id;
    });

    api.deletetodo(action._id, action.token);
    return updatedTasks;
  }
  if (action.type === "IsComplete") {
    const targetTask = state.find((task) => {
      return task._id == action._id;
    });
    console.log(action._id, "state");
    const targetIndex = state.indexOf(targetTask);
    const updatedTasks = [...state];
    console.log(targetIndex, updatedTasks, targetTask, "updatedTasks");
    updatedTasks[targetIndex] = {
      ...targetTask,
      completed: !targetTask.completed,
    };

    api.updateTodo(updatedTasks, action.token);

    return updatedTasks;
  }
  if (action.type === "initialize") {
    console.log(state, action.newTask);
    const updatedTasks = [...action.newTask];
    return updatedTasks;
  }
  if (action.type === "arrangeEnd") {
    if (!action.dragTarget.destination) return state;
    const updatedTasks = [...state];
    const [reorderedItem] = updatedTasks.splice(
      action.dragTarget.source.index,
      1
    );
    updatedTasks.splice(action.dragTarget.destination.index, 0, reorderedItem);

    return updatedTasks;
  }
  if (action.type === "clearComplete") {
    const updatedTasks = [...state].filter((task) => !task.completed);
    api.clearComplete(action.token);

    return updatedTasks;
  }

  return getTasks.then((res) => res);
};

const TaskProvider = (props) => {
  let cookieArray = document.cookie.split("; ");
  var token = cookieArray.find((row) => row.startsWith("jwt="));
  token = token ? token.split("=")[1] : null;
  const [tasklist, dispatchTasklist] = useReducer(TasklistReducer, []);
  useEffect(() => {
    getTasks().then((res) => {
      dispatchTasklist({ type: "initialize", newTask: res });
    });
  }, []);
  const [previewFilter, setpreviewFilter] = useState();

  const addTaskHandler = (content, desc) => {
    const Task = {
      _id: new Date().getTime().toString(),
      taskContent: content,
      desc: desc,
      completed: false,
      isDragging: false,
    };
    dispatchTasklist({ type: "ADD", newTask: Task, token: token });
  };

  const removeTaskHandler = (id) => {
    dispatchTasklist({ type: "RMV", _id: id, token: token });
  };

  const changeStateHandler = (id) => {
    dispatchTasklist({ type: "IsComplete", _id: id, token: token });
  };

  const RearrangeEndHandler = (dragTarget) => {
    dispatchTasklist({
      type: "arrangeEnd",
      dragTarget: dragTarget,
      token: token,
    });
  };
  const clearCompleteHandelr = () => {
    dispatchTasklist({ type: "clearComplete", token: token });
  };

  const sendPreviewFilterHandler = (filter) => {
    if (filter === "All") {
      setpreviewFilter("All");
    }
    if (filter === "Active") {
      setpreviewFilter("Active");
    }
    if (filter === "Completed") {
      setpreviewFilter("Completed");
    }
  };

  const taskContext = {
    tasks: tasklist,
    previewFilter: previewFilter,
    addTask: addTaskHandler,
    removeTask: removeTaskHandler,
    changeState: changeStateHandler,
    rearrangeEnd: RearrangeEndHandler,
    clearComplete: clearCompleteHandelr,
    sendPreviewFilter: sendPreviewFilterHandler,
  };

  return (
    <TaskContext.Provider value={taskContext}>
      {props.children}
    </TaskContext.Provider>
  );
};
export default TaskProvider;
