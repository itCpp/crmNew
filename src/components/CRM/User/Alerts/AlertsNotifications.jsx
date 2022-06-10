import React from "react";
import { axios } from "../../../../utils";
import { Segment } from "../../UI";
import moment from "moment";
import { Comment, Header, Label, Loader } from "semantic-ui-react";
import { NotificationIcon } from "./../../Notifications/NotficationRow";
import { EmptyChart } from "./../User";
import { useDispatch } from "react-redux";
import { setShowNotification } from "../../../../store/actions";

export default (({ updateNotification, notifications, height }) => {

    const { count } = notifications;
    const dispatch = useDispatch();

    const [rows, setRows] = React.useState(notifications.rows || []);
    const [allReadedLoad, setAllReadedLoad] = React.useState(false);
    const [recent, setRecent] = React.useState(Number(notifications.recent) || 0);

    const readedMessage = React.useCallback(id => {

        setRows(prev => {
            let rows = [...prev];
            rows.forEach((row, i) => {
                if (row.id === id) {
                    rows[i].readed_at = new Date;
                }
            });
            return rows;
        });

        setRecent(r => ((r - 1) < 0 ? 0 : (r - 1)));
        dispatch(setShowNotification(id))

    }, []);

    const setAllRead = React.useCallback(() => {

        setAllReadedLoad(true);

        axios.post('users/notifications/read/all').then(({ data }) => {
            setRows(prev => {
                let rows = [...prev];
                rows.forEach((row, i) => {
                    if (!row.readed_at) {
                        rows[i].readed_at = data.readed_at;
                    }
                });
                return rows;
            });
            setRecent(0);
        }).catch(() => {
            axios.toast("Не удалось отметить уведомления прочитанными");
        }).then(() => {
            setAllReadedLoad(false);
        });

    }, []);

    React.useEffect(() => {
        if (updateNotification) {

            setRecent(r => r + 1);
            setRows([updateNotification, ...rows]);

            if (updateNotification.live === true) {
                setTimeout(() => {
                    setRows(prev => {
                        prev = [...prev];
                        prev.forEach((row, i) => {
                            if (row.id === updateNotification.id) {
                                prev[i].live = false;
                            }
                        });
                        return prev;
                    });
                }, 1000);
            }
        }
    }, [updateNotification]);

    return <Segment
        height={height || 400}
        className="notifications d-flex flex-column"
    >

        <div className="d-flex justify-content-between align-items-center">
            <Header
                as="h5"
                content="Уведомления"
                className="m-0 mr-2"
            />
            <div className="d-flex align-items-center position-relative">
                {recent > 0 && <div className="position-absolute text-nowrap d-flex align-items-center" style={{ right: 0 }}>
                    {allReadedLoad && <Loader active size="mini" inline className="mr-2" />}
                    <a href={allReadedLoad ? null : "#"} onClick={e => {
                        e.preventDefault();
                        !allReadedLoad && setAllRead();
                    }}>Отметить как прочитанные</a>
                </div>}
            </div>
        </div>

        {rows && rows.length > 0 && <Comment.Group
            style={{ maxWidth: "100%" }}
            className="segmet-list h-100"
        >

            {rows.map((row, i) => {

                let className = ["notification-my-data-row"];

                if (row.live)
                    className.push("update-notification-row");

                let message = row.notification;

                if (row.notif_type === "create_user") {
                    message = <div>Создана новая учетная запись. ФИО сотрудника: <b>{row.data?.name_full}</b>. PIN: <b>{row.data?.pin}</b>. {row.data?.callcenter && <span>Колл-центр: <b>{row.data.callcenter}</b></span>}</div>
                }

                return <Comment key={`${i}_${row.id}`} className={className.join(' ')} onClick={() => readedMessage(row.id)}>

                    <NotificationIcon
                        type={row.notif_type}
                        icon={row?.data?.icon || null}
                        setColor
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                        }}
                    />

                    <Comment.Content>

                        <Comment.Author as="span">
                            {row?.author_data?.fio
                                ? <span>
                                    {row.author_data?.pin && <strong className="mr-1">{row.author_data.pin}</strong>}
                                    <span>{row.author_data.fio}</span>
                                </span>
                                : "@bot"
                            }
                        </Comment.Author>

                        <Comment.Metadata>

                            {moment(row.created_at).format("DD.MM.YYYY в HH:mm")}

                        </Comment.Metadata>

                        {!row.readed_at && <Label
                            circular
                            color="red"
                            empty
                            size="mini"
                            className="ml-2"
                            title="Новое уведомление"
                        />}

                        <Comment.Text
                            content={message}
                            title={message}
                            className="text-nowrap"
                            style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        />

                    </Comment.Content>

                </Comment>
            })}

        </Comment.Group>}

        {rows && rows.length === 0 && <EmptyChart
            height="100%"
            text="Уведомлений еще нет"
        />}

    </Segment>;

})