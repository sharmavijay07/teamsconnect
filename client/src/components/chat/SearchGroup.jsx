import React, { useState, useContext } from "react";
import { getRequest, postRequest, baseUrl } from "../../utils/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext } from "../../context/AuthContext";
import GroupJoinModal from "./GroupJoinModal";

const SearchGroups = ({ organizationId }) => {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState("");
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
    const response = await getRequest(
      `${baseUrl}/chat/search/${organizationId}/${query}`
    );

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

    const response = await postRequest(
      `${baseUrl}/chat/group/add`,
      JSON.stringify({
        userId: user.id,
        groupId: selectedGroup.id,
      })
    );

    if (response.error) {
      setError(response.message);
    } else {
      alert(`You have been added to the group: ${selectedGroup.name}`);
      setModalIsOpen(false); // Close the modal
    }
  };

  return (
    <div className="flex flex-col border-t-2 rounded-3 border-blue-200 p-3 mt-2 gap-x-1 ">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="flex p-1 gap-2">
        <Input
          className="border rounded-3 p-2 gap-2 bg-white border-gray-200"
          type="text"
          placeholder="Search Groups"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          className="rounded-3 bg-blue-600 text-white border-1 border-blue-400 transform h-50 transition duration-500 hover:bg-blue-400"
          variant="default"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
      <div className="p-1 overflow-auto">
        {loading && <p>Searching groups...</p>}
        <ul>
          {groups.map((group) => (
            <li
              key={group.id}
              className="p-2 bg-blue-200 my-1 cursor-pointer flex justify-between  border-b-2 rounded-xl mx-1 border-gray-600/40 transform h-50 transition duration-500 hover:bg-blue-100"
              onClick={() => handleGroupClick(group)}
            >
              {group.name}
            </li>
          ))}
        </ul>
      </div>
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
