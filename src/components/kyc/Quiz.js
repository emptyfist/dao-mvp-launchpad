import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { SimpleButton, CustomCheck } from '../reusable';
import { getRandom } from '../../helpers/functions';
import { useGlobalContext } from '../../context/global/GlobalState';
import config from '../../config/config';
import { fetchWrapper } from '../../helpers/fetch-wrapper';
import { Loading3Dot } from '../../assets/loading';
import { useSaleContext } from '../../context/sale/SaleState';

const Quiz = () => {
    const [data, setData] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [finished, setFinished] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const { kycInfo } = useGlobalContext();
    const { salePublic } = useSaleContext();
    let navigate = useNavigate();

    useEffect(() => {
        if (!salePublic.id) return;

        const quizData = [
            {
                title: salePublic.question1 ?? '',
                answers: [
                    salePublic.firstIncorrectAnswer1 ?? '',
                    salePublic.correctAnswer1 ?? '',
                    salePublic.secondIncorrectAnswer1 ?? '',
                ],
                correct: 1,
            },
            {
                title: salePublic.question2 ?? '',
                answers: [
                    salePublic.correctAnswer2 ?? '',
                    salePublic.firstIncorrectAnswer2 ?? '',
                    salePublic.secondIncorrectAnswer2 ?? '',
                ],
                correct: 0,
            },
            {
                title: salePublic.question3 ?? '',
                answers: [
                    salePublic.firstIncorrectAnswer3 ?? '',
                    salePublic.secondIncorrectAnswer3 ?? '',
                    salePublic.correctAnswer3 ?? '',
                ],
                correct: 2,
            },
        ];

        const randomData = getRandom(quizData, config.quizCount);
        setData(randomData);
        setAnswers(Array(config.quizCount).fill(-1));
    }, [salePublic]);

    const handleClick = (i, j) => {
        answers[i] = j;
        setAnswers([...answers]);
        if (finished) setFinished(false);
    };

    const submit = async (e) => {
        let allCorrect = true;
        let i = 0;

        for (; i < data.length; i++) {
            if (answers[i] === -1) break;
            if (answers[i] !== data[i].correct) allCorrect = false;
        }

        setFinished(true);

        if (i < data.length) {
            toast.error('Some fields are missing.');
            return;
        }

        if (!allCorrect) {
            toast.error('There are some wrong answers.');
            return;
        }

        setSubmitting(true);

        // submit data to KYC Verify endpoint
        await fetchWrapper
            .post(`/api/Sale/Apply/${salePublic.id}`, {
                telegramUsername: kycInfo.telegramUsername,
                twitterUsername: kycInfo.twitterUsername,
            })
            .then((res) => {
                navigate(`/sales/${salePublic.id}`);
            })
            .catch((err) => {
                console.log('/api/Sale/Apply', err);
                toast.error(err?.error ?? err);
            });

        setSubmitting(false);
    };

    return (
        <div className="quiz">
            <div className="quiz-container">
                {data.map((item, i) => (
                    <div key={item.title} className="quiz-item">
                        <p className="title">{item.title}</p>
                        {item.answers.map((answer, j) => (
                            <CustomCheck
                                key={j}
                                checkType={
                                    finished
                                        ? j === answers[i] && answers[i] !== item.correct
                                            ? 'wrong-answer'
                                            : 'correct-answer'
                                        : 'correct-answer'
                                }
                                caption={answer}
                                checkChanged={(status) => handleClick(i, j, status)}
                                status={j === answers[i]}
                                finished={finished}
                                isDisabled={isSubmitting}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="step-container">
                <SimpleButton clickHandler={submit} isDisabled={isSubmitting}>
                    Submit
                    {isSubmitting && (
                        <div className="spinner-wrapper">
                            <Loading3Dot width={32} height={32} />
                        </div>
                    )}
                </SimpleButton>
                <span>2/2</span>
            </div>
            <div className="sp-step-container">
                <SimpleButton clickHandler={submit}>
                    <div className="btn-content">
                        <div />
                        <span>Submit</span>
                        <span className="step">2/2</span>
                    </div>
                </SimpleButton>
            </div>
        </div>
    );
};

export default Quiz;
