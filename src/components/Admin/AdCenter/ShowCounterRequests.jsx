import React from 'react';
import axios from './../../../utils/axios'
import { connect } from 'react-redux'

import { Button, Modal, Icon, Placeholder } from 'semantic-ui-react';

function ShowCounterRequests(props) {

    const [show, setShow] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {

        if (show) {

            setRows([]);
            setError(false);

            axios.post('admin/getCountRequests', {
                site: props.site,
                start: props.dateStart,
                stop: props.dateStop
            }).then(({ data }) => {
                setRows(data.counts);
            }).catch(error => {
                setError(axios.getError(error));
            });

        }

    }, [show]);

    const content = error
        ? <div className="text-danger my-3">{error}</div>
        : rows.length
            ? rows.map((row, i) => <div key={i} className="counter-row">
                <div className="counter-row-title">
                    {row.icon ? <Icon name={row.icon} /> : null}
                    <span>{row.title}</span>
                </div>
                <div>
                    <Icon name="chat" />
                    <b>{row.text}</b>
                </div>
                <div>
                    <Icon name="call" />
                    <b>{row.calls}</b>
                </div>
                <div>
                    <b>{row.all}</b>
                </div>
            </div>)
            : <Placeholder fluid>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder>

    return <div className="mb-2">

        <Modal
            onClose={() => setShow(false)}
            onOpen={() => setShow(true)}
            open={show}
            trigger={<Button
                content="Статистика"
                color="olive"
                fluid size="mini"
                onClick={() => setShow(true)}
            />}
            closeIcon
            size="tiny"
            centered={false}
        >
            <Modal.Header>Счетчик заявок</Modal.Header>

            <Modal.Content className="position-relative">
                {content}
            </Modal.Content>

        </Modal>

    </div>

}

const mapStateToProps = state => ({
    dateStart: state.adCenter.dateStart,
    dateStop: state.adCenter.dateStop,
});

export default connect(mapStateToProps)(ShowCounterRequests);