import React from "react"
import { useDispatch } from "react-redux";
import { Dimmer, Icon, Loader, Message, Modal } from "semantic-ui-react"
import { setShowAudioCall } from "../../../store/requests/actions";
import { axios } from "../../../utils";
import "./audio-calls.css";
import AudioCallsList from "./AudioCallsList";

const AudioCalls = props => {

    const { data } = props;
    const open = data ? true : false;
    const dispatch = useDispatch();
    const setOpen = show => dispatch(setShowAudioCall(show));

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {

        if (data) {
            setLoading(true);

            axios.post('requests/calls', data || {}).then(({ data }) => {
                setError(null);
                setRows(data.rows);
            }).catch(e => {
                setError(axios.getError(e));
            }).then(() => {
                setLoading(false);
            });
        }

    }, [data]);

    return <Modal
        open={open}
        closeIcon={<i className="close icon" onClick={() => setOpen(null)}></i>}
        centered={false}
    >
        <Modal.Header><Icon name="file audio" /> Аудиозаписи звонков</Modal.Header>

        <Modal.Content className="position-relative" scrolling>

            <Modal.Description>

                {error && <Message error content={error} size="tiny" />}

                {rows && rows.length > 0 && <AudioCallsList rows={rows} />}

                {rows && rows.length === 0 && <div className="opacity-80 text-center my-5">
                    <div><Icon name="volume control phone" fitted size="huge" disabled /></div>
                    <div className="mt-3">{loading ? "Загрузка..." : "Записей звонков еще нет"}</div>
                </div>}

            </Modal.Description>

            <Dimmer active={loading} inverted>
                <Loader active />
            </Dimmer>

        </Modal.Content>
    </Modal>

}

export default AudioCalls;