import React, { createContext, useState } from "react";

export const TodoContext = createContext();

const TodoContextProvider = (props) =>{
    const [list,setList] = useState([]);

    const values = {
        list,setList
    }
    return(
        <TodoContext.Provider value={values}>
            {props.children}
        </TodoContext.Provider>
    )
}
export default TodoContextProvider;