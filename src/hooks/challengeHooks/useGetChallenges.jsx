import { useCallback, useState } from 'react';
import toast from "react-hot-toast";
import challengeService from "../../api/endpoints/challengeService.jsx";

const useGetChallenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getChallengesViaTopic = useCallback(async ({ slug_topic }) => {
        if (!slug_topic && slug_topic === "") {
            console.log('Slug is undefined or null');
            setError(new Error("Slug is required"));
            return null;
        }
        setLoading(true);
        console.log('slug contents:', slug_topic); // Log the form object
        try {
            const res = await challengeService.getChallengesViaTopic({ slug_topic });

            setChallenges(res || []);
        } catch (error) {
            toast.error("Failed to fetch courses");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    return { challenges, loading, error, getChallengesViaTopic };
};

export default useGetChallenges;