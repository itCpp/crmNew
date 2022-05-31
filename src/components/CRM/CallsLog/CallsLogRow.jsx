import React from "react";
import { Icon } from "semantic-ui-react";
import { axios, getFormaterTime } from "../../../utils";
import moment from "moment";
import AudioCalls from "./AudioCalls";

const CallsLogRow = props => {

    const { setRows, hidePhone } = props;
    const { play, setPlay } = props;

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

    return <div className="block-card mb-2 px-3 py-3 position-relative">

        <div className="d-flex align-items-center">

            <div className="mr-3">
                <Icon
                    name={row.type === "in" ? "arrow right" : "arrow left"}
                    title={row.type === "in" ? "Входящий" : "Исходящий"}
                    color={row.duration > 0 ? "green" : "red"}
                />
            </div>

            <div className="flex-grow-1 d-flex justify-content-start align-items-center" style={{ fontFamily: "monospace" }}>

                <div>
                    <span>{phone.caller}</span>
                    {row.operator && <b>{' '}
                        <span style={{ color: "#000000" }}>{row.operator}</span>
                    </b>}
                </div>
                <div className="mx-2">
                    <Icon
                        name="angle double right"
                        fitted
                        disabled
                    />
                </div>
                <div>{phone.number}</div>

            </div>

            {row.duration && <div className="d-flex align-items-center">

                <span className="mr-3" title="Длительность записи">
                    {(play?.id === row.id)
                        ? <AudioCalls row={play} />
                        : getFormaterTime(row.duration)
                    }
                </span>

                <span>
                    <Icon
                        name={play?.id === row.id ? "stop" : "play"}
                        link
                        title={play?.id === row.id ? "Остановить" : "Воспроизвести"}
                        onClick={() => setPlay(play?.id === row.id ? null : {
                            id: row.id,
                            path: row.url,
                            duration: row.duration,
                        })}
                    />
                </span>

                <span>
                    <Icon
                        name="download"
                        link
                        title="Скачать"
                        onClick={() => {
                            var tempLink = document.createElement('a');
                            tempLink.href = row.url;
                            tempLink.setAttribute('download', row.url);
                            tempLink.setAttribute('target', "_blank");
                            tempLink.click();
                        }}
                    />
                </span>

            </div>}

            <div className="ml-3 opacity-60">
                {moment(row.call_at).format("DD.MM.YYYY в HH:mm")}
            </div>

        </div>

    </div>
}

export default CallsLogRow;