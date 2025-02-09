import React, { useState } from 'react'
import Btn from "./Btn.jsx";
import TextArea from "./TextArea.jsx"
import '../App.css'

function insertSection() {
    const [inputVal, setInputVal] = useState('');
    const clearInput = () =>{
        setInputVal('');
    }

  return (
    <div className='insert-container'>
        <input className='input-area' 
        type='text' 
        placeholder="Lets insert today's mission.."
        value={inputVal}
        onChange={e => {setInputVal(e.target.value); console.log(inputVal)}}
        />
        <Btn body={inputVal} role="insert" onClear={clearInput}/>
    </div>
  )
}

export default insertSection;