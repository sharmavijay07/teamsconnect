import React, { useState, useContext } from 'react';
import { getRequest, postRequest, baseUrl } from '../../utils/services';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext } from '../../context/AuthContext';
import GroupJoinModal from './GroupJoinModal';

const SearchGroups = ({ organizationId }) => {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleSearch = async () => {
    if (!query) {
      setError("Search query is required.");
      return;
    }

    setLoading(true);
    const response = await getRequest(`${baseUrl}/chat/search/${organizationId}/${query}`);

    setLoading(false);
    if (response.error) {
      setError(response.message);
    } else {
      setGroups(response);
    }
  };

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
    <div className='flex border-t-2 border-black p-1 mb-2 gap-x-1'>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Input
        type="text"
        placeholder="Search Groups"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button className="rounded bg-white border-1" variant="default" onClick={handleSearch}>
        Search
      </Button>
      {loading && <p>Searching groups...</p>}
      <ul>
        {groups.map((group) => (
          <li 
            key={group.id}
            className="cursor-pointer"
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

export default SearchGroups;
