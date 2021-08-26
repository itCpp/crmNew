import { withRouter } from "react-router";

import Roles from './Developer/Roles';
import Permits from './Developer/Permits/Permits';

function AdminContent(props) {

    const { permits } = props;
    const page = props.match?.params?.page || "main";

    let body = <div className="text-center">
        <h1>Админпанель</h1>
    </div>

    if (page == "roles" && permits.dev_roles)
        body = <Roles />
    else if (page == "permits" && permits.dev_permits)
        body = <Permits />

    return <div className="admin-content-body">
        {body}
    </div>

}

export default withRouter(AdminContent);