import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InsertSection from './insertSection.jsx'
import DisplaySection from './DisplaySection.jsx'
import api from '../../api.js'

import "../../App.css";
import { TodoContext } from '../../context/inputContext.jsx';

const Todo = () => {
  console.log("todo is muntes")
  const { list, setList } = useContext(TodoContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async (url) => {
      try {
        const listItem = await api.get(url);
        console.log(listItem)
        setList(listItem);
        return ;
      } catch (err) {
        console.log("connot fetch todos");
        throw err;
      }
    }
    fetchTodos("http://localhost:3000/todo");

  }, []);

  useEffect(() => {
    console.log("Updated list:", list);
  }, [list]);

  return (
    <div className='todo-container'>
      <InsertSection />
      <DisplaySection />
    </div>
  );
};

export default Todo;