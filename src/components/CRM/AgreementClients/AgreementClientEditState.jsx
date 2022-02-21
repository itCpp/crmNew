import React from "react";
import { Dropdown, Form, Header, Message, Modal } from "semantic-ui-react";
import { axios } from "../../../utils";

const AgreementClientEditState = props => {

    const { open, setOpen, data, setData } = props;

    const [loading, setLoading] = React.useState(false);
    const [loadError, setLoadError] = React.useState(null);

    const [formdata, setFormdata] = React.useState({});
    const [formdataControl, setFormdataControl] = React.useState({});
    const [save, setSave] = React.useState(false);
    const [saveError, setSaveError] = React.useState(null);

    const change = JSON.stringify(formdata) !== JSON.stringify(formdataControl);

    React.useEffect(() => {

        if (open) {

            setLoading(true);

            axios.post('agreements/get', { id: data.id }).then(({ data }) => {

                loadError && setLoadError(null);

                let formdata = {
                    status: data.status,
                    comment: "",
                    id: data.id,
                }
                setFormdata({ ...formdata });
                setFormdataControl({ ...formdata });

            }).catch(e => {
                setLoadError(axios.getError(e));
            }).then(() => {
                setLoading(false);
            });
        }

    }, [open]);

    React.useEffect(() => {

        if (save) {

            axios.post('agreements/save', formdata).then(({ data }) => {

                setData(prev => {

                    let rows = [...prev.rows];

                    rows.forEach((row, i) => {
                        if (row.id === data.row.id) {
                            rows[i].color = data.row.color;
                            rows[i].collStatus = data.row.collStatus;
                            rows[i].collComments = data.row.collComments;
                        }
                    });

                    prev.rows = rows;

                    return prev;
                });

                setFormdata({});
                setFormdataControl({});
                setSaveError(null);
                setLoadError(null);
                // setOpen(null);

            }).catch(e => {
                setSaveError(axios.getError(e));
            }).then(() => {
                setSave(false);
            });
        }

    }, [save]);

    return <Modal
        open={open}
        closeIcon={<i className="close icon" onClick={() => setOpen(null)}></i>}
        centered={false}
        size="tiny"
        header="Редактирование"
        content={<div className="content">

            {data?.nomerDogovora && <Header
                content={`№${data.nomerDogovora}`}
                subheader={data.FullNameClient}
            />}

            <Form
                loading={loading || save}
                error={(loadError ? true : false) || (saveError ? true : false)}
            >

                <Form.Field required>
                    <label>Статус</label>
                    <Dropdown
                        placeholder="Выберите статус"
                        selection
                        options={[
                            { key: 0, value: 0, text: "Необработан" },
                            { key: 1, value: 1, text: "Клиент доволен" },
                            { key: 2, value: 2, text: "Отправлен на проверку" },
                            { key: 3, value: 3, text: "Негатив" },
                            { key: 4, value: 4, text: "Отказ от созвона" },
                        ]}
                        disabled={loadError ? true : false}
                        value={formdata.status}
                        onChange={(e, { value }) => setFormdata(data => ({ ...data, status: value }))}
                    />
                </Form.Field>

                <Form.Field required>
                    <label>Комментарий</label>
                    <Form.TextArea
                        placeholder="Укажите комментарий"
                        rows={6}
                        disabled={loadError ? true : false}
                        style={{ resize: "none" }}
                        value={formdata.comment || ""}
                        onChange={(e, { value }) => setFormdata(data => ({ ...data, comment: value }))}
                    />
                </Form.Field>

                <Message error content={loadError || saveError} />

            </Form>

        </div>}
        actions={[
            {
                key: 0,
                content: "Сохранить",
                color: "green",
                disabled: (loadError ? true : false) || !change || loading || save,
                icon: "save",
                labelPosition: "right",
                onClick: () => setSave(true),
            }
        ]}
    />

}

export default AgreementClientEditState;