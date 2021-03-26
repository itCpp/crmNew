import React from 'react';
import axios from './../../../utils/axios'
import { connect } from 'react-redux'

import { Button, Modal, Header, Icon, Placeholder, Popup } from 'semantic-ui-react';

import ShowCounterCosts from './ShowCounterCosts'

function ShowCounterRequests(props) {

    const [show, setShow] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const [costs, setCosts] = React.useState(false);
    const [title, setTitle] = React.useState("Статистика");

    React.useEffect(() => {

        if (show) {

            setRows([]);
            setError(false);
            setCosts(false);
            setTitle("Статистика");

            axios.post('admin/getCountRequests', {
                site: props.site,
                start: props.dateStart,
                stop: props.dateStop
            }).then(({ data }) => {

                setRows(data.counts);
                setCosts(data.costs);

                let modalTitle = "Статистика ";
                modalTitle += data.period || data.date;
                setTitle(modalTitle);

            }).catch(error => {
                setError(axios.getError(error));
            });

        }

    }, [show]);

    const content = error
        ? <div className="text-danger my-3">{error}</div>
        : rows.length
            ? <div>
                <h4 className="mb-2"><b>Заявки</b></h4>
                {rows.map((row, i) => <div key={i} className="counter-row">
                    <div className="counter-row-title">
                        {row.icon ? <Icon name={row.icon} color={row.color} /> : null}
                        <span>{row.title}</span>
                    </div>
                    <Popup
                        size="mini"
                        content="Текстовые заявки"
                        position="top center"
                        trigger={<div>
                            <Icon name="chat" />
                            <b>{row.text}</b>
                        </div>}
                    />
                    <Popup
                        size="mini"
                        content="Звонки"
                        position="top center"
                        trigger={<div>
                            <Icon name="call" />
                            <b>{row.calls}</b>
                        </div>}
                    />
                    <Popup
                        size="mini"
                        content="Сумма заявок"
                        position="top center"
                        trigger={<div>
                            <b>{row.all}</b>
                        </div>}
                    />
                    <Popup
                        size="mini"
                        content="Посещений сайта"
                        position="top center"
                        trigger={<div>
                            <Icon name="sign-in" />
                            <b>{row.visites}</b>
                        </div>}
                    />
                </div>)}
            </div>
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
            <Header icon="chart bar outline" content={title} />

            <Modal.Content className="position-relative">
                {content}
                <ShowCounterCosts costs={costs} />
            </Modal.Content>

        </Modal>

    </div>

}

const mapStateToProps = state => ({
    dateStart: state.adCenter.dateStart,
    dateStop: state.adCenter.dateStop,
});

export default connect(mapStateToProps)(ShowCounterRequests);