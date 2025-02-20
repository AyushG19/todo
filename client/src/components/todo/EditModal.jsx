import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditModal = ({ item, onClose }) => {
  const [description, setDescription] = useState(item.description);
  const navigate = useNavigate();

  const handleSave = async () => {
    const id = item.tid;
    console.log('Updated description: ', description);

    try {
      const response = await fetch(`http://localhost:3000/todo/${id}`, {
        method: "PUT",
        headers: {authorization: `Bearer ${localStorage.getItem('token')}`, "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
        credentials: 'include'
      });

      if (response.status === 401 || response.status === 403) {
        navigate('/login');
      }

      const updatedTask = await response.json();
      console.log('Updated task:', updatedTask);

      // Pass the updated task back to the parent
      onClose(description);
    } catch (error) {
      console.error('Error updating the task:', error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Re-Describe Mission</h2>
        <label>Okay the plan has a change :</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleSave}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
