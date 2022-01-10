import { Segment } from "../../UI";
import moment from "moment";
import { Comment, Label } from "semantic-ui-react";
import { NotificationIcon } from "./../../Notifications/NotficationRow";

export default (({ notifications, height }) => {

    const { rows, count, recent } = notifications;

    return <Segment
        header={{
            as: "h5",
            content: `Уведомления`
        }}
        height={height || 400}
        className="notifications"
    >

        {count > 0 && rows && <Comment.Group>
            {rows.map(row => <Comment key={row.id}>
                <NotificationIcon type={row.notif_type} />
                <Comment.Content>
                    <Comment.Author as="span">{row.author || "ЦРМ"}</Comment.Author>
                    <Comment.Metadata>
                        {moment(row.created_at).format("DD.MM.YYYY в HH:mm")}
                        {!row.readed_at && <Label circular color="red" empty size="mini" className="ml-2" title="Новое уведомление" />}
                    </Comment.Metadata>
                    <Comment.Text>{row.notification}</Comment.Text>
                </Comment.Content>
            </Comment>)}
        </Comment.Group>}

        {count === 0 && <div className="h-100 d-flex justify-content-center align-items-center">
            <small>Уведомлений еще нет</small>
        </div>}

    </Segment>;

})