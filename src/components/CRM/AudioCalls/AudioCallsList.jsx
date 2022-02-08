import React from "react";
import AudioCallsListRow from "./AudioCallsListRow";

const AudioCallsList = props => {

    const { rows } = props;
    const [play, setPlay] = React.useState(null);

    const nextPlay = id => {

        let next = null,
            current = false;

        rows.forEach(row => {
            if (current === true && row.duration > 0) {
                next = {
                    url: row.url,
                    id: row.id,
                    duration: row.duration,
                }
                current = false;
            }
            if (row.id === id) {
                current = true;
            }
        });

        setPlay(next);
    }

    return rows.map(row => <AudioCallsListRow
        key={row.id}
        row={row}
        setPlay={setPlay}
        play={play}
        nextPlay={nextPlay}
    />);

}

export default AudioCallsList;
