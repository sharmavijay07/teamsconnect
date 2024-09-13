import React, { useState } from 'react';
import { postRequest, baseUrl } from '../../utils/services';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const CreateGroup = ({ organizationId, onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [error, setError] = useState(null);

  const handleCreateGroup = async () => {
    if (!groupName || !groupDescription) {
      setError("Group name and description are required.");
      return;
    }

    const response = await postRequest(`${baseUrl}/chat/group`, JSON.stringify({
      name: groupName,
      description: groupDescription,
      organizationId
    }));

    if (response.error) {
      setError(response.message);
    } else {
      onGroupCreated(response);
      setGroupName('');
      setGroupDescription('');
    }
  };

  return (
    <div className=''>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    <Dialog>
    <DialogTrigger asChild>
      <Button className="rounded bg-white my-2 hover:bg-blue-400" variant="default">Add new group</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-blue-300">
      <DialogHeader>
        <DialogTitle>Add new group</DialogTitle>
        <DialogDescription>
          add new group in your organization
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex items-center">
          <Label htmlFor="name" className="w-[50%]">
            Name
          </Label>
          <Input
             className='bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-black rounded-3'
             type="text"
             placeholder="Group Name"
             value={groupName}
             onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <Label htmlFor="Group Description" className="w-[40%]">
            Description
          </Label>
          <Input
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 border-2 rounded-3'
            type="text"
            placeholder="Group Description"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <Button  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      onClick={handleCreateGroup} >Save changes</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  </div>
    // -------------------------
  );
};

export default CreateGroup;
