import React, { useEffect } from "react";
import { useState, useContext } from "react";
import TaskContext from "../TaskContext";
import MediaQuery from "react-responsive";
import "./ControlPanel.css";
import axios from "axios";

function RadioButtonList(props) {
  const TasksList = useContext(TaskContext);
  const options = ["All", "Active", "Completed"];
  const displayOption = ["All", "In Progress", "Done"];
  const getFilter = () => {
    const filter = JSON.parse(localStorage.getItem("preview-filter"));
    if (filter !== null) {
      return filter;
    } else {
      return "All";
    }
  };
  const [selectedOption, setSelectedOption] = useState(getFilter);

  const handleOptionChange = (event) => {
    const newOption = event.target.value;
    setSelectedOption(newOption);
    TasksList.sendPreviewFilter(newOption);
  };
  localStorage.setItem("preview-filter", JSON.stringify(selectedOption));

  return (
    <ul className="filters">
      {options.map((option, index) => (
        <li key={option}>
          <input
            id={option}
            type="radio"
            value={option}
            checked={selectedOption === option}
            onChange={handleOptionChange}
            className="mr-2"
          />
          <label htmlFor={option}>{displayOption[index]}</label>
        </li>
      ))}
    </ul>
  );
}

const ControlPanel = () => {
  const TasksList = useContext(TaskContext);
  const [list, setlist] = useState([]);
  useEffect(() => {
    getData().then((res) => {
      setlist(res.data);
    });
  }, []);
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
  const TasksLeft = list.filter((task) => !task.completed).length;
  
  return (
    <React.Fragment>
      <MediaQuery maxWidth={767}>
        {(matches) => {
          if (matches) {
            // Render content for small screens
            return (
              <div className="small">
                <div className="colors">
                  <p>{TasksLeft} items left</p>
                  <button
                    className="clear-complete"
                    onClick={TasksList.clearComplete}
                  >
                    Clear Completed
                  </button>
                </div>
                <div className="colors">
                  <RadioButtonList></RadioButtonList>
                </div>
              </div>
            );
          } else {
            // Render content for larger screens
            return (
              <div className="controls large colors">
                <p>{TasksLeft} items left</p>
                <RadioButtonList></RadioButtonList>
                <button
                  className="clear-complete"
                  onClick={TasksList.clearComplete}
                >
                  Clear Completed
                </button>
              </div>
            );
          }
        }}
      </MediaQuery>
    </React.Fragment>
  );
};
export default ControlPanel;
