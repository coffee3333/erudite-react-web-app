import * as React from "react";
import useIsOwner from "../../../hooks/permissionHooks/useIsOwner.jsx";
import useDeleteTopic from "../../../hooks/topicHooks/useDeleteTopic.jsx";
import DeleteModal from "../../../components/common/DeleteModal.jsx";


export default function DeleteTopicButton({ slug_topic, owner, onDeleted }) {
    const { loading, deleteTopic  } = useDeleteTopic();


    const handleDelete = async () => {
        try {
            await deleteTopic({slug_topic});
            onDeleted?.();
        } catch (err) {
            console.error("Error creating topic:", err);
        }
    };

    if (!useIsOwner(owner = {owner})) return null;

    return (
        <>
            <DeleteModal handleDelete={handleDelete} loading={loading} />
        </>
    );
}
