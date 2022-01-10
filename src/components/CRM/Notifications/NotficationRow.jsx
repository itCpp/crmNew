import { Icon } from "semantic-ui-react";

export const NotificationIcon = ({ type }) => {

    let name = "alarm";

    if (type === "fine") name = "ruble";

    return <div className="avatar text-center">
        <Icon name={name} size="big" fitted disabled />
    </div>

}

export const NotificationRow = ({ row }) => {
    return null;
}

export default NotificationRow;