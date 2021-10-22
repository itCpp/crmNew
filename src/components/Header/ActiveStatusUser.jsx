import ButtonHeader from "./ButtonHeader";
import { Icon } from "semantic-ui-react";

const ActiveStatusUser = props => {
    return <ButtonHeader disabled>
        <Icon name="briefcase" color={props?.worktime?.color || "grey"} />
    </ButtonHeader>
}

export default ActiveStatusUser;