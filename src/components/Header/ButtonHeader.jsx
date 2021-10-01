import { Icon, Label } from "semantic-ui-react";

const ButtonHeader = props => {

    let content = props.children;
    let className = ["btn-header"];
    let label = null;

    if (props.content)
        content = props.content;
    
    if (props.icon)
        content = <Icon name={props.icon} />

    if (props.className)
        className.push(props.className);

    if (props.label)
        label = <Label circular color={`red`} empty size="mini" />

    return <div className="btn-header-row">
        <button
            className={className.join(" ")}
            title={props.title}
            onClick={props.onClick || null}
        >
            {content}
            {label}
        </button>
    </div>

}

export default ButtonHeader;