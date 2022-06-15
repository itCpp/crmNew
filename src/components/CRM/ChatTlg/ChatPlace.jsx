import React from "react";
import { axios, uuid } from "../../system";
import moment from "moment";
import { Loader, Icon } from "semantic-ui-react";
import TextareaAutosize from "react-textarea-autosize";
import MessageRow from "./Messages/MessageRow";
import { Message } from "./Chat";
import Player from "./Player";
import throttle from "lodash/throttle";
import { getFormatTime } from "./Rooms/Rooms";

const ChatPlace = props => {

    const { room, setRoom, updateRoom, userId, setDropFindList } = props;
    const { messages, setMessages, updateMessage } = props;
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const [chatId, setChatId] = React.useState(null);
    const [createNewChat, setCreateNewChat] = React.useState(null);

    const [load, setLoad] = React.useState(false);
    const [endRows, setEndRows] = React.useState(false);
    const [point, setPoint] = React.useState(null);
    const [page, setPage] = React.useState(1);
    const [message, setMessage] = React.useState("");
    const [openFile, setOpenFile] = React.useState(null);

    const sendMessage = () => {

        const date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        const newMessage = {
            chat_id: room.id || chatId,
            to_user_id: room.user_id,
            message: String(message).trim(),
            created_at: date,
            updated_at: date,
            loading: true,
            my: true,
            uuid: uuid(),
        }

        if (newMessage.message === "" || !newMessage.message)
            return null;

        setMessages(prev => ([newMessage, ...prev]));
        setMessage("");

        axios.post('chat/sendMessage', newMessage).then(({ data }) => {

            updateMessage(data.message);

            if (createNewChat) {
                setCreateNewChat(null);
                setDropFindList(room);
            }

            if (room.id === null && data.room) {
                setRoom(prev => {
                    prev.id = data.room.id;
                    return prev;
                })
            }

            data.room && updateRoom(data.room);

        }).catch(e => {
            updateMessage({
                ...newMessage,
                loading: false,
                failed_at: true,
            });
        });

    }

    const onKeyDown = e => {

        if (e.keyCode === 13 && e.ctrlKey)
            return setMessage(message => (message + "\n"));

        if (e.keyCode === 13) {
            e.preventDefault();
            sendMessage();
            return false;
        }

    }

    const getMessages = params => {

        setLoad(true);
        setPage(params.page || 1);

        axios.post('chat/getMessages', {
            chat_id: room.id || chatId,
            new_chat_id: room.new_chat_id,
            point: point,
            ...params,
        }).then(({ data }) => {

            setMessages(p => data.page > 1 ? [...p, ...data.messages] : data.messages);
            setError(null);

            if (data.newChatId)
                setChatId(data.newChatId);

            if (data.point > 0)
                setPoint(data.point);

            if (data.nextPage > data.pages)
                setEndRows(true);

        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
            setLoad(false);
        });

    }

    const onScroll = throttle(e => {

        let data = {
            offsetHeight: e.target?.offsetHeight,
            scrollHeight: e.target?.scrollHeight,
            scrollTop: e.target?.scrollTop,
        }

        data.scrolling = Math.abs(data.scrollTop) + data.offsetHeight;

        if (data.scrolling > (data.scrollHeight - 300) && !load && !endRows)
            getMessages({ page: page + 1 });

    }, 500);

    React.useEffect(() => {

        if (room) {

            setEndRows(false);
            setPoint(null);
            setMessage("");
            setError(null);

            if (room.id) {

                setLoading(true);

                axios.post('chat/getRoom', {
                    chat_id: room.id
                }).then(({ data }) => {
                    getMessages({ page: 1, point: null });
                    updateRoom(data.room);
                    setChatId(room.id || null);
                }).catch(e => {
                    setError(axios.getError(e));
                    setLoading(false);
                });

            }
            else {
                setChatId(room.id || null);
                setCreateNewChat(true);
                setEndRows(true);
                setMessages([]);
            }
        }

    }, [room]);

    return <div className="chat-body-content">

        <div className="chat-content-header">
            <div>
                {room.pin && <strong className="title-header-pin">{room.pin}</strong>}
                <span>{room.name}</span>
            </div>

            {/* {room.last_show && <div title="Дата и время просмотра чат-комнаты">
                <small style={{ opacity: 0.6 }}>{getFormatTime(room.last_show)}</small>
            </div>} */}

            <Player file={openFile} setFile={setOpenFile} />
        </div>

        <div className="chat-messages">

            {loading && <div className="centered">
                <Loader active inline inverted />
            </div>}

            {!loading && load && <div className="centered" style={{ alignItems: "start", paddingTop: "0.8rem" }}>
                <Loader active inline inverted indeterminate />
            </div>}

            {!loading && error && <div className="centered">
                <Message error content={error} />
            </div>}

            {!loading && !error && <div className="messages-body" onScroll={onScroll}>

                {messages && messages.length > 0 && messages.map((row, i) => <MessageRow
                    key={i}
                    row={row}
                    openFile={openFile}
                    setOpenFile={setOpenFile}
                    userId={userId}
                />)}

                {messages && messages.length === 0 && <div className="centered">
                    <Message info content="Сообщений еще нет" />
                </div>}

            </div>}

        </div>

        <div className="chat-create-message">

            <TextareaAutosize
                disabled={loading}
                className="new-message"
                placeholder="Написать сообщение..."
                onChange={e => setMessage(e.target.value)}
                value={message}
                onKeyDown={onKeyDown}
                disabled={loading}
            />

            <div className="send-message-bottom">
                <span>
                    <Icon
                        name="send"
                        link={message.length > 0}
                        size="large"
                        title="Отправить сообщение"
                        disabled={message.length === 0}
                        onClick={message.length === 0 ? null : sendMessage}
                    />
                </span>
            </div>

        </div>

    </div>

}

export default ChatPlace;