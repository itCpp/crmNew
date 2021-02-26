import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

export default function TabButton(props) {

    const row = props.row;

    let name = row.compain_id;

    if (row.name)
        name = row.name;

    const phones = row.phones.length
        ? row.phones.map(phone => <small className="mx-1" key={phone.id}>{phone.phone}</small>)
        : null

    return <Button.Group size="mini" fluid className="mb-1" style={{ maxWidth: "100%" }}>

        <Button
            animated={false}
            className="px-2"
            onClick={() => {
                props.setActive(row.id);
                props.setActiveUpdate(true);
            }}
            active={props.active === row.id}
        >
            <div style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{name}</div>
            <div className="mt-1">
                {row.compain_id !== name ? <small className="mx-1">{row.compain_id}</small> : null}
                {phones}
            </div>
        </Button>

        <Button
            icon
            style={{ maxWidth: "24px" }}
            onClick={e => {
                e.currentTarget.blur();
                props.setEditTab(row.id);
            }}
            className="px-1"
        >
            <Icon name="pencil" />
        </Button>

    </Button.Group>

}