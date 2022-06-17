import React from "react";

const useSetRooms = (setRooms, userId = null) => {

    const [data, updateRooms] = React.useState(null);

    React.useEffect(() => {

        if (Boolean(data) && typeof setRooms == "function") {

            setRooms(p => {

                const rows = [...p];
                let push = true;
    
                rows.forEach((row, i) => {
                    if (row.id === data?.id) {
                        push = false;
                        rows[i].message_at = data.message_at;
                        rows[i].message = data.message;
                    }
                });
    
                if (push) {
    
                    const row = { ...data }
    
                    if (row.is_private && Boolean(userId) && typeof row.users == "object") {

                        let user = row.users.find(i => Number(i.id) !== Number(userId));
                        row.name = user.name_full || "Неизветсный чат";
                        row.pin = user.pin || "?";
                        row.user_id = user.user_id || null;
                        
                    }
    
                    rows.push(row);
                }
    
                return rows.sort((a, b) => new Date(b.message_at) - new Date(a.message_at));
            });

        }

    }, [data]);

    return {
        updateRooms
    };

}

export default useSetRooms;