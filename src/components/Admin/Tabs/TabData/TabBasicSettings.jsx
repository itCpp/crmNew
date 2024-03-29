import React from "react";
import { Icon, Form, Dropdown } from "semantic-ui-react";

export default function TabBasicSettings(props) {

    const { row, statuses, setFormdata } = props;
    const { loading, error, errors } = props;

    const [searchQuery, setSearchQuery] = React.useState("");

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
                    onChange={(e, { name, value }) => setFormdata(e, { name, value: value === "" ? null : value })}
                    disabled={error ? true : false || loading}
                    error={errors.name_title ? true : false}
                />

                <Form.Field>
                    <label><Icon name="check" color="green" />Статусы заявок, отображаемые во вкладке</label>
                    <Dropdown
                        fluid
                        multiple
                        name="statuses"
                        onChange={setFormdata}
                        onSearchChange={(e, { searchQuery }) => setSearchQuery(searchQuery)}
                        options={statuses.map(status => ({
                            key: status.id,
                            text: status.name,
                            value: status.id,
                        }))}
                        placeholder="Выберите статусы заявок"
                        search
                        searchQuery={searchQuery}
                        selection
                        value={row.statuses}
                        disabled={error ? true : false || loading}
                        error={errors.statuses ? true : false}
                        noResultsMessage="Ничего не найдено."
                    />
                </Form.Field>

                <Form.Field>
                    <label><Icon name="times" color="red" />Статусы заявок, скрытые для вывода во вкладке</label>
                    <Dropdown
                        fluid
                        multiple
                        name="statuses_not"
                        onChange={setFormdata}
                        onSearchChange={(e, { searchQuery }) => setSearchQuery(searchQuery)}
                        options={statuses.map(status => ({
                            key: status.id,
                            text: status.name,
                            value: status.id,
                        }))}
                        placeholder="Выберите статусы заявок"
                        search
                        searchQuery={searchQuery}
                        selection
                        value={row.statuses_not || []}
                        disabled={error ? true : false || loading}
                        error={errors.statuses_not ? true : false}
                        noResultsMessage="Ничего не найдено."
                    />
                </Form.Field>

            </Form>

        </div>

    </div>

}