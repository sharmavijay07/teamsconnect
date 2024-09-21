import React, { useState ,useContext} from 'react';
import CreateGroup from './CreateGroup';
import AddUserToGroup from './AddUsertoGroup';
import GroupsList from './GroupList';
import SearchGroups from './SearchGroup';
import {ChatContext} from '../../context/ChatContext'
import UserGroups from './UserGroups';




const GroupManagementPage = () => {
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const {setOrganizationId,organizationId} = useContext(ChatContext)
  console.log("organization",organizationId)
  

  const handleGroupCreated = (group) => {
    console.log("Group created:", group);
    // Refresh or handle UI updates after group creation
  };

  const handleUserAdded = (user) => {
    console.log("User added to group:", user);
    // Refresh or handle UI updates after user added to group
  };

  

  return (
  
    <div className='flex flex-col items-center w-full overflow-hidden'>


      <CreateGroup organizationId={organizationId} onGroupCreated={handleGroupCreated} />
      {currentGroupId && (
        <AddUserToGroup groupId={currentGroupId} onUserAdded={handleUserAdded} />
      )}
            <SearchGroups organizationId={organizationId} />
            <UserGroups/>
      <GroupsList organizationId={organizationId} />
      
    </div>
    
    
  );
};
export default GroupManagementPage;