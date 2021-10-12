import React from 'react';
import axios from './../../utils/axios-header';
import { connect } from 'react-redux';

import { Loader } from 'semantic-ui-react';

import './admin.css';
import AdminMenu from './AdminMenu';
import AdminContent from './AdminContent';

function Admin(props) {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [adminPermits, setAdminPermits] = React.useState({});

    React.useEffect(() => {

        axios.post('admin/start').then(({ data }) => {
            setAdminPermits(data.permits);
            setError(false);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    if (loading)
        return <Loader inline active className="mx-auto mt-4" />

    if (error)
        return <div className="text-danger text-center mt-4"><strong>{error}</strong></div>

    return <div className="admin-content">
        <AdminMenu permits={adminPermits} />
        <AdminContent {...props} permits={adminPermits} />
    </div>;

}

const mapStateToProps = state => ({
    user: state.main.userData,
})

export default connect(mapStateToProps)(Admin);