import { Icon } from 'semantic-ui-react'

export default function TabName(props) {

    let name = props.name,
        icon = null;

    if (props.name === "yandex") {
        name = "Яндекс";
        icon = <Icon name="yandex" color="red" className="mr-2" />
    }
    else if (props.name === "google") {
        name = "Google";
        icon = <Icon name="google" color="blue" className="mr-2" />
    }
    else {
        name = "Прочее";
    }

    return <div className="mb-2 text-center" style={{ fontSize: "110%" }}>
        {icon}
        <span className="fw-bolder">{name}</span>
    </div>

}