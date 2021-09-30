import { Icon } from "semantic-ui-react";

const ButtonHeader = props => {

    let content = props.children;
    let className = ["btn-header"];


    if (props.content)
        content = props.content;
    
    if (props.icon)
        content = <Icon name={props.icon} />

    if (props.className)
        className.push(props.className);

    return <div className="btn-header-row">
        <button
            className={className.join(" ")}
            title={props.title}
            onClick={props.onClick || null}
        >
            {content}
        </button>
    </div>

}

export default ButtonHeader;