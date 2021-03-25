import React from 'react';
import axios from './../../../../utils/axios';
import { connect } from 'react-redux';

import { Button, Header, Icon, Modal, Placeholder, Message, Input } from 'semantic-ui-react';

function AddCosts(props) {

    const loading = props.loading;
    const [open, setOpen] = React.useState(false);
    const [load, setLoad] = React.useState(false);
    const [globalError, setGlobalError] = React.useState(false);

    const [maxDate, setMaxDate] = React.useState("");
    const [tab, setTab] = React.useState({});
    const [formdata, setFormData] = React.useState({});

    const [save, setSave] = React.useState(false);
    const [process, setProcess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [errorRows, setErrorRows] = React.useState([]);
    const [update, setUpdate] = React.useState(null);

    React.useEffect(() => {

        if (open) {

            setLoad(true);
            setGlobalError(false);
            setError(false);
            setErrorRows([]);

            axios.post('admin/getTabDataForAddCost', {
                id: props.activeTab,
                date: props.dateStart,
            }).then(({ data }) => {
                setGlobalError(false);
                setMaxDate(data.maxDate);
                setTab(data.tab);
                setFormData({
                    date: data.date,
                    id: props.activeTab,
                });
            }).catch(error => {
                setGlobalError(axios.getError(error));
            }).then(() => {
                setLoad(false);
            });

        }

    }, [open]);

    const onChange = e => {

        let change = {};
        for (let i in formdata)
            change[i] = formdata[i];

        change[e.target.name] = e.target.value;

        setFormData(change);

    }

    React.useEffect(() => {

        if (save) {

            setProcess(true);
            formdata.update = update;

            axios.post('admin/addCost', formdata).then(() => {
                setError(false);
                setOpen(false);
                setUpdate(null);
            }).catch(error => {
                setError(axios.getError(error));
                setErrorRows(error?.response?.data?.rows || []);
            }).then(() => {
                setProcess(false);
            });

        }

        return () => setSave(false);

    }, [save]);

    const errorRowsBody = errorRows.length
        ? errorRows.map(row => <div key={row.id} className="mt-3 d-flex align-items-center error-row-cost">
            <div className="px-2">#{row.id}</div>
            <div className="px-2 flex-grow-1">{row.summ} руб</div>
            <div className="px-2">{row.datetime}</div>
            <Button size="mini" color="green" disabled={process} onClick={() => {
                setUpdate(row.id);
                setSave(true);
            }}>Обновить сумму</Button>
        </div>)
        : null

    const body = !globalError
        ? <div>
            <div className="d-flex align-items-center">
                <div className="w-50 ad-costs-add-body">
                    <div>
                        <strong>Сайт</strong>
                        <span>{tab.site || ""}</span>
                    </div>
                    <div>
                        <strong>compain_id</strong>
                        <span>{tab.compain_id || ""}</span>
                    </div>
                    <div>
                        <Icon name={tab.type} />
                        <strong>{tab.name || ""}</strong>
                    </div>
                    {tab.phones ? <div>{tab.phones.map(phone => <div key={phone} style={{ marginRight: ".5rem" }}>{phone}</div>)}</div> : null}
                </div>
                <div className="w-50">
                    <Input
                        fluid
                        type="date"
                        name="date"
                        max={maxDate}
                        value={formdata.date || ""}
                        onChange={onChange}
                        disabled={process}
                    />
                    <Input
                        fluid
                        type="number"
                        name="summ"
                        placeholder="Сумма расхода"
                        className="mt-2"
                        value={formdata.summ || ""}
                        onChange={onChange}
                        disabled={process}
                        loading={process}
                    />
                </div>
            </div>
            {errorRowsBody}
        </div>
        : null

    return <Modal
        closeIcon={!process}
        closeOnDimmerClick={false}
        open={open}
        trigger={<div className={`counter-header-row add-coasts ${loading ? 'counter-header-row-disabled' : 'for-hover-link'}`}>
            <Icon name="dollar" style={{ marginRight: ".05rem" }} />
            <span>Внести расходы</span>
        </div>}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size="tiny"
        centered={false}
    >
        <Header icon="dollar" content="Внести расходы" />
        <Modal.Content>

            {globalError ? <Message negative className="mb-0">{globalError}</Message> : null}
            {error ? <Message negative className="mb-3" size="mini">{error}</Message> : null}

            {load ? <Placeholder fluid>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder> : body}

        </Modal.Content>

        <Modal.Actions>
            <Button color="green" size="mini" disabled={load || (globalError ? true : false) || process} onClick={() => setSave(true)}>
                <Icon name="checkmark" />
                <span>Сохранить</span>
            </Button>
        </Modal.Actions>

    </Modal>

}

const mapStateToProps = state => ({
    activeTab: state.adCenter.activeTab,
    dateStart: state.adCenter.dateStart,
});

export default connect(mapStateToProps)(AddCosts);