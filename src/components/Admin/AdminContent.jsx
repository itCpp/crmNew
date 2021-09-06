import { withRouter } from "react-router";

import Roles from './Developer/Roles/Roles';
import Permits from './Developer/Permits/Permits';

import Users from './Users/Users';
import Callcenters from './Callcenters/Callcenters';
import SourcesAndResources from './Sources/SourcesAndResources';

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
    else if (page == "users" && permits.admin_users)
        body = <Users />
    else if (page == "callcenters" && permits.admin_callcenters)
        body = <Callcenters />
    else if (page == "sources" && permits.admin_sources)
        body = <SourcesAndResources />

    return <div className="admin-content-body">
        {body}
    </div>

}

export default withRouter(AdminContent);