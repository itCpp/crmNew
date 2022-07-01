import React from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { Icon, Label } from "semantic-ui-react";
import MenuTabs from "./MenuTabs";
import { useDispatch, useSelector } from "react-redux";
// import { setShowMenu } from "../../../store/actions";
import { CounterRow } from "./MenuTabs";
import { counterUpdate } from "../../../store/requests/actions";

const Menu = props => {

    const { path } = props.match;
    const permits = window.requestPermits;
    const menu = React.useRef();
    const [selectMenu, setSelectMenu] = React.useState(path);
    const state = useSelector(state => state);
    const { counter } = state.requests;
    const { userData } = state.main;
    // const { showMenu } = useSelector(state => state.main);
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = React.useState(false);
    const [className, setClassName] = React.useState([
        ...["request-main-menu"],
        ...(userData.settings?.short_menu ? ["short-menu"] : []),
    ]);

    // const hide = () => {
    //     props.setShowMenu(false);
    // }

    const hide = React.useCallback(() => setShowMenu(false), [showMenu]);
    const show = React.useCallback(() => setShowMenu(true), [showMenu]);

    const updateCounter = React.useCallback((data) => {

        if (typeof counter[data?.type] != "object") return;

        const count = counter[data.type];

        if (data?.hide === true) {
            dispatch(counterUpdate({
                ...counter,
                [data.type]: {
                    ...count,
                    count: 0,
                }
            }));
        } else if (data?.hideNew === true) {
            dispatch(counterUpdate({
                ...counter,
                [data.type]: {
                    ...count,
                    update: false,
                }
            }));
        }
    }, [counter]);

    React.useEffect(() => {

        const setShowMenuBtn = document.getElementById('set-show-menu-btn');
        setShowMenuBtn && setShowMenuBtn.addEventListener('click', show);

        return () => {
            hide();
            document.body.removeEventListener('click', hide);
            setShowMenuBtn && setShowMenuBtn.removeEventListener('click', show);
        }
    }, []);

    React.useEffect(() => {

        setSelectMenu(path);

        return () => {
            document.body.removeEventListener('click', hide);
        }
    }, [path]);

    React.useEffect(() => {

        if (showMenu && className.indexOf('slider-menu-show') < 0) {
            setClassName([...className, "slider-menu-show"]);
            setTimeout(() => {
                document.body.addEventListener('click', hide);
            }, 300);
        } else if (!showMenu && className.indexOf('slider-menu-show') >= 0) {
            setClassName([
                ...["request-main-menu"],
                ...(userData.settings?.short_menu ? ["short-menu"] : []),
            ]);
        }

        return () => {
            document.body.removeEventListener('click', hide);
        }

    }, [showMenu]);

    React.useEffect(() => {
        setClassName(p => {

            const classList = [...p];
            let short_menu = classList.indexOf('short-menu');

            if (Boolean(userData.settings?.short_menu) && short_menu < 0) {
                classList.push('short-menu');
            } else if (!Boolean(userData.settings?.short_menu) && short_menu > 0) {
                classList.splice(short_menu, 1);
                showMenu && setShowMenu(false);
            }

            return classList;
        });
    }, [userData.settings?.short_menu]);

    return <div className={className.join(" ")} style={{ zIndex: 499 }} ref={menu}>

        <div className="nav-bar">

            {permits.requests_access && <MenuTabs
                selectMenu={selectMenu}
                push={props.history.push}
                replace={props.history.replace}
                shortMenu={Boolean(userData.settings?.short_menu)}
            />}

            <Link to="/chat" className={`menu-list-row title ${selectMenu === "/chat" ? 'tab-list-active' : ''}`} title="Служебный чат">
                <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                    <span>
                        <Icon name="comments" />
                        <span className="title-point">Служебный чат</span>
                    </span>
                    <CounterRow count={counter?.chat?.count || null} />
                    {Boolean(counter?.chat?.count) && <Label
                        circular
                        color="orange"
                        size="mini"
                        empty
                        className="update-info-buble"
                    />}
                </div>
            </Link>

            {permits.requests_access && <Link to="/counter" className={`menu-list-row title ${selectMenu === "/counter" ? 'tab-list-active' : ''}`} title="Счётчик">
                <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                    <span>
                        <Icon name="line graph" />
                        <span className="title-point">Счётчик</span>
                    </span>
                </div>
            </Link>}

            {permits.rating_access && <Link to="/pins" className={`menu-list-row title ${selectMenu === "/pins" ? 'tab-list-active' : ''}`} title="Операторы">
                <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                    <span>
                        <Icon name="user circle" />
                        <span className="title-point">Операторы</span>
                    </span>
                </div>
            </Link>}

            {permits.rating_access && <Link to="/rating" className={`menu-list-row title ${selectMenu === "/rating" ? 'tab-list-active' : ''}`} title="Рейтинг">
                <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                    <span>
                        <Icon name="chart bar" />
                        <span className="title-point">Рейтинг</span>
                    </span>
                </div>
            </Link>}

            {permits.rating_access && <Link to="/charts" className={`menu-list-row title ${selectMenu === "/charts" ? 'tab-list-active' : ''}`} title="Графики">
                <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                    <span>
                        <Icon name="chart area" />
                        <span className="title-point">Графики</span>
                    </span>
                </div>
            </Link>}

            {permits.calls_log_access && <Link to="/callslog" className={`menu-list-row title ${selectMenu === "/callslog" ? 'tab-list-active' : ''}`} title="Журнал вызовов">
                <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                    <span>
                        <Icon name="volume control phone" />
                        <span className="title-point">Журнал вызовов</span>
                    </span>
                </div>
            </Link>}

            <Link to="/mytests" className={`menu-list-row title ${selectMenu === "/mytests" ? 'tab-list-active' : ''}`} title="Мои тестирования">
                <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                    <span>
                        <Icon name="clipboard check" />
                        <span className="title-point">Мои тестирования</span>
                    </span>
                    <CounterRow count={counter?.tests || null} update={true} />
                    {Boolean(counter?.tests) && <Label
                        circular
                        color="orange"
                        size="mini"
                        empty
                        className="update-info-buble"
                    />}
                </div>
            </Link>

            {permits.queues_access && <Link to="/queues" className={`menu-list-row title ${selectMenu === "/queues" ? 'tab-list-active' : ''}`} title="Очереди" onClick={() => updateCounter({ type: "queue", hideNew: true })}>
                <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                    <span>
                        <Icon name="random" />
                        <span className="title-point">Очереди</span>
                    </span>
                    <CounterRow
                        count={counter?.queue?.count || null}
                        update={counter?.queue?.update || null}
                    />
                    {Boolean(counter?.queue?.update) && <Label
                        circular
                        color="orange"
                        size="mini"
                        empty
                        className="update-info-buble"
                    />}
                </div>
            </Link>}

            {permits.sms_access && <Link
                to="/sms"
                className={`menu-list-row title ${selectMenu === "/sms" ? 'tab-list-active' : ''}`}
                onClick={() => updateCounter({ type: "sms", hide: true })}
                title="СМС сообщения"
            >
                <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                    <span>
                        <Icon name="mail" />
                        <span className="title-point">СМС сообщения</span>
                    </span>
                    <CounterRow count={counter?.sms?.count || null} />
                    {Boolean(counter?.sms?.count) && <Label
                        circular
                        color="orange"
                        size="mini"
                        empty
                        className="update-info-buble"
                    />}
                </div>
            </Link>}

            {permits.second_calls_access && <Link
                to="/secondcalls"
                className={`menu-list-row title ${selectMenu === "/secondcalls" ? 'tab-list-active' : ''}`}
                onClick={() => updateCounter({ type: "secondcalls", hideNew: true })}
                title="Вторичные звонки"
            >
                <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                    <span>
                        <Icon name="call" />
                        <span className="title-point">Вторичные звонки</span>
                    </span>
                    <CounterRow
                        count={counter?.secondcalls?.count || null}
                        update={counter?.secondcalls?.update || null}
                    />
                    {Boolean(counter?.secondcalls?.update) && <Label
                        circular
                        color="orange"
                        size="mini"
                        empty
                        className="update-info-buble"
                    />}
                </div>
            </Link>}

            {permits.clients_agreements_access && <Link to="/agreements" className={`menu-list-row title ${selectMenu === "/agreements" ? 'tab-list-active' : ''}`} title="Клиенты с договором">
                <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                    <span>
                        <Icon name="file text" />
                        <span className="title-point">Клиенты с договором</span>
                    </span>
                </div>
            </Link>}

            {/* {permits.clients_consultation_access && <Link to="/consultations" className={`menu-list-row title ${selectMenu === "/consultations" ? 'tab-list-active' : ''}`} title="Клиенты с БК">
                <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                    <span>
                        <Icon name="talk" />
                        <span className="title-point">Клиенты с БК</span>
                    </span>
                </div>
            </Link>} */}

            {permits.user_fines_access && <Link to="/fines" className={`menu-list-row title ${selectMenu === "/fines" ? 'tab-list-active' : ''}`} title="Штрафы">
                <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                    <span>
                        <Icon name="ruble" />
                        <span className="title-point">Штрафы</span>
                    </span>
                </div>
            </Link>}

            <Link to="/phoneboock" className={`menu-list-row title ${selectMenu === "/phoneboock" ? 'tab-list-active' : ''}`} title="Телефоннная книга">
                <div className="menu-list-point w-100 d-flex align-items-center justify-content-between">
                    <span>
                        <Icon name="address book" />
                        <span className="title-point">Телефоннная книга</span>
                    </span>
                </div>
            </Link>

        </div>

    </div>

}

export default withRouter(Menu);