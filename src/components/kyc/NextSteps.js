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
import { SocialForm, Quiz } from '../kyc';
import { CardWrapper } from '../reusable';
import { useWidth } from '../../hooks';
import { KYC_VERIFY_STEP, PHABLET_WIDTH } from '../../config/constants';

const NextStepContent = ({ step, nextHandler, contents }) => {
    return (
        <div className="next-steps">
            <div className="left-panel">
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
                    children={contents ?? ''}
                />
            </div>
            <div className="right-panel">
                {step === KYC_VERIFY_STEP.SUBMIT_INFO && <SocialForm nextHandler={nextHandler} />}
                {step === KYC_VERIFY_STEP.SUBMIT_QUIZ && <Quiz />}
            </div>
        </div>
    );
};

const NextSteps = ({ current, nextHandler, contents }) => {
    const windowWidth = useWidth();

    return (
        <div className="next-step-kyc-wrapper">
            {windowWidth <= PHABLET_WIDTH ? (
                <CardWrapper title="Whitelisting Process">
                    <NextStepContent step={current} nextHandler={nextHandler} />
                </CardWrapper>
            ) : (
                <NextStepContent step={current} nextHandler={nextHandler} contents={contents} />
            )}
        </div>
    );
};

export default NextSteps;
