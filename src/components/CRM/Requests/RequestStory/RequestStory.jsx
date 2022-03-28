import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dimmer, Icon, Loader, Message, Modal } from "semantic-ui-react";
import { setShowStoryRequest } from "../../../../store/requests/actions";
import { axios } from "../../../../utils";
import RequestStoryVisual from "./RequestStoryVisual";
import StoryRow from "./StoryRow";

const RequestStory = () => {

    const row = useSelector(store => store.requests.showStoryRequest);
    const dispatch = useDispatch();

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const [rows, setRows] = React.useState([]);
    const [now, setNow] = React.useState(null);
    const [prev, setPrev] = React.useState(null);

    const close = React.useCallback(() => {
        dispatch(setShowStoryRequest(null));
    }, []);

    React.useEffect(() => {

        if (row?.id) {

            setLoading(true);

            axios.post('requests/story', { id: row.id }).then(({ data }) => {
                setNow(data.row);
                setRows(data.rows);
            }).catch(e => {
                axios.setError(e, setError);
            }).then(() => {
                setLoading(false);
            });
        }

    }, [row]);

    return <Modal
        header={`История изменений${row?.id && ` #${row.id}`}`}
        open={true}
        centered={false}
        // closeOnDimmerClick={false}
        // closeOnEscape={false}
        onClose={close}
        closeIcon={<Icon
            name="close"
            fitted
            link={!loading}
            onClick={close}
            disabled={loading}
        />}
        content={<div className="content position-relative">

            {!loading && error && <div className="d-flex justify-content-center align-items-center position-absolute" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
                <Message error content={error} />
            </div>}

            {!loading && rows && rows.map((r, i) => <StoryRow
                key={`row_story_${i}`}
                row={r}
            />)}

            {!loading && rows && rows.length === 0 && <div className="my-5 opacity-50 text-center">
                <b>Истории не найдено</b>    
            </div>}

            {loading && <div className="my-5 py-5">
                <Dimmer active inverted>
                    <Loader active />
                </Dimmer>
            </div>}

        </div>}
    />

}

export default RequestStory;