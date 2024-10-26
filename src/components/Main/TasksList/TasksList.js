import React, { useContext, useState, useEffect } from "react";
import Task from "./Task/Task";
import "./TasksList.css";
import TaskContext from "../TaskContext";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import axios from "axios";

const TasksList = () => {
  const TasksList = useContext(TaskContext);

  const [previewTasklist, setpreviewTasklist] = useState([]);
  const getData = async () => {
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

  useEffect(() => {
    getData().then((res) => {
      console.log(res.data);
      if (TasksList.previewFilter === "All") {
        setpreviewTasklist(res.data);
      } else if (TasksList.previewFilter === "Active") {
        setpreviewTasklist(res.data.filter((task) => !task.completed));
      } else if (TasksList.previewFilter === "Completed") {
        setpreviewTasklist(res.data.filter((task) => task.completed));
      } else setpreviewTasklist(res.data);
    });
  }, [TasksList.previewFilter, TasksList.tasks]);
  console.log(TasksList.tasks);
  return (
    <DragDropContext onDragEnd={TasksList.rearrangeEnd}>
      <Droppable droppableId="droppable-1">
        {(provided) => (
          <ul
            className="tasklist"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {previewTasklist &&
              previewTasklist.length > 0 &&
              previewTasklist.map((item, index) => (
                <Task
                  content={item.taskContent}
                  desc={item.desc}
                  _id={item._id}
                  key={item._id}
                  index={index}
                  complete={item.completed}
                ></Task>
              ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};
export default TasksList;
