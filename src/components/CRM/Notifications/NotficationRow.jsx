import { Icon } from "semantic-ui-react";

export const NotificationIcon = props => <div className="avatar text-center ml-2">
    <NotificationIconComponent {...props} />
</div>

export const NotificationIconComponent = props => {

    const { type } = props;

    let name = "alarm";

    if (type === "fine") name = "ruble";
    else if (type === "set_request") name = "tag";
    else if (type === "coming") name = "child";
    else if (type === "create_user") name = "add user";

    return <Icon
        name={name}
        size="big"
        fitted
        disabled
        className={props.className || ""}
        style={props.style || {}}
    />
}

export const NotificationRow = ({ row }) => {
    return null;
}

export default NotificationRow;