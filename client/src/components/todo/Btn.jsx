import React, { useContext, useEffect, useState } from 'react'
import { TodoContext } from '../../context/inputContext';
import iconGif from '../../assets/done3.gif';

const Btn = (props) => {
    const { setList } = useContext(TodoContext);
    const [isAnimating,setIsAnimating] = useState(false);

        const insertAnimation = () => {
            setIsAnimating(true);
            setTimeout(() => {setIsAnimating(false)}, 2000);
        }
    const handleInsert = async () => {
        if(!props.body){ 
            alert("Shame you don't have nothig to do")
            return;
        }
        try {
            const res = await fetch(
                "http://localhost:3000/todo",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ description: props.body })
                });
            const newTodo = await res.json();
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