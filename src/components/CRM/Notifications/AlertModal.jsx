import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header, Icon, Modal, Placeholder, PlaceholderLine } from "semantic-ui-react";
import { setShowNotification } from "../../../store/actions";
import { axios } from "../../../utils";
import { NotificationIconComponent } from "./NotficationRow";
import moment from "moment";

const AlertModal = props => {

    const { showNotification } = useSelector(state => state.main);
    const dispatch = useDispatch();
    const [row, setRow] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {

        if (showNotification) {

            setLoading(true);

            axios.post('users/notifications/read', {
                id: showNotification
            }).then(({ data }) => {
                setRow(data);
            }).catch(e => {
                setError(axios.getError(e));
            }).then(() => {
                setLoading(false);
            });
        }

        return () => {
            setRow({});
            setLoading(true);
            setError(null);
        }

    }, [showNotification]);

    return <Modal
        basic
        open={showNotification ? true : false}
        onClose={() => dispatch(setShowNotification(null))}
        header={<Header icon>
            {loading
                ? <div className="d-flex justify-content-center">
                    <Placeholder style={{ width: 46, height: 54, opacity: 0.5 }} className="rounded" />
                </div>
                : <NotificationIconComponent type={row.notif_type} />
            }
            {/* <span>Уведомление</span> */}
        </Header>}
        centered={false}
        content={<div className="content">

            {loading && <>
                <Placeholder style={{ width: 120, height: "1.07142857rem" }} className="rounded m-0 mx-auto mb-1" />
                <Placeholder style={{ width: 180, height: "1.07142857rem" }} className="rounded m-0 mx-auto mb-3" />

                <Placeholder style={{ width: 40, height: 12 }} className="rounded m-0 mr-2 d-inline-block" />
                <Placeholder style={{ width: 70, height: 12 }} className="rounded m-0 mr-2 d-inline-block" />
                <Placeholder style={{ width: 12, height: 12 }} className="rounded m-0 mr-2 d-inline-block" />
                <Placeholder style={{ width: 36, height: 12 }} className="rounded m-0 mr-2 d-inline-block" />
                <Placeholder style={{ width: 80, height: 12 }} className="rounded m-0 mr-2 d-inline-block" />
                <Placeholder style={{ width: 35, height: 12 }} className="rounded m-0 mr-2 d-inline-block" />
                <Placeholder style={{ width: 50, height: 12 }} className="rounded m-0 mr-2 d-inline-block" />
                <Placeholder style={{ width: 90, height: 12 }} className="rounded m-0 mr-2 d-inline-block" />
            </>}


            {!loading && <>

                <Header
                    as="h4"
                    content={<>
                        {row.author_data?.pin && `${row.author_data.pin}${' '}`}
                        {row.author_data?.fio || "ЦРМ"}
                    </>}
                    className="text-center text-light mb-3"
                    subheader={<div className="sub header text-light opacity-70">{moment(row.created_at).format("DD.MM.YYYY в HH:mm")}</div>}
                />

                <p style={{ textAlign: "justify" }}>{row.notification}</p>
            </>}

        </div>}
        size="mini"
        closeIcon
    />
}

export default AlertModal;
