import React from "react";
import { List, Icon } from "semantic-ui-react";

const OfficesList = React.memo(props => {

    const { office, offices, setOffice } = props;
    const segment = React.useRef();

    // React.useEffect(() => {
    //     if (office && segment.current) {
    //         segment.current.classList.add('slide-to-right');
    //         setTimeout(() => {
    //             segment.current.classList.remove('slide-to-right');
    //             segment.current.style.display = "none";
    //         }, 200);
    //     }
    // }, [office]);

    return <div className="admin-content-segment" ref={segment}>

        {offices && offices.length === 0 && <div className="text-center my-5 opacity-50"><b>Данных нет</b></div>}

        {offices && offices.length > 0 && <List divided relaxed className="list-admin" verticalAlign="middle">

            {offices.map(row => <List.Item key={row.id} className="d-flex align-items-center">

                <List.Icon
                    name="marker"
                    color={row.active === 1 ? "green" : "grey"}
                    className={row.active === 1 ? "opacity-100" : "opacity-50"}
                />

                {row.base_id !== null && <List.Icon
                    name="sync"
                    color="green"
                    title="Синхронизирован с БАЗАми"
                    className="opacity-70"
                    size="small"
                />}

                <List.Content>
                    <List.Header as="a">{row.name}</List.Header>
                    <List.Description>{row.address}</List.Description>
                </List.Content>

                <List.Content>
                    <Icon
                        name="edit"
                        className="button-icon"
                        title="Редактировать данные"
                        onClick={() => office ? null : setOffice(row.id)}
                    />
                </List.Content>

            </List.Item>)}

        </List>}

    </div>

});

export default OfficesList;