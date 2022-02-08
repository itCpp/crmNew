import moment from "moment";
import { Icon } from "semantic-ui-react";
import AudioPlayer from "./AudioPlayer";

const AudioCallsListRow = props => {

    const { row, play, setPlay, nextPlay } = props;
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

        {row.id === play?.id && <AudioPlayer
            data={play}
            setPlay={setPlay}
            nextPlay={nextPlay}
        />}

        {row.id !== play?.id && <div>
            {moment.unix(row.duration).utc().format(row.duration >= 3600 ? 'HH:mm:ss' : 'mm:ss')}
        </div>}

        <div className="call-detail-record-buttons">

            <span>
                <Icon
                    name={play?.id === row.id ? "stop" : "play"}
                    title={play?.id === row.id ? "Остановить" : "Воспроизвести"}
                    color="grey"
                    link={row.duration > 0}
                    disabled={row.duration === 0}
                    fitted
                    onClick={() => setPlay((play?.id === row.id || row.duration === 0) ? null : {
                        url: row.url,
                        id: row.id,
                        duration: row.duration,
                    })}
                />
            </span>

            <a href={row.url} download={`audio-call-record-${row.id}.wav`} target="_blank">
                <Icon
                    name="download"
                    title="Скачать"
                    color="grey"
                    link
                    fitted
                />
            </a>

        </div>

    </div>

}

export default AudioCallsListRow;