import React from 'react';
import axios from './../../../../utils/axios-header';
import { Button, Header, Image, Modal } from 'semantic-ui-react';

function ChecksModal(props) {

    const show = props.show;
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [formdata, setFormData] = React.useState({});

    React.useEffect(() => {

        if (show === true) {
            setFormData({});
            setLoading(false);
        }
        else if (show) {

            setLoading(true);

            axios.post('/gates/getChecksRow', { show }).then(({ data }) => {
                setFormData(data.row);
            }).catch(error => {
                setError(axios.getError(error));
            }).then(() => {
                setLoading(false);
            });

        }

        return () => {
            setFormData({});
            setLoading(false);
        }

    }, [show]);

    return (
        <Modal
            onClose={() => props.setShow(null)}
            open={show ? true : false}
        >

            <Modal.Header>{show === true ? "Новая настройка" : "Изменение настройки"}</Modal.Header>

            <Modal.Content image scrolling>
                <Image size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' wrapped />
                <Modal.Description>
                    <Header>Default Profile Image</Header>
                    <p>
                        We've found the following gravatar image associated with your e-mail
                        address.
                    </p>
                    <p>Is it okay to use this photo?</p>
                </Modal.Description>
            </Modal.Content>
            
            <Modal.Actions>
                <Button
                    color="black"
                    onClick={() => props.setShow(null)}
                    content="Отмена"
                />
                <Button
                    content="Yep, that's me"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => props.setShow(null)}
                    positive
                />
            </Modal.Actions>
        </Modal>
    );

}

export default ChecksModal;