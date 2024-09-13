import { useState, useEffect, useCallback } from 'react';
import { getRequest, baseUrl } from '../utils/services';

const useFetchGroup = (groupId) => {
    const [groupData, setGroupData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchGroupData = useCallback(async () => {
        if (!groupId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await getRequest(`${baseUrl}/chat/${groupId}`);

            if (response.error) {
                console.error("Error fetching group data:", response.message || "Unknown error");
                setError(response);
                return;
            }

            setGroupData(response);
        } catch (err) {
            console.error("Error fetching group data:", err);
            setError({ message: "An error occurred while fetching group data" });
        } finally {
            setIsLoading(false);
        }
    }, [groupId]);

    useEffect(() => {
        fetchGroupData();
    }, [fetchGroupData]);

    return { groupData, isLoading, error };
};

export default useFetchGroup;
