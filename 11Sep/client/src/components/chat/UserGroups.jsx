import React, { useEffect, useState, useContext } from 'react';
import { getRequest, baseUrl } from '../../utils/services';
import { AuthContext } from '../../context/AuthContext';
import { GroupContext } from '../../context/GroupContext';
import GroupChatBox from './GroupChatBox'; // Import the ChatBox component

const UserGroups = () => {
  const { user } = useContext(AuthContext);
  const { fetchGroupMessages, setCurrentGroupId,setSelectedGroup,selectedGroup } = useContext(GroupContext); // Use GroupContext
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setError('You must be logged in to view your groups.');
      return;
    }

    const fetchUserGroups = async () => {
      setLoading(true);
      const response = await getRequest(`${baseUrl}/chat/user/${user.id}/groups`);
      setLoading(false);
      
      if (response.error) {
        setError(response.message);
      } else {
        setGroups(response);
      }
    };

    fetchUserGroups();
  }, [user]);

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setCurrentGroupId(group.id); // Set current group ID in context
    fetchGroupMessages(group.id); // Fetch messages for the selected group
    console.log('horahahai',group.id)
  };

  return (
    <div className='flex flex-col items-center border-t-2 border-black gap-y-2'>
      <h3>Your Groups</h3>
      {loading && <p>Loading groups...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul className='w-[100%]'>
        {groups.map((group) => (
          <li 
            className='p-2 bg-white m-1 rounded w-[100%] cursor-pointer'
            key={group.id}
            onClick={() => handleGroupClick(group)}
          >
            {group.name}
          </li>
        ))}
      </ul>
      {/* {selectedGroup && <GroupChatBox group={selectedGroup} />}  */}
    </div>
  );
};

export default UserGroups;
