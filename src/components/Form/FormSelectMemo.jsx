import React from "react";
import { FormSelect } from "semantic-ui-react";

const FormSelectMemo = React.memo(props => {

    return <FormSelect {...props} />

});

export default FormSelectMemo;