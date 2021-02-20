import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

export default function TabButton(props) {

    const row = props.row;

    let name = row.compain_id;

    if (row.name)
        name = row.name;

    return <Button.Group size="mini" fluid className="mb-1">

        <Button
            animated={false}
            className="px-1"
            onClick={() => {
                props.setActive(row.id);
                props.setActiveUpdate(true);
            }}
            active={props.active === row.id}
            content={name}
        />

        {/* <Button icon>
            <Icon name='align center' />
        </Button> */}
        
    </Button.Group>

}