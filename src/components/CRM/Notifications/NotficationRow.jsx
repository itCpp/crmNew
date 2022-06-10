import { Icon } from "semantic-ui-react";
import { SEMANTIC_ICONS } from "../../Admin/MailList/icons";

export const NotificationIcon = props => <div className="avatar text-center ml-2">
    <NotificationIconComponent {...props} />
</div>

export const NotificationIconComponent = props => {

    const { type, icon, setColor } = props;

    let name = "alarm",
        color = null;

    if (type === "fine") name = "ruble";
    else if (type === "set_request") name = "tag";
    else if (type === "coming") name = "child";
    else if (type === "create_user") name = "add user";
    else if (setColor && type === "success") color = "green";
    else if (setColor && type === "error") color = "red";
    else if (setColor && type === "warning") color = "yellow";

    if (icon && SEMANTIC_ICONS.indexOf(icon) >= 0) name = icon;

    return <Icon
        name={name}
        color={color}
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