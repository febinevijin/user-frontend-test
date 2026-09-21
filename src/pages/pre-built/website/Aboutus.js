import React, { useEffect, useState } from 'react';
import bg2 from "../../../images/bg2.png";
import { Card, Col, Collapse } from 'reactstrap';
import Head from '../../../layout/head/Head';
import Slider from 'react-slick';
import { SlickArrowLeft, SlickArrowRight } from '../../../components/partials/slick/SlickComponents';
import bg3 from "../../../images/bg3.png";
import profile1 from "../../../images/avatar/a-sm.jpg";
import profile2 from "../../../images/avatar/b-sm.jpg";
import profile3 from "../../../images/avatar/c-sm.jpg";
import profile4 from "../../../images/avatar/d-sm.jpg";
import profile5 from "../../../images/avatar/e-sm.jpg";
import quote from "../../../images/icons/quote.png";


function Aboutus() {

    const [isOpen, setIsOpen] = useState("0");

    const toggleAccordion = (id) => {
        setIsOpen(isOpen === id ? 0 : id);  // Toggle between open and close
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "colorTheme": "dark",
            "dateRange": "12M",
            "showChart": false,
            "locale": "en",
            "largeChartUrl": "",
            "isTransparent": false,
            "showSymbolLogo": true,
            "showFloatingTooltip": false,
            "plotLineColorGrowing": "rgba(241, 194, 50, 1)",
            "plotLineColorFalling": "rgba(241, 194, 50, 1)",
            "gridLineColor": "rgba(240, 243, 250, 0)",
            "scaleFontColor": "rgba(19, 23, 34, 1)",
            "belowLineFillColorGrowing": "rgba(255, 217, 102, 0.88)",
            "belowLineFillColorFalling": "rgba(255, 229, 153, 0.95)",
            "belowLineFillColorGrowingBottom": "rgba(255, 229, 153, 0.62)",
            "belowLineFillColorFallingBottom": "rgba(191, 144, 0, 0)",
            "symbolActiveColor": "rgba(255, 217, 102, 0.62)",
            "tabs": [
                {
                    "title": "Crypto",
                    "symbols": [
                        {
                            "s": "MARKETSCOM:BITCOIN"
                        },
                        {
                            "s": "MARKETSCOM:ETHEREUM"
                        },
                        {
                            "s": "COINBASE:SOLUSD"
                        },
                        {
                            "s": "BITSTAMP:XRPUSD"
                        },
                        {
                            "s": "BINANCE:BNBUSD"
                        },
                        {
                            "s": "KRAKEN:USDTUSD"
                        },
                        {
                            "s": "BITSTAMP:USDCUSD"
                        },
                        {
                            "s": "COINBASE:DOGEUSD"
                        },
                        {
                            "s": "CRYPTO:TONUSD"
                        }
                    ],
                    "originalTitle": "Indices"
                }
            ]
        });
        document.querySelector('.tradingview-widget-container').appendChild(script);
    }, []);

    const settings2 = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: false,
        className: "slider-init plan-list",
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
            { breakpoint: 1539, settings: { slidesToShow: 3 } },
            { breakpoint: 992, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 1 } },
        ],
        slide: "li",
        prevArrow: <SlickArrowLeft />,
        nextArrow: <SlickArrowRight />,
    };

    return (
        <>

            <Head title="About us"></Head>

            <div className="bannerSection">
                <div className='containerDiv'>
                    <div className="bg"> <img src={bg2} alt="" /></div>
                    <div className="imgDiv">
                        <div className="tradingview-widget-container">
                            <div className="tradingview-widget-container__widget"></div>
                        </div>
                    </div>
                    <div className="contentDiv">
                        <p className="label">About Filan Trading</p>
                        <p>Our expert team utilizes cutting-edge technology to address challenges in the financial sector, delivering advanced solutions that enhance efficiency, security, and regulatory compliance. We specialize in serving financial institutions, corporations, and investors within a fast-paced market environment. Our white paper outlines our future strategies and offers a comprehensive overview of Filan Trading, highlighting our involvement in cryptocurrency and forex trading.</p>
                        <a href="" className="btn1">Subscribe Now</a>
                    </div>
                </div>
            </div>

            <section id="testmonials">
                {/* <div className="bg"> <img src={bg3} alt="" /></div> */}
                <h2 className="heading">Successful Stories <br />
                    <span> 100+ Happy customers & counting</span></h2>
                <Slider {...settings2}>
                    <Col className="px-3">
                        <Card className="card-bordered pricing">
                            <img className='quote' src={quote} alt="" />
                            <div className="pricing-head">
                                <div className="imgDiv">
                                    <img src={profile3} alt="" />
                                    <div className="nameDIv">
                                        <p className="name">Jessica</p>
                                        <span>⭐⭐⭐⭐⭐</span>
                                    </div>
                                </div>
                                <div className="textDiv">
                                    <p>Filan Trading Company consistently delivers on profit promises, making them a standout choice for investment opportunities. Their transparent approach and reliable performance have earned my complete satisfaction.</p>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col className="px-3">
                        <Card className="card-bordered pricing">
                            <img className='quote' src={quote} alt="" />
                            <div className="pricing-head">
                                <div className="imgDiv">
                                    <img src={profile1} alt="" />
                                    <div className="nameDIv">
                                        <p className="name">Joseph</p>
                                        <span>⭐⭐⭐⭐⭐</span>
                                    </div>
                                </div>
                                <div className="textDiv">
                                    <p>Investing with Filan Trading has been a game-changer for me. Their consistent profitability and transparent communication make them a top choice. I'm impressed and satisfied with the results.</p>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col className="px-3">
                        <Card className="card-bordered pricing">
                            <img className='quote' src={quote} alt="" />
                            <div className="pricing-head">
                                <div className="imgDiv">
                                    <img src={profile2} alt="" />
                                    <div className="nameDIv">
                                        <p className="name">Arun sharma</p>
                                        <span>⭐⭐⭐⭐⭐</span>
                                    </div>
                                </div>
                                <div className="textDiv">
                                    <p>Impressed by Filan Trading's ability to generate consistent profits, I confidently recommend them to fellow investors. Their attention to market trends and risk management strategies ensure a rewarding investment experience</p>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col className="px-3">
                        <Card className="card-bordered pricing">
                            <img className='quote' src={quote} alt="" />
                            <div className="pricing-head">
                                <div className="imgDiv">
                                    <img src={profile5} alt="" />
                                    <div className="nameDIv">
                                        <p className="name">George</p>
                                        <span>⭐⭐⭐⭐⭐</span>
                                    </div>
                                </div>
                                <div className="textDiv">
                                    <p>Choosing Filan Trading for investment was one of the best decisions I've made. Their focus on maximizing profits while managing risks effectively has resulted in steady growth for my portfolio. I'm highly satisfied with the results so far.</p>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col className="px-3">
                        <Card className="card-bordered pricing">
                            <img className='quote' src={quote} alt="" />
                            <div className="pricing-head">
                                <div className="imgDiv">
                                    <img src={profile4} alt="" />
                                    <div className="nameDIv">
                                        <p className="name">Richard Noah</p>
                                        <span>⭐⭐⭐⭐⭐</span>
                                    </div>
                                </div>
                                <div className="textDiv">
                                    <p>Choosing Filan Trading for investment has been a lucrative decision. Their dedication to maximizing profits and minimizing risks has provided me with peace of mind and financial growth. I couldn't be happier with the returns on my investment.</p>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Slider>
            </section>

            <section id="faqSection">
                <h2 className="heading">Become a Filan Trader & <br /> start earning today</h2>
                <div className="accordion accordian-s2">

                    {/* Accordion Item 1 */}
                    <div className="accordion-item">
                        <div
                            className={`accordion-head ${isOpen === "1" ? "" : "collapsed"}`}
                            onClick={() => toggleAccordion("1")}
                        >
                            <h6 className="title">What is the minimum investment amount required to get started?</h6>
                            <span className="accordion-icon">
                                {isOpen === "1" ? '-' : '+'}
                            </span>
                        </div>
                        <Collapse className="accordion-body" isOpen={isOpen === "1"}>
                            <div className="accordion-inner">
                                <p>Our platform accommodates a range of investors, and the minimum investment amount is designed to be accessible. The specific minimum may vary, so please check our platform or contact our support team for the most up-to-date information.</p>
                            </div>
                        </Collapse>
                    </div>

                    {/* Accordion Item 2 */}
                    <div className="accordion-item">
                        <div
                            className={`accordion-head ${isOpen === "2" ? "" : "collapsed"}`}
                            onClick={() => toggleAccordion("2")}
                        >
                            <h6 className="title">How do initiate a withdrawal, and how long does it take?</h6>
                            <span className="accordion-icon">
                                {isOpen === "2" ? '-' : '+'}
                            </span>
                        </div>
                        <Collapse className="accordion-body" isOpen={isOpen === "2"}>
                            <div className="accordion-inner">
                                <p>Withdrawing your funds is a straightforward process. Simply log in to your account, navigate to the withdrawal section, and follow the prompts. We take pride in providing fastest withdrawal options, allowing you to access your funds promptly.</p>
                            </div>
                        </Collapse>
                    </div>

                    {/* Accordion Item 3 */}
                    <div className="accordion-item">
                        <div
                            className={`accordion-head ${isOpen === "3" ? "" : "collapsed"}`}
                            onClick={() => toggleAccordion("3")}
                        >
                            <h6 className="title">Are there any hidden fees or charges associated with investment?</h6>
                            <span className="accordion-icon">
                                {isOpen === "3" ? '-' : '+'}
                            </span>
                        </div>
                        <Collapse className="accordion-body" isOpen={isOpen === "3"}>
                            <div className="accordion-inner">
                                <p>Transparency is a cornerstone of our business. We strive to keep our fee structure clear and straightforward.80 percent of the company's daily trading profit is given to each investor and the remaining 20 percent is taken for the company's profit.Users will get their trade amount back when the plan expires, but what you need to understand is that each user will have different capital amounts on the day their plan expires.Because the capital amount of each user is more likely to decrease than the initially invested capital amount due to daily trading losses.So the company will give you your capital amount return by evaluating your capital amount at that time. You can find detailed information about any fees or charges in our terms and conditions. Rest assured, we are committed to providing transparent and fair services to our investors.</p>
                            </div>
                        </Collapse>
                    </div>

                    {/* Accordion Item 4 */}
                    <div className="accordion-item">
                        <div
                            className={`accordion-head ${isOpen === "4" ? "" : "collapsed"}`}
                            onClick={() => toggleAccordion("4")}
                        >
                            <h6 className="title">How does company ensure the security of investments?</h6>
                            <span className="accordion-icon">
                                {isOpen === "4" ? '-' : '+'}
                            </span>
                        </div>
                        <Collapse className="accordion-body" isOpen={isOpen === "4"}>
                            <div className="accordion-inner">
                                <p>We prioritize the security of your investments through a multi-layered approach. Our platform undergoes regular security audits, employs the latest encryption technologies, and adheres to industry best practices. Your investment is very safe trade by our expert trained team members with years of experience in crypto and forex trading fields. Additionally, our expert team continuously monitors and adapts to emerging security threats to ensure the safety of your assets.</p>
                            </div>
                        </Collapse>
                    </div>

                    {/* Accordion Item 5 */}
                    <div className="accordion-item">
                        <div
                            className={`accordion-head ${isOpen === "5" ? "" : "collapsed"}`}
                            onClick={() => toggleAccordion("5")}
                        >
                            <h6 className="title">Will the company give high profit every day?</h6>
                            <span className="accordion-icon">
                                {isOpen === "5" ? '-' : '+'}
                            </span>
                        </div>
                        <Collapse className="accordion-body" isOpen={isOpen === "5"}>
                            <div className="accordion-inner">
                                <p>It is not possible to give the same amount of profit continuously by trading in the market every day.The company takes trades from Monday to Friday. There will be profit and loss in trading, but our experienced traders will try to make a good profit daily without causing any loss to you. So we will make profit for you at least a minimum amount per day.</p>
                            </div>
                        </Collapse>
                    </div>

                </div>
            </section>
        </>
    )
}

export default Aboutus