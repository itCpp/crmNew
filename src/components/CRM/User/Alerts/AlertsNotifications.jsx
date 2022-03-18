import React from "react";
import { Segment } from "../../UI";
import moment from "moment";
import { Comment, Label } from "semantic-ui-react";
import { NotificationIcon } from "./../../Notifications/NotficationRow";
import { EmptyChart } from "./../User";

export default (({ updateNotification, notifications, height }) => {

    const { count, recent } = notifications;
    const [rows, setRows] = React.useState(notifications.rows || []);

    React.useEffect(() => {
        if (updateNotification) {
            setRows([updateNotification, ...rows]);
        }
    }, [updateNotification]);

    return <Segment
        header={{
            as: "h5",
            content: `Уведомления`
        }}
        height={height || 400}
        className="notifications d-flex flex-column"
    >

        {rows && rows.length > 0 && <Comment.Group
            style={{ maxWidth: "100%" }}
            className="segmet-list h-100"
        >

            {rows.map(row => <Comment key={row.id}>

                <NotificationIcon type={row.notif_type} />

                <Comment.Content>

                    <Comment.Author as="span">{row.author || "ЦРМ"}</Comment.Author>

                    <Comment.Metadata>

                        {moment(row.created_at).format("DD.MM.YYYY в HH:mm")}

                        {!row.readed_at && <Label
                            circular
                            color="red"
                            empty
                            size="mini"
                            className="ml-2"
                            title="Новое уведомление"
                        />}
                    </Comment.Metadata>

                    <Comment.Text>{row.notification}</Comment.Text>

                </Comment.Content>

            </Comment>)}

        </Comment.Group>}

        {rows && rows.length === 0 && <EmptyChart
            height="100%"
            text="Уведомлений еще нет"
        />}

    </Segment>;

})