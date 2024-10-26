import React, { useState } from "react";
import "./Checkbox.css";
const Checkbox = (props) => {
  const [isChecked, setIsChecked] = useState(props.complete);

  const handleCheckboxChange = () => {
    setIsChecked((prevState) => !prevState);
    props.checkState(!isChecked);
  };

  return (
    <div className="round">
      <input
        type="checkbox"
        id={props._id}
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <label htmlFor={props._id}></label>
    </div>
  );
};
export default Checkbox;
