import { NavLink } from 'react-router-dom'

import './header.css'

import MangoBalance from './MangoBalance'

export default function Header(props) {

    console.log(window.access)

    return <div className="header-menu border-bottom" id="header-menu">

        <div className="d-flex justify-content-between align-items-center">

            <div>
                <b>Админпанель</b>

                <NavLink exact to="/" className="header-menu-link">AdCenter</NavLink>
                <NavLink to="/users" className="header-menu-link">Сотрудники</NavLink>
            </div>

            <div>

                <MangoBalance access={window.access?.admin_show_mango_balance || null} />

            </div>

        </div>


    </div>

}