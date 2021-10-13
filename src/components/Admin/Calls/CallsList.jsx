import React from "react";
import moment from "moment";
import { Icon, Transition, List, Loader } from "semantic-ui-react";

const CallsList = props => {

    const { calls } = props;
    const { setExtension, setSip } = props;
    const { retries, retry, setRetry } = props;

    return <Transition.Group
        as={List}
        duration={200}
        animation="fade right"
        divided
        verticalAlign="middle"
    >
        {calls.map(call => <List.Item key={call.id}>
            <div className="d-flex calls-log">

                <div>#{call.id}</div>

                <div>{moment(call.created_at).format("DD.MM.YYYY HH:mm:ss")}</div>

                <div>{call.phone}</div>

                <div className={`${call.source === null ? 'text-danger' : ''}`}>
                    <span>{call.sip}</span>
                    {' '}
                    {call.source === null &&
                        <Icon
                            name="plus square"
                            className="button-icon"
                            title="Создать слушатель"
                            onClick={() => {
                                setSip(call.sip);
                                setExtension(true);
                            }}
                            color="red"
                        />
                    }
                    {call.source !== null && call?.source?.on_work === 0 &&
                        <Icon
                            name="power off"
                            className="button-icon"
                            title="Включить слушатель"
                            onClick={() => {
                                setExtension(call.source.id);
                            }}
                            color="red"
                        />
                    }
                    {call.source !== null && call?.source?.on_work === 1 &&
                        <Icon
                            name="pencil"
                            className="button-icon"
                            title="Редактировать слушатель"
                            onClick={() => {
                                setExtension(call.source.id);
                            }}
                        />
                    }
                </div>

                {call.added &&
                    <div><Icon name="check" color="green" title="Добавлено в заявку" />
                        {moment(call.added).format("DD.MM.YYYY HH:mm:ss")}
                    </div>
                }

                {call.failed &&
                    <div><Icon name="ban" color="red" title="Проигнорировано" />
                        {moment(call.failed).format("DD.MM.YYYY HH:mm:ss")}
                    </div>
                }

                {!call.failed && !call.added &&
                    <div className="text-danger">Ошибка обработки</div>
                }

                {(call.failed || (!call.failed && !call.added)) && <div className="position-relative">
                    <Icon
                        name="redo"
                        className="button-icon m-0"
                        title="Повторить обработку"
                        onClick={() => !retry && setRetry(call.id)}
                    />
                    {retries[`load${call.id}`] === true && <div className="loader-cell"><Loader active size="tiny" /></div>}
                </div>}

            </div>
        </List.Item>)}
    </Transition.Group>
}

export default CallsList;