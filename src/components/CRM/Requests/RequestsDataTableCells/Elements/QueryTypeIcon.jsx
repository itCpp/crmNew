import { memo } from "react";
import { Icon } from "semantic-ui-react";

/**
 * Вывод иконки типа заявки рядом с её номером
 * Иконка в виде текстового комментария или трубки
 * 
 * @return {memo}
 */
const QueryTypeIcon = memo(({ query_type }) => {

    let icon = null;

    if (query_type === "call")
        icon = <Icon name="call square" title="Звонок" />
    else if (query_type === "text")
        icon = <Icon name="envelope square" title="Тектовая заявка" />

    return icon;

});

export default QueryTypeIcon;