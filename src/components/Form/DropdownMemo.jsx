import { memo } from "react";
import { Dropdown } from "semantic-ui-react";

const DropdownMemo = memo(props => {

    return <Dropdown {...props} />

});

export default DropdownMemo;