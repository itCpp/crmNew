import AudioCallsListRow from "./AudioCallsListRow";

const AudioCallsList = props => {

    const { rows } = props;

    return rows.map(row => <AudioCallsListRow key={row.id} row={row} />);

}

export default AudioCallsList;
