import { react, useState } from 'react'
import LoginPage from './components/login/LoginPage.jsx'
import Todo from './components/todo/todo.jsx'
import { Routes, Route, useNavigate } from 'react-router-dom'

import './App.css'

function App() {
  const navigate = useNavigate();
  

  return (
    <div className='container'>
      <Routes>
        <Route path='*' element={<LoginPage/>}></Route>
        <Route path='/todo' element={<Todo/>}></Route>
      </Routes>
    </div>
  )
}

export default App
