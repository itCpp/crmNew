import React from "react";
import axios from "./../../../utils/axios-header";
import { Loader, Message, List, Label, Icon, Button } from "semantic-ui-react";
import ExtensionModal from "./ExtensionModal";

const Extensions = props => {

    const [load, setLoad] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [extensions, setExtensions] = React.useState([]);
    const [extension, setExtension] = React.useState(null);

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
                        <div title="Номер телефона источника"><Icon name="fork" />{row.phone}</div>
                        <div style={{ textAlign: "center", minWidth: 100 }}>
                            <Label title="Количество добавленных заявок">{row.added}</Label>
                        </div>
                        <div>
                            <Button
                                basic
                                size="tiny"
                                circular
                                icon="pencil"
                                title="Изменить"
                                onClick={() => setExtension(row.id)}
                            />
                        </div>
                    </div>
                </List.Item>)}
            </List>
        }

        {extension &&
            <ExtensionModal
                setOpen={setExtension}
                id={extension}
                setExtensions={setExtensions}
            />
        }

    </div>

}

export default Extensions;