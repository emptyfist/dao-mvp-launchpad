import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkBlockQuote from 'remark-github-beta-blockquote-admonitions';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { remarkExtendedTable, extendedTableHandlers } from 'remark-extended-table';
import 'react-loading-skeleton/dist/skeleton.css';
import { CustomSelect } from '../reusable';
import { Ido } from '../../assets/icons';
import { useSaleContext } from '../../context/sale/SaleState';

const Details = ({ contents }) => {
    const { salePublic } = useSaleContext();
    const scrollToSection = (selSection) => {
        let target = document.getElementById(selSection);
        if (!target || !target.parentNode) return;

        target.parentNode.parentNode.scrollTop = target.offsetTop - 40;
        // document.getElementById(selSection).scrollIntoView({
        //     behavior: 'smooth'
        // });
    };

    const navHandler = (selSection) => {
        scrollToSection(selSection.value);
    };

    const DetailsContentHeader = contents.filter((el) => el.type !== 'text');

    return (
        <div className="details">
            <div className="page-title">
                <Ido />
                <span>Details</span>
                <div className="space-gap"></div>
            </div>
            <div className="details-wrapper">
                <div className="details-nav">
                    <div>
                        {DetailsContentHeader.map((itm, idx) => {
                            if (itm.type === 'title') {
                                return (
                                    <div
                                        key={idx}
                                        className="details-navitem"
                                        onClick={(e) => scrollToSection(itm.value)}
                                    >
                                        {itm.label}
                                    </div>
                                );
                            }
                            return (
                                <div
                                    key={idx}
                                    className="details-navitem subtitle"
                                    onClick={(e) => scrollToSection(itm.value)}
                                >
                                    {itm.label}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="details-select">
                    <CustomSelect
                        options={DetailsContentHeader}
                        placeHolder="Select Section"
                        changeHandler={navHandler}
                        isDetail={true}
                    />
                </div>
                <div className="details-content">
                    {/* <div>
                        {contents.map((itm, idx) => {
                            if (itm.type === 'title' || itm.type === 'subtitle') {
                                return (
                                    <div key={idx}>
                                        <div className="content-title" id={itm.value}>
                                            {itm.label}
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={idx}>
                                    <div className="content">
                                        <p>{itm.label}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div> */}
                    <div className="markdown">
                        <ReactMarkdown
                            className="markdown-body"
                            remarkPlugins={[
                                remarkParse,
                                remarkRehype,
                                remarkGfm,
                                remarkBlockQuote,
                                remarkExtendedTable,
                                extendedTableHandlers,
                            ]}
                            rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings, rehypeStringify]}
                            children={salePublic.project?.longProjectIntroduction ?? ''}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Details;
