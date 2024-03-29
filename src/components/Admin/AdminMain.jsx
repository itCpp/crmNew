import React from "react";
import axios from "../../utils/axios-header";
import { connect } from "react-redux";
import { Loader } from "semantic-ui-react";
import AdminMenu from "./AdminMenu";
import AdminContent from "./AdminContent";
import NotFound from "../NotFound";
import "./admin.css";

function Admin(props) {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [response, setResponse] = React.useState({});

    React.useEffect(() => {

        axios.post('admin/start').then(({ data }) => {
            setResponse(data);
            setError(false);

            window.Echo && window.Echo.private(`App.Admin`)
                .listen('Users\\ChangeUserWorkTime', console.log);

            window.permits = { ...window.permits, ...data.permits }

        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

        return () => {
            window.Echo && window.Echo.leave(`App.Admin`);
        }

    }, []);

    if (loading)
        return <Loader inline active className="mx-auto mt-4" />

    if (error) {
        return <NotFound />
        // return <div className="text-danger text-center mt-4"><strong>{error}</strong></div>
    }

    return <div className="admin-content">
        <AdminMenu permits={response.permits} />
        <AdminContent {...props} {...response} />
    </div>;

}

const mapStateToProps = state => ({
    user: state.main.userData,
})

export default connect(mapStateToProps)(Admin);