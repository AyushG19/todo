import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TodoContext } from '../../context/inputContext';
import iconGif from '../../assets/done3.gif';
import api from '../../api'

const Btn = (props) => {
    const { setList } = useContext(TodoContext);
    const [isAnimating, setIsAnimating] = useState(false);
    const navigate = useNavigate();

    const insertAnimation = () => {
        setIsAnimating(true);
        setTimeout(() => { setIsAnimating(false) }, 2000);
    }
    const handleInsert = async () => {
        if (!props.body) {
            alert("Shame you don't have nothig to do")
            return;
        }
        try {
            const newTodo = await api.post("http://localhost:3000/todo",{ description: props.body });
            insertAnimation();
            props.onClear();
            setList((prev) => [...prev, newTodo])
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <button className='insert-btn' onClick={handleInsert}>
                {
                    isAnimating ? (<img className='gif' src={iconGif} alt="" />) : (props.role)
                }
            </button>
        </>
    )
}

export default Btn