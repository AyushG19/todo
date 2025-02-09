import React, { useContext, useEffect } from 'react'
import InsertSection from './insertSection.jsx'
import DisplaySection from './DisplaySection.jsx'

import "../App.css";
import { TodoContext } from '../context/inputContext.jsx';

const todo = () => {
    const {list,setList} = useContext(TodoContext);
    
    useEffect(()=>{
        const updateList = async() =>{
            const res = await fetch("http://localhost:3000/todo");
            const listItem = await res.json();
            setList(listItem);
            console.log(listItem);
        }
        updateList();
    },[]);
    useEffect(() => {
      console.log("Updated list:", list);
    }, [list]);
    

  return (
    <div className='todo-container'>
        <InsertSection/>
        <DisplaySection/>
    </div>
  )
}

export default todo