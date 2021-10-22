import { Icon, Label, Loader } from "semantic-ui-react";

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

    if (props.load) {
        content = <>
            <span style={{ opacity: 0 }}>{content}</span>
            <span style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}><Loader active size="small" /></span>
        </>
    }

    return <div className="btn-header-row">
        <button
            className={className.join(" ")}
            title={props.title}
            onClick={props.onClick || null}
            disabled={(props.disabled || props.load) || null}
        >
            {content}
            {label}
        </button>
    </div>

}

export default ButtonHeader;