import React from "react";
import axios from "./../../../../utils/axios-header";
import { Form, Message, Button, Grid } from "semantic-ui-react";
import TabFormSort from "./../Form/TabFormSort";
import TabSql from "./TabSql";

/**
 * Компонент изменения блока условий сортировки строк по выбранной вкладке
 * 
 * @param {object} props Передннаые параметры в компонент
 */
const TabSortSettings = props => {

    const { row, setFormdata } = props;

    /**
     * Добавление строки условия сортировки
     */
    const addQueryRow = () => {

        let data = row.order_by_settings ? [...row.order_by_settings] : [];
        data.push({});

        setFormdata(null, { name: "order_by_settings", value: data });
    }

    /**
     * Удаление строки условия сортировки
     * @param {number} key Ключ массива условий
     */
    const removeQueryRow = key => {

        let data = row.order_by_settings ? [...row.order_by_settings] : [];
        data.splice(key, 1);

        setFormdata(null, { name: "order_by_settings", value: data });
    }

    /**
     * Изменение данных одной строки условия сортировки
     * @param {object} query Измененные данные
     * @param {number} key Ключ массива условий
     */
    const queryEdit = (query, key) => {

        let data = [...row.order_by_settings];
        data[key] = query;

        setFormdata(null, { name: "order_by_settings", value: data });
    }

    return <div className="admin-content-segment w-100">

        <div className="divider-header">
            <h3>Условия сортировки</h3>
            <div>
                <TabSql
                    id={row.id}
                    orderBy={row.order_by_settings}
                    target={<Button
                        circular
                        size="mini"
                        color="blue"
                        icon="code"
                        basic
                        title="Проверить новый запрос"
                    />}
                />
            </div>
        </div>

        <div className="position-relative mb-2">

            <div>Сформируйте условия сортировки строк. По умолчанию сортировка определена по дате добавления заявки <code>created_at</code> в порядке убывания, т.е. новые строки будут всегда в начале таблицы.</div>

            <Form>

                {row.order_by_settings && row.order_by_settings.length === 0 &&
                    <Message
                        info
                        size="tiny"
                        className="mt-3"
                        content="Добавьте условия сортировки строк"
                    />
                }

                {row.order_by_settings && row.order_by_settings.length > 0 &&
                    row.order_by_settings.map((query, i) => <TabFormSort
                        key={i}
                        {...props}
                        formdata={row}
                        changeFormdata={setFormdata}
                        query={query}
                        queryKey={i}
                        queryEdit={queryEdit}
                        removeQueryRow={removeQueryRow}
                    />)
                }

                <Grid columns="equal">
                    <Grid.Column>
                        <TabSql
                            id={row.id}
                            orderBy={row.order_by_settings}
                            fluid={true}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <Button
                            fluid
                            content="Добавить условие"
                            color="green"
                            basic
                            icon="plus"
                            labelPosition="right"
                            onClick={addQueryRow}
                        />
                    </Grid.Column>
                </Grid>

            </Form>

        </div>

    </div>
}
export default TabSortSettings;