import React from "react";
import moment from "./../../../utils/moment";

import "./comments.css";

const CommentRow = props => {

    const { row } = props;

    let className = ["commets-in-modal"];

    if (row.created_pin === props.user.pin)
        className.push("comment-type-my");
    else if (row.type_comment)
        className.push("comment-type-" + row.type_comment);

    return <div className={className.join(' ')}>
        {row.created_pin && <div className="comment-author">
            <strong>{row.created_pin}</strong>
            {row.created_fio && <span>{' '}{row.created_fio}</span>}
        </div>}
        <div className="comment-text">{row.comment}</div>
        <div className="comment-time">{moment(row.created_at).fromNow()}</div>
    </div>

}

const Comments = props => {

    const { row, comments } = props;

    return <div className="d-flex flex-column h-100" style={{ maxHeight: 538 }}>

        <h5>Комментарии</h5>

        <div className="comments-body">
            {comments.map(comment => <CommentRow key={comment.id} {...props} row={comment} />)}
        </div>

    </div>
}

export default Comments;