import React from "react";
import { useSelector, useDispatch } from "react-redux";

import RequestEditClient from "./RequestEditCell/RequestEditClient";
import RequestEditComment from "./RequestEditCell/RequestEditComment";
import RequestEditCommentFirst from "./RequestEditCell/RequestEditCommentFirst";
import RequestEditCommentUrist from "./RequestEditCell/RequestEditCommentUrist";
import RequestEditDate from "./RequestEditCell/RequestEditDate";
import RequestEditTheme from "./RequestEditCell/RequestEditTheme";

const RequestEditCell = props => {

    const { editCell } = useSelector(state => state.requests);
    const modal = React.useRef();

    React.useEffect(() => {

        if (modal.current && editCell?.id) {
            modal.current.classList.add('show');
            modal.current.style.top = editCell?.pageY;
            modal.current.style.right = editCell?.pageX;

            console.log(editCell, modal);
        }

    }, [editCell]);

    return <div className="request-edit-cell-modal" ref={modal}>
        <RequestEditSwitch
            editCell={editCell}
        />
    </div>

}

const RequestEditSwitch = props => {

    switch (props?.editCell?.type) {
        case "date":
            return <RequestEditDate {...props} />
        case "client":
            return <RequestEditClient {...props} />
        case "theme":
            return <RequestEditTheme {...props} />
        case "commentFirst":
            return <RequestEditCommentFirst {...props} />
        case "comment":
            return <RequestEditComment {...props} />
        case "commentUrist":
            return <RequestEditCommentUrist {...props} />
        default:
            return null;
    }

}

export default RequestEditCell;