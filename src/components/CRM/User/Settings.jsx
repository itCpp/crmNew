import React from "react";
import { connect, useSelector } from "react-redux";
import { setUserData } from "../../../store/actions";
import { counterUpdate } from "../../../store/requests/actions";
import { Checkbox, Loader, Message } from "semantic-ui-react";
import { axios } from "../../../utils";
import Telegram from "./Settings/Telegram";

const Settings = props => {

    const { userData, setUserData, counterUpdate } = props;
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [settings, setSettings] = React.useState({});
    const { counter } = useSelector(store => store.requests);

    const changeHandle = React.useCallback((name, value, setLoading = null, callback = null) => {

        const load = typeof setLoading == "function";

        load && setLoading(true);

        axios.post('users/setting/set', {
            name, value
        }).then(({ data }) => {
            setUserData({
                ...userData,
                settings: {
                    ...(userData.settings || {}),
                    ...data.settings,
                },
            });

            typeof callback == "function" && callback(data);

        }).catch(e => {
            axios.toast(axios.getError(e));
        }).then(() => {
            load && setLoading(false);
        });

    }, []);

    const setCounter = React.useCallback(data => {

        counterUpdate(data.counter);

    }, [counter, counterUpdate]);

    React.useEffect(() => {
        setSettings(userData?.settings || {});
    }, [userData?.settings]);

    React.useEffect(() => {

        axios.post('check')
            .then(({ data }) => {
                setSettings(data?.user?.settings || {});
            })
            .catch(e => {
                setError(axios.getError(e));
            })
            .then(() => {
                setLoading(false);
            });

    }, []);

    return <div className="pb-3 px-2 w-100" id="settings-user-root" style={{ maxWidth: "800px" }}>

        <div className="d-flex justify-content-between align-items-center">

            <div className="page-title-box">
                <h4 className="page-title">Настройки</h4>
            </div>

        </div>

        {loading && <Loader inline="centered" active />}

        {!loading && error && <Message error content={error} />}

        {!loading && !error && <>

            <div className="block-card mb-3 settings-list">

                <CheckboxBlock
                    label="Сокращенное главное меню"
                    toggle
                    name="short_menu"
                    checked={Boolean(settings.short_menu)}
                    changeHandle={changeHandle}
                />

                <CheckboxBlock
                    label="Виджет счетчика записей"
                    toggle
                    name="counter_widjet_records"
                    checked={Boolean(settings.counter_widjet_records)}
                    changeHandle={(name, checked, setLoading) => {
                        changeHandle(name, checked, setLoading, setCounter);
                    }}
                />

            </div>

            <Telegram user={userData} setUser={setUserData} />

        </>}

    </div>
}

const CheckboxBlock = props => {

    const { changeHandle } = props;
    const { label, checked, name, toggle } = props;

    const [loading, setLoading] = React.useState(false);

    return <Checkbox
        label={label}
        toggle={toggle}
        name={name}
        checked={checked}
        onChange={(e, { name, checked }) => changeHandle(name, checked, setLoading)}
        disabled={loading}
    />

}

const mapStateToProps = state => ({
    userData: state.main.userData,
});

const mapDispatchToProps = { setUserData, counterUpdate }

export default connect(mapStateToProps, mapDispatchToProps)(Settings);