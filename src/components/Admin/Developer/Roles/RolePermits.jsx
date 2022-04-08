import React from "react";
import { Checkbox, Loader, Modal, Placeholder, Table } from "semantic-ui-react";
import { axios } from "../../../../utils";

const RolePermits = props => {

    const { open, setOpen } = props;

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [errors, setErrors] = React.useState({});

    const [role, setRole] = React.useState({});
    const [permits, setPermits] = React.useState([]);
    const [access, setAccess] = React.useState([]);
    const [save, setSave] = React.useState(false);

    React.useEffect(() => {

        if (open) {

            setLoading(true);

            axios.post('dev/getPermits', {
                role: open,
                getPermits: true
            }).then(({ data }) => {
                setRole(data.role);
                setPermits(data.permissions);
                setAccess(data.role_permissions);
            }).catch(e => {
                axios.setError(e, setError);
            }).then(() => {
                setLoading(false);
            });
        }

    }, []);

    React.useEffect(() => {

        if (save) {

            axios.post('dev/setRolePermit', {
                role: open,
                permission: save,
            }).then(({ data }) => {

                setErrors({ ...errors, [save]: false });

                let permissions = [...access],
                    index = permissions.indexOf(data.permission);

                if (data.set && index < 0)
                    permissions.push(data.permission);
                else if (!data.set && index >= 0)
                    permissions.splice(index, 1);

                setAccess(permissions);

            }).catch(error => {
                setErrors({ ...errors, [save]: axios.getError(error) });
                axios.toast(error);
            }).then(() => {
                setSave(false);
            });

        }

    }, [save]);

    return <Modal
        open={open ? true : false}
        header="Разрешения для роли"
        centered={false}
        onClose={() => loading === false && setOpen(null)}
        closeIcon

        content={<div className="content scrolling">

            {loading && <Placeholder
                style={{
                    width: "100%",
                    maxWidth: "none",
                    margin: 0,
                }}
                children={<>
                    <div className="loading-placeholder-table" />
                    <div className="loading-placeholder-table" />
                    <div className="loading-placeholder-table" />
                    <div className="loading-placeholder-table" />
                    <div className="loading-placeholder-table" />
                    <div className="loading-placeholder-table" />
                    <div className="loading-placeholder-table" />
                    <div className="loading-placeholder-table" />
                </>}
            />}

            {!loading && !error && <Table collapsing basic="very" compact="very" className="w-100">

                <Table.Body>
                    {permits.map((row, i) => <Table.Row
                        key={i}
                        negative={errors[row.permission] ? true : false}
                        children={<>
                            <Table.Cell className="px-1 py-1"><b>{row.permission}</b></Table.Cell>
                            <Table.Cell className="px-1 py-1">{row.comment}</Table.Cell>
                            <Table.Cell className="px-1 py-1" textAlign="center">
                                <div className="position-relative">

                                    <Checkbox
                                        toggle
                                        checked={access.indexOf(row.permission) >= 0 || role.is_superadmin}
                                        name={`permission_${row.permission}`}
                                        style={{ marginTop: "4px" }}
                                        onChange={() => save === false && setSave(row.permission)}
                                        readOnly={(save ? true : false) || role.is_superadmin}
                                        disabled={(save === row.permission ? true : false) || role.is_superadmin}
                                    />

                                    {save === row.permission && <div className="d-flex justify-content-center align-items-center loading-checkbox">
                                        <Loader active inverted size="mini" />
                                    </div>}

                                </div>
                            </Table.Cell>
                        </>}
                    />)}
                </Table.Body>

            </Table>}

        </div>}
    />

}

export default RolePermits;