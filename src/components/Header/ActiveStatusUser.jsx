
import { useState, useEffect } from "react";
import axios from "./../../utils/axios-header";
import ButtonHeader from "./ButtonHeader";
import { Icon } from "semantic-ui-react";

const ActiveStatusUser = props => {

    const { worktime, setUserWorkTime } = props;
    const [load, setLoad] = useState(false);

    useEffect(() => {

        if (load) {
            axios.post('users/setWorkTime', { type: "timeout" }).then(({ data }) => {
                setUserWorkTime(data.worktime);
            }).catch(error => {
                axios.toast(error);
            }).then(() => {
                setLoad(false);
            });
        }

    }, [load]);

    return <>

        <ButtonHeader
            disabled={worktime?.timeout_disabled ? true : false}
            load={load}
            onClick={() => setLoad(true)}
        >
            <Icon
                name={worktime?.timeout_icon || "clock"}
                color={worktime?.timeout_color || "grey"}
                disabled={worktime?.timeout_disabled ? true : false}
            />
        </ButtonHeader>

        {/* <ButtonHeader disabled> */}
        {/* <span className="ml-2 mt-1">
            <Icon name="briefcase" color={worktime?.color || "grey"} />
        </span> */}
        {/* </ButtonHeader> */}

    </>
}

export default ActiveStatusUser;