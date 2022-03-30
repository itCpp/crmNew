import { withRouter } from "react-router";
import Roles from './Developer/Roles/Roles';
import Permits from './Developer/Permits/Permits';
import Dashboard from "./Dashboard";
import Users from './Users/Users';
import UsersOnline from './Users/Online';
import Callcenters from './Callcenters/Callcenters';
import SourcesAndResources from './Sources/SourcesAndResources';
import Statuses from './Statuses/Statuses';
import Tabs from './Tabs/Tabs';
import Calls from './Calls/Calls';
import ActiveSip from './Calls/Sip/Active';
import DistributionCalls from './Calls/Distributions/DistributionCalls';
import Offices from './Offices/Offices';
import Block from './Block';
import Routes from './API/Routes';
import Settings from "./Settings/Settings";
import DataBases from "./DataBases/DataBases";
import Gates from "./Gates";

function AdminContent(props) {

    const { permits } = props;
    const page = props.match?.params?.page || "main";

    let body = <Dashboard {...props} />

    if (page == "roles" && permits.dev_roles)
        body = <Roles />
    else if (page == "permits" && permits.dev_permits)
        body = <Permits />
    else if (page == "users" && permits.admin_users)
        body = <Users {...props} />
    else if (page == "online" && permits.block_dev)
        body = <UsersOnline {...props} />
    else if (page == "callcenters" && permits.admin_callcenters)
        body = <Callcenters />
    else if (page == "sources" && permits.admin_sources)
        body = <SourcesAndResources />
    else if (page == "statuses" && permits.dev_statuses)
        body = <Statuses />
    else if (page == "tabs" && permits.dev_tabs)
        body = <Tabs />
    else if (page == "calls" && permits.dev_calls)
        body = <Calls {...props} />
    else if (page == "sips" && permits.dev_calls)
        body = <ActiveSip {...props} />
    else if (page == "callsqueue" && permits.admin_callsqueue)
        body = <DistributionCalls {...props} />
    else if (page == "office" && permits.dev_offices)
        body = <Offices {...props} />
    else if (page == "block" && permits.dev_block)
        body = <Block {...props} />
    else if (page == "routes" && permits.dev_block)
        body = <Routes {...props} />
    else if (page == "settings" && permits.dev_block)
        body = <Settings {...props} />
    else if (page == "databases" && permits.dev_block)
        body = <DataBases {...props} />
    else if (page == "gates" && permits.dev_block)
        body = <Gates {...props} />

    return <div className="admin-content-body">
        {body}
    </div>

}

export default withRouter(AdminContent);