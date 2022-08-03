import React, { useEffect, useState } from "react";
import { Button, Dimmer, Form, Header, Loader, Modal } from "semantic-ui-react";
import { axios } from "../../../../utils";

const CommentIp = props => {

    const { ip, setRows } = props;

    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [save, setSave] = useState(false);

    useEffect(() => {

        setLoading(true);

        axios.post('dev/block/commentIp', { ip })
            .then(({ data }) => setComment(data.comment || ""))
            .catch(e => setError(axios.getError(e)))
            .then(() => setLoading(false));

    }, []);

    useEffect(() => {

        if (save) {
            axios.post('dev/block/setCommentIp', { ip, comment })
                .then(({ data }) => {
                    setRows(pred => {
                        let rows = [...pred];
                        rows.forEach((row, i) => {
                            if (row.ip === data.ip) {
                                rows[i].comment = data.comment;
                            }
                        });
                        return rows;
                    });
                    props.close();
                })
                .catch(e => {
                    setError(axios.getError(e));
                    axios.toast(axios.getError(e));
                    setSave(false);
                });
        }

    }, [save]);

    return <Modal
        open
        size="mini"
        onClose={props.close}
        closeIcon
        closeOnDimmerClick={false}
        closeOnEscape={false}
        content={<div className="content">

            <Header content="Комментарий" subheader={ip} />

            <Form className="position-relative">

                <Form.TextArea
                    rows={5}
                    value={comment}
                    onChange={(e, { value }) => setComment(value)}
                    error={Boolean(error)}
                    placeholder="Введите комментарий"
                    disabled={save}
                />

                <Dimmer active={loading} inverted>
                    <Loader />
                </Dimmer>

            </Form>

            <Button
                content="Сохранить"
                className="mt-2"
                color={Boolean(error) ? "red" : "green"}
                icon="save"
                labelPosition="right"
                fluid
                disabled={save || loading}
                loading={save}
                onClick={() => setSave(true)}
            />
        </div>}
    />

}

export default CommentIp;