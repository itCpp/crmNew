import _ from "lodash";
import React from "react";
import { Form, Icon } from "semantic-ui-react";
import FormMemo from "../../../Form";

export const caseSensitiveSearch = (options, query) => {
    const re = new RegExp(_.escapeRegExp(String(query).toLowerCase()))
    return options.filter((opt) => re.test(String(opt.text).toLowerCase()))
}

const RequestEditForm = props => {

    const { loading, formdata, onChange, errors, statuses, cities, themes, adresses, permits } = props;

    const changeData = React.useCallback((...a) => {
        if (typeof onChange == "function") {
            onChange(...a);
        }
    }, []);

    return <Form className="my-form" loading={loading || false} id="request-edit-form">

        <Form.Group>
            <Form.Input
                label="ФИО клиента"
                placeholder="Укажите ФИО клиента"
                width={16}
                name="client_name"
                value={formdata?.client_name || ""}
                onChange={changeData}
                error={errors?.client_name ? true : false}
            />
        </Form.Group>

        <Form.Group>
            <FormMemo.Select
                label="Статус"
                placeholder="Укажите статус заявки"
                width={16}
                options={statuses || []}
                name="status_id"
                value={formdata?.status_id || 0}
                onChange={changeData}
                error={errors?.status_id ? true : false}
            />
        </Form.Group>

        <Form.Group>
            <Form.Field width={8}>
                <label><Icon name="world" />Город</label>
                <FormMemo.Dropdown
                    placeholder="Укажите город"
                    search={caseSensitiveSearch}
                    selection
                    options={cities || []}
                    name="region"
                    value={formdata?.region || ""}
                    onChange={changeData}
                    error={errors?.region ? true : false}
                    noResultsMessage="Город не найден"
                />
            </Form.Field>
            <Form.Field width={8}>
                <label><Icon name="book" />Тематика</label>
                <FormMemo.Dropdown
                    placeholder="Укажите тематику"
                    search={caseSensitiveSearch}
                    selection
                    options={themes || []}
                    name="theme"
                    value={formdata?.theme || ""}
                    onChange={changeData}
                    error={errors?.theme ? true : false}
                    noResultsMessage="Тематика не найдена"
                />
            </Form.Field>
        </Form.Group>

        <Form.Group>
            <Form.Field width={8}>
                <label><Icon name="map marker alternate" />Адрес</label>
                <FormMemo.Select
                    placeholder="Укажите адрес офиса"
                    options={adresses || []}
                    name="address"
                    value={formdata?.address || null}
                    onChange={changeData}
                    error={errors?.address ? true : false}
                    disabled={permits?.requests_addr_change ? false : true}
                />
            </Form.Field>
            <Form.Field width={8}>
                <label><Icon name="calendar check outline" />Дата</label>
                <Form.Input
                    placeholder="Укажите дату"
                    type="date"
                    name="event_date"
                    value={formdata?.event_date || ""}
                    onChange={changeData}
                    error={errors?.event_date ? true : false}
                />
            </Form.Field>
            <Form.Field width={8}>
                <label><Icon name="clock" />Время</label>
                <Form.Input
                    placeholder="Укажите время"
                    type="time"
                    name="event_time"
                    value={formdata?.event_time || ""}
                    onChange={changeData}
                    error={errors?.event_time ? true : false}
                />
            </Form.Field>
        </Form.Group>

        <Form.Field>
            <label><Icon name="comment outline" />Описание проблемы (отразится в карточке клиента)</label>
            <Form.TextArea
                placeholder="Опишите суть обращения"
                type="time"
                name="comment"
                rows={5}
                value={formdata?.comment || ""}
                onChange={changeData}
                error={errors?.comment ? true : false}
                style={{ resize: "none" }}
            />
        </Form.Field>

        <Form.Field>
            <label><Icon name="comment" />Комментарий юристу (видно только юристу)</label>
            <Form.TextArea
                placeholder="Комментарий для юриста перивчного приема"
                type="time"
                name="comment_urist"
                value={formdata?.comment_urist || ""}
                onChange={changeData}
                error={errors?.comment_urist ? true : false}
                style={{ resize: "none" }}
            />
        </Form.Field>

    </Form>

}

export default RequestEditForm;