import { useEffect, useState } from "react";
import { Modal, Icon, Header, Form, Message } from "semantic-ui-react";
import { axios } from "../../../utils";
import FlagIp from "./Statistic/IP/FlagIp";

const AddBlockAdId = props => {

    const { open, setOpen, row, updateRow } = props;
    const [loading, setLoading] = useState(false);
    const [loadingError, setLoadingError] = useState(null);

    const [formdata, setFormdata] = useState({});
    const [formdataControl, setFormdataControl] = useState({});

    const [save, setSave] = useState(false);
    const [saveError, setSaveError] = useState(null);

    useEffect(() => {

        if (open) {

            setLoading(true);
            setLoadingError(null);
            setSaveError(null);
            setFormdata({});
            setFormdataControl({});

            axios.post('dev/block/ip', { ip: row.ip }).then(({ data }) => {
                setFormdata({ ...data.row, manual_client_id: false });
                setFormdataControl({ ...data.row, manual_client_id: false });
                setLoadingError(null);
            }).catch(e => {
                setLoadingError(axios.getError(e));
            }).then(() => {
                setLoading(false);
            });
        }

    }, [row]);

    useEffect(() => {

        if (save) {
            axios.post('dev/block/ip/save', formdata).then(({ data }) => {
                updateRow({
                    ip: data.row.ip,
                    block_client_id: data.row.checked
                });
                setOpen(false);
            }).catch(e => {
                setSaveError(axios.getError(e));
            }).then(() => {
                setSave(false);
            });
        }

    }, [save]);

    return <Modal
        open={open}
        centered={false}
        closeIcon={<Icon
            name="close"
            disabled={save}
            onClick={() => save ? null : setOpen(false)}
        />}
        closeOnDimmerClick={false}
        closeOnDocumentClick={false}
        size="tiny"
        header="Блокировка по ID"
        content={<div className="content position-relative">

            <div className="d-flex align-items-center mb-3">
                {row.info && !row.info_check &&
                    <FlagIp
                        name={row.info.country_code}
                        title={`${row.info.region_name}, ${row.info.city}`}
                        style={{ transform: "scale(1.5)" }}
                    />
                }
                <Header
                    content={row.ip}
                    subheader={row.host}
                    className="flex-grow-1 mt-0 mb-0 ml-3"
                />
            </div>

            <Form loading={loading || save} error={loadingError ? true : false || saveError ? true : false}>

                <Form.Field>
                    <Form.Checkbox
                        label="Включить блокировку по ID"
                        toggle
                        disabled={loadingError ? true : false}
                        checked={formdata.checked ? true : false}
                        onChange={(e, { checked }) => setFormdata(p => ({ ...p, checked }))}
                    />
                </Form.Field>

                <Form.Field>
                    <Form.Checkbox
                        label="Указать идентификатор клиента вручную"
                        toggle
                        disabled={loadingError ? true : false}
                        checked={formdata.manual_client_id ? true : false}
                        onChange={(e, { checked }) => setFormdata(p => ({ ...p, manual_client_id: checked }))}
                    />
                </Form.Field>

                <Form.Field required={formdata.manual_client_id ? true : false}>
                    <label>Идентификатор клиента</label>
                    <Form.Input
                        name="client_id"
                        placeholder="Укажите идентификатор"
                        disabled={loadingError ? true : false || formdata.manual_client_id ? false : true}
                        value={formdata.client_id || ""}
                        onChange={(e, { value }) => setFormdata(p => ({ ...p, client_id: value !== "" ? value : null }))}
                        error={saveError ? true : false}
                    />
                </Form.Field>

                <Message error content={loadingError || saveError} size="mini" className="mt-4" />

            </Form>

        </div>}
        actions={[
            {
                key: 'cansel',
                content: 'Отмена',
                onClick: () => setOpen(false),
                disabled: save,
            },
            {
                key: 'done',
                content: 'Сохранить',
                positive: true,
                onClick: () => setSave(true),
                disabled: (loadingError ? true : false) || loading || save || JSON.stringify(formdata) === JSON.stringify(formdataControl),
                icon: "save",
                labelPosition: "right",
            }
        ]}
    />

}

export default AddBlockAdId