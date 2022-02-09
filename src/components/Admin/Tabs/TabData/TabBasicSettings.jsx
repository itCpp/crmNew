import { Form } from "semantic-ui-react";

export default function TabBasicSettings(props) {

    const { row, setFormdata } = props;
    const { loading, error, errors } = props;

    return <div className="admin-content-segment w-100">

        <div className="divider-header">
            <h3>Основные настройки</h3>
        </div>

        <div className="position-relative mb-2">

            <Form>

                <Form.Input
                    placeholder="Укажите наименование вкладки..."
                    label="Наименование вкладки"
                    name="name"
                    value={row.name || ""}
                    onChange={setFormdata}
                    disabled={error ? true : false || loading}
                    error={errors.name ? true : false}
                    required
                />

                <Form.Input
                    placeholder="Укажите заголовок вкладки..."
                    label="Заголовок при наведении на вкладку"
                    name="name_title"
                    value={row.name_title || ""}
                    onChange={setFormdata}
                    disabled={error ? true : false || loading}
                    error={errors.name_title ? true : false}
                />

            </Form>

        </div>

    </div>

}