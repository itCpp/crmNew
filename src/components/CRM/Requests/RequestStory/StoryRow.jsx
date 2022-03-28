import moment from "moment";
import { Icon } from "semantic-ui-react";

const dates = ['uplift_at', 'created_at', 'updated_at', 'event_at', 'deleted_at'];

const StoryRow = props => {

    const { row } = props;

    const className = ["px-3 py-2 rounded my-2"];
    className.push(`request-row-theme-${row.status?.theme || 0}`);

    return <div className={className.join(" ")}>

        <div className="d-flex justify-content-between mb-2">
            <div>
                {row.created == true && <Icon
                    name="plus"
                    title="Создание или подъём заявки"
                    color="green"
                />}

                {row.created_pin && <strong className="mr-1">{row.created_pin}</strong>}

                {row.deleted_at && <Icon
                    name="trash"
                    title="Заявка удалена"
                    color="red"
                />}
            </div>
            <small>{moment(row.created_at).format("DD.MM.YYYY в HH:mm")}</small>
        </div>

        <div>
            {row.row_data.map((d, i) => {

                let value = d.value;

                if (value === null) {
                    value = <i className="opacity-50">пусто</i>;
                } else if (typeof value == "object") {
                    value = value.toString();
                }

                if (d.key === "status_id" && row.status?.name) {
                    value = row.status.name;
                }

                if (dates.indexOf(d.key) >= 0 && value) {
                    value = moment(value).format('DD.MM.YYYY HH:mm');
                }

                return <small key={`d_i_${i}_${d.key}`} className={`d-inline-block mr-3 ${row.keys.indexOf(d.key) >= 0 ? 'opacity-100' : 'opacity-40'}`}>
                    <b className={`mr-1`}>{d.key}</b>
                    <span>{value}</span>
                </small>
            })}
        </div>

    </div>

}

export default StoryRow;