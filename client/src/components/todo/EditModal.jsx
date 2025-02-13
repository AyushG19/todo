import React, { useState } from 'react';

const EditModal = ({ item, onClose }) => {
  const [description, setDescription] = useState(item.description);

  const handleSave = async () => {
    const id = item.tid;
    console.log('Updated description: ', description);

    try {
      const response = await fetch(`http://localhost:3000/todo/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error('Failed to update the task');
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
