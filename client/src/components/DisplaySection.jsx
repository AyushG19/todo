import React, { useContext, useState } from 'react';
import { TodoContext } from '../context/inputContext';
import EditModal from "./EditModal.jsx";
import '../App.css'; // Import the CSS file for styling

const DisplaySection = () => {
  const { list,setList } = useContext(TodoContext);

  const [selectedItem, setSelectedItem] = useState(null);

  const handleEdit = (item) => {
    setSelectedItem(item);
  }
  const handleClose = (des)=>{
    console.log(selectedItem)
    console.log(des)

    const updatedList = list.map((ele)=>{
      if(ele.tid == selectedItem.tid){
        ele.description=des;
        return ele;
      }
      return ele;
    })
    console.log(updatedList)

    setList(updatedList);
    setSelectedItem(null);

  }
  const handleDelete = async(item)=>{
    const id  = item.tid;
    const message = await fetch(
      `http://localhost:3000/todo/${id}`,
      {
        method: "DELETE"
      })
    const updatedList = list.filter((ele)=>ele.tid != item.tid)
    setList(updatedList);
  }
  return (
    <div className='todo-table-container'>
      <table className="todo-table">
        <thead>
          <tr>
            <th>no.</th>
            <th>mission title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan="3" className="no-items">No tasks to display, do something</td>
            </tr>
          ) : (
            list.map((item, index) => (
              <tr key={item.tid} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                <td>{index+1}</td>
                <td className='description'>{item.description}</td>
                <td className='actions'>
                  <button onClick={() => (handleEdit(item))} className="action-btn edit-btn">
                    Edit
                  </button>
                  <button onClick={()=>{handleDelete(item)}} className="action-btn delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {selectedItem && <EditModal item={selectedItem} onClose={handleClose} />}
    </div>

  );
};

export default DisplaySection;
