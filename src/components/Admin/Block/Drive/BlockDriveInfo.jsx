import AdminContentSegment from "../../UI/AdminContentSegment";
import { Icon } from "semantic-ui-react";

const BlockDriveInfo = () => {

    return <AdminContentSegment>Пояснение кнопки блокировки: <Icon name="ban" color="green" /> адрес не заблокирован нигде, <Icon name="minus square" color="orange" /> адрес заблокирован на некоторых сайтах, на которых имеется статистика и учет блокировки, <Icon name="minus square" color="red" /> адрес заблокирован на всех сайтах</AdminContentSegment>

}

export default BlockDriveInfo;