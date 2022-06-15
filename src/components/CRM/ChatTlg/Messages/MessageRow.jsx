import React from "react";
import { getDurationDisplay, formatSize } from "./../../../system";
import moment from "moment";
import { Icon, Loader } from "semantic-ui-react";

const MessageRow = React.memo(props => {

    const { row, userId } = props;
    const className = ["row-message"];

    if (row.my || userId === row.user_id)
        className.push("my-message");

    if (row.type)
        className.push("row-message-inputs");

    return <div className={className.join(' ')}>

        {row.body && row.body.length > 0 && <MessageFiles {...props} />}

        {row.message && <div className="message-text">{row.message}</div>}

        <small className="sent-time">
            <span>{moment(row.created_at).format("DD.MM.YYYY HH:mm")}</span>
            {row.failed_at && <Icon
                name="warning sign"
                color="red"
                fitted
                title={row.error || "Ошибка отправки сообщения"}
            />}
            {row.loading && <Icon
                name="clock"
                fitted
                disabled
                title="Отправка сообщения"
            />}
            {!row.loading && !row.failed_at && <Icon
                name="check"
                fitted
                disabled
            />}
        </small>

    </div>;

});

const MessageFiles = props => (
    <div>{props.row.body.map((file, i) => <FilesSwitch key={i} file={file} {...props} />)}</div>
)

const FilesSwitch = props => {

    const { file } = props;

    if (file.loading)
        return <FileLoading {...props} />

    if (file.error)
        return <FileError {...props} />

    switch (file.type) {
        case "audio":
            return <FileAudio {...props} />
        default:
            return <FileDefault {...props} />
    }
}

const FileLoading = ({ file }) => {
    return <div className="file-row-in-message">
        <div className="play-audio">
            <Loader inline inverted active size="small" />
        </div>
        <div className="file-info">
            <div className="file-info-title room-short-message">{file.name || "Новый файл..."}</div>
        </div>
    </div>
}

const FileError = ({ file }) => {
    return <div className="file-row-in-message">
        <div className="file-error">
            <span><Icon name="file" fitted /></span>
        </div>
        <div className="file-info">
            <div className="file-info-title room-short-message">{file.name || <i>Без имени...</i>}</div>
            <div className="error-message">{file.error}</div>
        </div>
    </div>
}

const FileAudio = ({ file, openFile, setOpenFile }) => {

    const clickPlay = () => {
        let play = file.hash === openFile?.hash && openFile?.isPlay ? false : true;
        setOpenFile({ ...file, isPlay: play });
    }

    const icon = file.hash === openFile?.hash && openFile?.isPlay ? "pause" : "play";

    return <div className="file-row-in-message">
        <div className="play-audio">
            <span>
                <Icon
                    name={icon}
                    fitted
                    link
                    onClick={clickPlay}
                />
            </span>
        </div>
        <div className="file-info">
            <div className="file-info-title room-short-message">{file.name || <i>Без имени...</i>}</div>
            <div className="file-info-subtitle">
                {file.duration && <span>{getDurationDisplay(file.duration)}</span>}
                {file.size && <span>{formatSize(file.size)}</span>}
            </div>
        </div>
    </div>
}

const FileDefault = ({ file }) => {
    return <div className="file-row-in-message">
        <div className="play-audio">
            <span><Icon name="file" fitted /></span>
        </div>
        <div className="file-info">
            <div className="file-info-title room-short-message">{file.name || <i>Без имени...</i>}</div>
            <div className="file-info-subtitle">
                {file.duration && <span>{getDurationDisplay(file.duration)}</span>}
                {file.size && <span>{formatSize(file.size)}</span>}
            </div>
        </div>
    </div>
}

export default MessageRow;