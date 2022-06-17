import React from "react";

const useSetMessages = ({ placeData, setPlaceData }) => {

    const [message, pushMessage] = React.useState(null);

    React.useEffect(() => {

        if (Boolean(message)) {

            setPlaceData(p => {

                const prev = { ...p };

                const messages = [...(prev?.messages || [])];
                let push = true;

                messages.forEach((row, i) => {
                    if ((message?.micro_id && row.micro_id === message.micro_id) || (message?.id && row.id === message.id)) {
                        push = false;
                        messages[i] = { ...row, ...message }
                    }
                });

                if (push)
                    messages.unshift(message);

                // const length = messages.length;
                // if (length > prev.limit * prev.page)
                //     messages.splice(length - 1, 1);

                prev.messages = messages;

                return prev;
            });

        }

    }, [message]);

    return {
        pushMessage,
    }
}

export default useSetMessages;