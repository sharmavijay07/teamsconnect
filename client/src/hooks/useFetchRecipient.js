import { useState,useEffect } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat,user) => {
    const [recipientUser,setRecipientUser] = useState(null)
    const [error,setError] = useState(null)
    
        
        
    // console.log('chat in useFetch',chat,user.id)

    // const recipientId = chat?.members.find((id) =>id!=user?.id)
    const membersArray = typeof chat?.members === "string" ? JSON.parse(chat.members) : chat?.members;
    const recipientId = membersArray?.find((id) => id != user?.id);

    // console.log("recipient id in useFetch",recipientId)
    useEffect(() => {
        const getUser = async() => {
            // console.log("Fetching user with ID:", recipientId);
            if(!recipientId) return null

            const response = await getRequest(`${baseUrl}/users/find/${recipientId}`)

            if(response.error) {
                console.error("Error fetching recipient user:", response);

                return setError(response)

            }
            // console.log("fetched recipient user:",response)
            setRecipientUser(response)
        }
        getUser()
    },[recipientId])

    return {recipientUser}
} 