import { Pagination, Icon } from "semantic-ui-react";

const AgreementsPagination = props => {

    const { pages, current_page, loading } = props;
    const { getAgreementsRows } = props;

    return <Pagination
        activePage={current_page || 1}
        ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
        firstItem={{ content: <Icon name="angle double left" />, icon: true }}
        lastItem={{ content: <Icon name="angle double right" />, icon: true }}
        prevItem={{ content: <Icon name="angle left" />, icon: true }}
        nextItem={{ content: <Icon name="angle right" />, icon: true }}
        totalPages={pages || 0}
        onPageChange={(e, { activePage }) => getAgreementsRows({ page: activePage })}
        style={{ boxShadow: "none" }}
        disabled={loading}
    />

}

export default AgreementsPagination;