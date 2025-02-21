import React, { useState } from 'react';
import api from '../../api';

const EditModal = ({ item, onClose }) => {
  const [description, setDescription] = useState(item.selectedItem.description);
  const { setSelectedItem } = item;

  const handleSave = async () => {
    const id = item.selectedItem.tid;
    console.log('Updated description: ', description);

    try {
      const data = await api.put(`http://localhost:3000/todo/${id}`, { description })

      console.log('Updated task:', data);
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
          <button onClick={() => setSelectedItem(null)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
