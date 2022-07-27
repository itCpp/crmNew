import React from "react";
import "highlight.js/styles/vs2015.css";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import { Modal } from "semantic-ui-react";

hljs.registerLanguage('javascript', javascript);

const ViewData = props => {

    const { data } = props;
    const { open, close } = props;

    React.useEffect(() => {
        hljs.initHighlighting();
    }, []);

    return <Modal
        open={open}
        onClose={close}
        closeIcon
        content={<div className="content px-2 py-0">
            <pre className="bordered">
                <code className="json">{JSON.stringify(data, null, "    ")}</code>
            </pre>
        </div>}
    />

}

export default ViewData;