import moment from "moment";
import { Icon } from "semantic-ui-react";

const AudioCallsListRow = props => {

    const { row } = props;
    const className = [
        "call-detail-record",
        `call-detail-record-direction-${row.type}`
    ];

    return <div className={className.join(' ')}>

        <div title="Время звонка" className="mr-4">
            <span>{moment(row.call_at).format("DD.MM.YYYY HH:mm:ss")}</span>
        </div>

        <div className="flex-grow-1 d-flex align-items-center">

            {row.type === "in" && <>
                <span>{row.phone}</span>
                <span><Icon name="angle double right" className="mx-2" /></span>
                <span>{row.extension}</span>
            </>}

            {row.type === "out" && <>
                <span>{row.extension}</span>
                <span><Icon name="angle double right" className="mx-2" /></span>
                <span>{row.phone}</span>
            </>}

            {row.type !== "out" && row.type !== "in" && <>
                <span>{row.extension}</span>
                <span><Icon name="arrows alternate horizontal" className="mx-2" /></span>
                <span>{row.phone}</span>
            </>}

        </div>

        <div>
            {row.duration && moment.unix(row.duration).utc().format('HH:mm:ss')}
        </div>

        <div className="call-detail-record-buttons">

            <a href={row.url} download={`audio-call-record-${row.id}.wav`} target="_blank">
                <Icon
                    name="download"
                    fitted
                    link
                    color="grey"
                />
            </a>

        </div>

    </div>

}

export default AudioCallsListRow;