import { NavLink } from 'react-router-dom'

import './header.css'

export default function Header(props) {

    return <div className="header-menu border-bottom" id="header-menu">

        <b>Админпанель</b>

        <NavLink exact to="/" className="header-menu-link">AdCenter</NavLink>
        <NavLink to="/users" className="header-menu-link">Сотрудники</NavLink>

    </div>

}