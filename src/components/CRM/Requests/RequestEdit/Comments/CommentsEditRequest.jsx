import React from "react";
import { useSelector } from "react-redux";
import axios from "./../../../../../utils/axios-header";
import moment from "./../../../../../utils/moment";
import TextareaAutosize from "react-textarea-autosize";
import { Icon, Dimmer, Loader } from "semantic-ui-react";

import "./comments.css";

const CommentRow = React.memo(props => {

    const { row, user } = props;

    let className = ["commets-in-modal"];

    if (Number(row.created_pin) === Number(user.pin))
        className.push("comment-type-my");
    else if (row.type_comment)
        className.push("comment-type-" + row.type_comment);

    return <div className={className.join(' ')} title={moment(row.created_at).format("DD MMMM YYYY в HH:mm")}>
        {row.created_pin && <div className="comment-author">
            <strong>{row.created_pin}</strong>
            {row.created_fio && <span>{' '}{row.created_fio}</span>}
        </div>}
        <div className="comment-text">{row.comment}</div>
        <div className="comment-time">{moment(row.created_at).fromNow()}</div>
    </div>

});

const Comments = props => {

    const { row, comments, setComments } = props;
    const user = useSelector(state => state.main.userData);

    const [loading, setLoading] = React.useState(false);
    const [send, setSend] = React.useState(false);
    const [comment, setComment] = React.useState(null);

    React.useEffect(() => {

        if (send) {

            if (!comment) return;

            setLoading(true);

            axios.post('requests/sendComment', {
                id: row.id,
                comment,
            }).then(({ data }) => {
                setComments([data.comment, ...comments]);
                setComment(null);
            }).catch(error => {
                axios.toast(error);
            }).then(() => {
                setLoading(false);
            })

        }

        return () => setSend(false);

    }, [send]);

    const onKeyDown = e => {

        if (e.keyCode === 13 && e.ctrlKey) {
            return setComment(e.target.value + "\r\n");
        }

        if (e.keyCode === 13 && !e.ctrlKey) {
            e.preventDefault();
            !loading && setSend(true);
        }

    }

    return <div className="d-flex flex-column h-100" style={{ maxHeight: 538 }}>

        <h5>Комментарии</h5>

        <div className="no-comments"><Icon name="mail" /></div>

        <div className="comments-body">
            {comments.map(comment => <CommentRow
                key={comment.id}
                user={user}
                row={comment}
            />)}
        </div>

        <div className="comment-append mt-3 ui form position-relative">

            <TextareaAutosize
                maxRows={4}
                rows={1}
                className="comment-input"
                placeholder="Напишите комментарий..."
                value={comment ?? ""}
                onChange={e => setComment(e.target.value)}
                onKeyDown={onKeyDown}
            />

            <Icon
                name="send"
                className="comment-send"
                title="Отправить комментарий"
                onClick={() => !loading && setSend(true)}
            />

            {loading && <Dimmer active inverted><Loader active inverted size="small" /></Dimmer>}

        </div>

    </div>
};

export default React.memo(Comments);