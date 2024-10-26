import React, { useState, useContext } from "react";
import "./Task.css";
import Checkbox from "../../Checkbox/Checkbox";
import Removebutton from "../../Removebutton/Removebutton";
import TaskContext from "../../TaskContext";
import { Draggable } from "react-beautiful-dnd";

const Task = (props) => {
  const [taskClass, setTaskClass] = useState(props.complete);
  const taskCompilationHandler = (check) => {
    setTaskClass(check);
    TasksList.changeState(props._id);
  };

  const TasksList = useContext(TaskContext);
  const RmvTask = () => {
    TasksList.removeTask(props._id);
  };

  /*  return (
      <React.Fragment>
         <Draggable
            key={props._id}
            draggableId={props._id.toString()}
            index={props.index}
         >
            {(provided, snapshot) => {
               //start code for drag vertical only
               let transform = provided.draggableProps.style.transform;
               if (snapshot.isDragging && transform) {
                  transform = transform.replace(/\(.+,/, "(0,");
               }
               const style = {
                  ...provided.draggableProps.style,
                  transform,
               };
               //end of the code
               return (
                  <li
                     ref={provided.innerRef}
                     {...provided.draggableProps}
                     {...provided.dragHandleProps}
                     style={style} 
                     className={taskClass ? "task completed" : "task "}
                  >
                     <div>
                        <Checkbox
                           complete={props.complete}
                           _id={props._id}
                           checkState={taskCompilationHandler}
                        ></Checkbox>
                        {props.content}
                     </div>
                     <Removebutton _id={props._id} onClick={RmvTask}></Removebutton>
                  </li>
               );
            }}
         </Draggable>
      </React.Fragment>
   ); */

  return (
    <React.Fragment>
      <Draggable
        key={props._id}
        draggableId={props._id.toString()}
        index={props.index}
      >
        {(provided, snapshot) => (
          <li
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={taskClass ? "task completed" : "task "}
          >
            <div>
              <Checkbox
                complete={props.complete}
                _id={props._id}
                checkState={taskCompilationHandler}
              ></Checkbox>
              {props.content}
              <br />
              {props.desc}
            </div>
            <Removebutton _id={props._id} onClick={RmvTask}></Removebutton>
          </li>
        )}
      </Draggable>
    </React.Fragment>
  );
};
export default Task;
