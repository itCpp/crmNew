import React from "react";
import { Form, Grid, Message, Button } from "semantic-ui-react";
import TabFormSqlQuery from "./../Form/TabFormSqlQuery";
import TabSql from "./TabSql";

export default function TabQuerySettings(props) {

    const { row, setFormdata } = props;

    /**
     * Добавление строки выражения запроса
     */
    const addQueryRow = () => {

        let data = row.where_settings ? [...row.where_settings] : [];
        data.push({});

        setFormdata(null, { name: "where_settings", value: data });
    }

    /**
     * Удаление строки условия запроса
     * @param {number} key Ключ массива условий
     */
    const removeQueryRow = key => {

        let data = row.where_settings ? [...row.where_settings] : [];

        if (data[key])
            data.splice(key, 1);

        setFormdata(null, { name: "where_settings", value: data });
    }

    /**
     * Изменение данных одной строки условия запроса
     * @param {object} query Измененные данные
     * @param {number} key Ключ массива условий
     */
    const queryEdit = (query, key) => {

        let data = [...row.where_settings];
        data[key] = query;

        setFormdata(null, { name: "where_settings", value: data });
    }

    return <div className="admin-content-segment w-100">

        <div className="divider-header">
            <h3>Настройки запроса выборки</h3>
            <div>
                <TabSql
                    id={row.id}
                    orderBy={row.where_settings}
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

            <div>Сформируйте необходимый запрос для вывода заявок по данной вкладке. Все необходимые условия будут добавлены автоматически в соответствии с открытыми разрешениями сотрудника. Условия по правам также можно настроить в блоке настроек прав на текущей странице.</div>

            <Form>

                {row.where_settings && row.where_settings.length === 0 &&
                    <Message
                        info
                        size="tiny"
                        className="mt-3"
                        content="Добавьте условия запроса"
                    />
                }

                {row.where_settings && row.where_settings.length > 0 &&
                    row.where_settings.map((query, i) => <TabFormSqlQuery
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
                            where={row.where_settings}
                            fluid={true}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <Button
                            fluid
                            content="Добавить выражение"
                            color="green"
                            basic
                            icon="plus"
                            labelPosition="right"
                            onClick={addQueryRow}
                            disabled={props.loading}
                        />
                    </Grid.Column>
                </Grid>

            </Form>

        </div>

    </div>

}