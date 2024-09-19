import ChatBox from "./ChatBox";
import GroupManagementPage from "./GroupManagementPage";
import { useContext, useEffect } from "react";
import { ChatContext } from "@/context/ChatContext";
import Webcam from "react-webcam";
import { useRef } from "react";
// import selectedGroup from "./CreateGroup"
import GroupChatBox from "./GroupChatBox";
import UserGroups from "./UserGroups";
import { GroupContext } from "@/context/GroupContext";

export default function Group() {
  const webRef = useRef(null);
  const { setOrganizationId, organizationId } = useContext(ChatContext);
  const { selectedGroup } = useContext(GroupContext);
  useEffect(() => {
    setOrganizationId(1);
  }, [organizationId]);
  return (
    <div className="bg-white h-[95vh]">
      <div className="h-[6vh] w-[76vw] bg-blue-400 flex justify-between  border-b-2 border-gray-700/50">
        <div className="h-[5vh] w-[10vw] flex justify-around p-1">
          <div className="bg-black h-[4vh] w-[4vh] p-1"></div>
          <h3 className="p-1">VPPCOE</h3>
        </div>
        <div className="flex  h-[5vh] w-[20vw] justify-around">
          <button className="p-1 border-none mt-1   hover:bg-blue-300 transition-all hover:shadow-lg hover:rounded-2xl transform  duration-300">
            POST
          </button>
          <button className="p-1 border-none mt-1   hover:bg-blue-300 transition-all hover:shadow-lg hover:rounded-2xl transform  duration-300">
            FILES
          </button>
          <button className="p-1 border-none mt-1  hover:bg-blue-300 transition-all hover:shadow-lg hover:rounded-2xl transform  duration-300">
            PHOTOS
          </button>
        </div>
      </div>
      <div classNa UI-me="h-[90%] w-[95%] bg-blue-200 m-auto mt-3 rounded">
        <div>
          {/* <Webcam ref={webRef} className="ml-5 mt-2 w-60 border-b-2 rounded-xl"/> */}
          {selectedGroup && <GroupChatBox group={selectedGroup} />}
          {/* <UserGroups /> */}
        </div>
      </div>
    </div>
  );
}
