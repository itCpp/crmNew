import React from "react";
import axios from "./../../../utils/axios-header";
import { Loader, Message, List, Label, Icon, Button } from "semantic-ui-react";

const Extensions = props => {

    const { setExtension } = props;
    const { extensions, setExtensions } = props;

    const [load, setLoad] = React.useState(true);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {

        axios.post('dev/getIncomingCallExtensions').then(({ data }) => {
            setExtensions(data.extensions);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoad(false);
        });

    }, []);

    return <div className="admin-content-segment" style={{ minWidth: 800 }}>

        <div className="divider-header">

            <h3>Слушатели звонков</h3>

            <div>
                <Button
                    icon="plus"
                    circular
                    basic
                    positive
                    size="mini"
                    title="Создать колл-центр"
                    onClick={() => setExtension(true)}
                />
            </div>

        </div>

        {load && !error && <div className="text-center mt-4 mb-3"><Loader active inline /></div>}
        {!load && error && <Message error content={error} />}

        {!load && !error && !extensions.length &&
            <div style={{
                opacity: 0.4,
                textAlign: "center",
                margin: "3rem auto 2rem"
            }}>
                <b>Данных нет</b>
            </div>
        }

        {!load && !error && extensions.length > 0 &&
            <List divided relaxed>
                {extensions.map(row => <List.Item key={row.id}>
                    <div className="d-flex justify-content-between align-items-center list-extensions px-2">

                        {row.on_work !== 1 && <div title="Выключен"><Icon name="power off" /></div>}

                        <List.Content className="flex-grow-1" style={{ opacity: row.on_work !== 1 ? 0.5 : 1 }}>
                            <List.Header as="strong">{row.extension}</List.Header>
                            <List.Description as="i">{row.comment}</List.Description>
                        </List.Content>

                        {row.ad_place && <div style={{ width: 20 }} className="text-center">
                            <Icon
                                name={row.ad_place}
                                disabled
                                fitted
                            />
                        </div>}

                        <div title="Номер телефона источника"><Icon name="fork" />{row.phone}</div>

                        <div style={{ textAlign: "center", minWidth: 100 }}>
                            <Label title="Количество добавленных заявок">{row.added || 0}</Label>
                        </div>

                        <div>
                            <Icon
                                name="pencil"
                                title="Редактировать"
                                fitted
                                link
                                onClick={() => setExtension(row.id)}
                            />
                        </div>

                    </div>
                </List.Item>)}
            </List>
        }

    </div>

}

export default Extensions;