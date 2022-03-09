import AdminContentSegment from "../../UI/AdminContentSegment";
import { Icon, Pagination } from "semantic-ui-react";

export const PagesPagination = ({ loading, page, pages, getRows }) => <AdminContentSegment className="text-center">
    <Pagination
        activePage={page || 1}
        totalPages={pages}
        disabled={loading}
        pointing
        secondary
        // ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
        firstItem={{ content: <Icon name='angle double left' />, icon: true }}
        lastItem={{ content: <Icon name='angle double right' />, icon: true }}
        prevItem={{ content: <Icon name='angle left' />, icon: true }}
        nextItem={{ content: <Icon name='angle right' />, icon: true }}
        onPageChange={(e, { activePage }) => typeof getRows == "function" ? getRows({ page: activePage }) : null}
    />
</AdminContentSegment>

export default PagesPagination;