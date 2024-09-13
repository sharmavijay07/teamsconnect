import React, { useEffect, useState, useContext } from 'react';
import { getRequest, postRequest, baseUrl } from '../../utils/services';
import { AuthContext } from '../../context/AuthContext';
import GroupJoinModal from './GroupJoinModal';

const GroupsList = ({ organizationId }) => {
  const { user } = useContext(AuthContext); // Access the user from AuthContext
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      const response = await getRequest(`${baseUrl}/chat/organization/${organizationId}`);

      setLoading(false);
      if (response.error) {
        setError(response.message);
      } else {
        setGroups(response);
      }
    };

    fetchGroups();
  }, [organizationId]);

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setModalIsOpen(true);
  };

  const handleJoinGroup = async () => {
    if (!user || !selectedGroup) return;

    const response = await postRequest(`${baseUrl}/chat/group/add`, JSON.stringify({
      userId: user.id,
      groupId: selectedGroup.id
    }));

    if (response.error) {
      setError(response.message);
    } else {
      alert(`You have been added to the group: ${selectedGroup.name}`);
      setModalIsOpen(false); // Close the modal
    }
  };

  return (
    <div className='flex flex-col items-center border-t-2 border-black'>
      <h3>Groups in Organization</h3>
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

      {selectedGroup && (
        <GroupJoinModal 
          isOpen={modalIsOpen}
          group={selectedGroup}
          onRequestClose={() => setModalIsOpen(false)}
          onJoin={handleJoinGroup} 
        />
      )}
    </div>
  );
};

export default GroupsList;
