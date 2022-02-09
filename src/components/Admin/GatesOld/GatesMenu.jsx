
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { setContentGates } from './../../../store/gates/actions';

import { NavLink } from 'react-router-dom';

function GatesMenu(props) {

    props.setContentGates(props.match.params.type || "gates");

    return <div>

        <NavLink
            to="/gates"
            exact
            className="gates-menu-point"
            onClick={() => props.setContentGates("gates")}
        >
            <span>Шлюзы</span>
        </NavLink>

        <NavLink
            to="/gates/log"
            className="gates-menu-point"
            onClick={() => props.setContentGates("log")}
        >
            <span>Журнал звонков</span>
        </NavLink>

        <NavLink
            to="/gates/check"
            className="gates-menu-point"
            onClick={() => props.setContentGates("check")}
        >
            <span>Проверка звоков</span>
        </NavLink>

    </div>

}

const mapStateToProps = state => ({
    content: state.gates.page,
})

const mapDispatchToProps = {
    setContentGates
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GatesMenu));