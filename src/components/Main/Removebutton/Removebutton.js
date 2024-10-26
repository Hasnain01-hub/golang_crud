import React from "react";
import '../TasksList/Task/Task.css'
const Removebutton=(props)=>{
   return (
      <button className="Rmvbtn"
      onClick={props.onClick}></button>
   )
}
export default Removebutton;