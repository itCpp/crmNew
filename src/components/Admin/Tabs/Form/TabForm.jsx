import React from "react";
import { Form } from "semantic-ui-react";

import TabFormName from "./TabFormName";

function StatusForm(props) {

    const { load, error, errors } = props;
    const { formdata, setFormdata } = props;

    const changeFormdata = (...a) => {

        const e = a[1] || a[0].currentTarget;

        const value = e.type === "checkbox"
            ? e.checked ? 1 : 0
            : e.value;

        if (typeof setFormdata == "function") {
            setFormdata({ ...formdata, [e.name]: value });
        }

    }

    React.useEffect(() => console.log(formdata), [formdata]);

    return <Form loading={load}>

        <TabFormName
            formdata={formdata}
            changeFormdata={changeFormdata}
            error={error}
            errors={errors}
        />

    </Form>

}

export default StatusForm;