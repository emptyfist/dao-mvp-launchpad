import React, { useEffect, useState } from 'react';

const MovePage = ({ isPrev = true, gotoPage }) => (
    <div className={`${isPrev ? 'prev' : 'next'}-page`} onClick={(e) => gotoPage(isPrev)}>
        <div className="vertical" />
        <div className="horizontal" />
    </div>
);

const Pagination = ({ children, setPage, curPage = 1, totals = 0, perPage = 0 }) => {
    const [pageInfo, setPageInfo] = useState({ totals, perPage, curPage: curPage, totalPage: 0 });

    useEffect(() => {
        if (totals < 1 || perPage < 1) return;

        setPageInfo({ totals, perPage, curPage, totalPage: Math.ceil(totals / perPage) });
    }, [totals, perPage, curPage]);

    const navigatePage = (isPrev) => {
        if (isPrev) {
            if (pageInfo.curPage === 1) return;

            setPage(pageInfo.curPage - 1);
            setPageInfo((prev) => ({ ...prev, curPage: prev.curPage - 1 }));
            return;
        }

        if (pageInfo.curPage === pageInfo.totalPage) return;
        setPage(pageInfo.curPage + 1);
        setPageInfo((prev) => ({ ...prev, curPage: prev.curPage + 1 }));
    };

    return (
        <div className="dashboard-pagination">
            <div className="page-contents">{children}</div>
            {pageInfo.totalPage > 1 && <MovePage gotoPage={navigatePage} />}
            {pageInfo.totalPage > 1 && <MovePage gotoPage={navigatePage} isPrev={false} />}
            <div className="page-info">
                {pageInfo.curPage}/{pageInfo.totalPage}
            </div>
        </div>
    );
};

export default Pagination;
