import React, { useState } from 'react';
import { postRequest, baseUrl } from '../../utils/services';

const AddUserToGroup = ({ groupId, onUserAdded }) => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState(null);

  const handleAddUser = async () => {
    if (!userId) {
      setError("User ID is required.");
      return;
    }

    const response = await postRequest(`${baseUrl}/chat/group/add`, JSON.stringify({
      userId,
      groupId
    }));

    if (response.error) {
      setError(response.message);
    } else {
      onUserAdded(response);
      setUserId('');
    }
  };

  return (
    <div>
      <h3>Add User to Group</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={handleAddUser}>Add User</button>
    </div>
  );
};

export default AddUserToGroup;
