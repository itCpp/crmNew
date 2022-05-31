import React from "react";
import { Icon, Loader, Message } from "semantic-ui-react";
import { axios } from "../../../utils";
import moment from "moment";

const CallsLogRow = props => {

    const { setRows, hidePhone } = props;

    const [row, setRow] = React.useState(props.row);
    const [phone, setPhone] = React.useState({
        caller: row.caller,
        number: row.phone,
    });

    React.useEffect(() => {

        if (hidePhone === false && row.checkHidePhone === true) {

            axios.post('calls/get', { id: row.id }).then(({ data }) => {

                setPhone({
                    caller: data.row.caller,
                    number: data.row.phone,
                });

                setRows(p => {
                    let rows = [...p];
                    rows.forEach((row, i) => {
                        if (row.id === data.row.id) {
                            rows[i] = data.row;
                        }
                    });
                    return rows;
                });
            });

            setRow(p => ({ ...p, checkHidePhone: false }));
        }
    }, []);

    return <div className="block-card mb-2 px-3 py-2">

        <div className="d-flex align-items-center">

            <div className="mr-3">
                <Icon
                    name={row.type === "out" ? "arrow right" : "arrow left"}
                    color={row.duration > 0 ? "green" : "red"}
                />
            </div>

            <div className="flex-grow-1 d-flex justify-content-start align-items-center">

                <div style={{ fontFamily: "monospace" }}>
                    <span>{phone.caller}</span>
                    {row.operator && <b>
                        {' '}
                        <span style={{ color: "#0e4dff" }}>{row.operator}</span>
                    </b>}
                </div>
                <div className="mx-2">
                    <Icon
                        name="angle double right"
                        fitted
                        disabled
                    />
                </div>
                <div style={{ fontFamily: "monospace" }}>{phone.number}</div>

            </div>

            <div className="d-flex align-items-center"></div>

            <div className="ml-3 opacity-60">
                {moment(row.call_at).format("DD.MM.YYYY в HH:mm")}
            </div>

        </div>

    </div>
}

export default CallsLogRow;