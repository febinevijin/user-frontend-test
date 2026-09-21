import React, { useEffect, useState } from 'react';
import bgimg from "../../../images/bg-img.png";
import img1 from "../../../images/1_.png";
import img2 from "../../../images/2_.png";
import img3 from "../../../images/3_.png";
import img4 from "../../../images/4.png";
import img5 from "../../../images/5_.png";
import bg2 from "../../../images/bg2.png";
import bg3 from "../../../images/bg3.png";
import profile from "../../../images/avatar/profile.png";
import quote from "../../../images/icons/quote.png";
import Head from "../../../layout/head/Head";
import { Button, Card, Col, Collapse } from 'reactstrap';
import { SlickArrowLeft, SlickArrowRight } from "../../../components/partials/slick/SlickComponents";
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function Home() {

  const [isOpen, setIsOpen] = useState("0");

  const toggleAccordion = (id) => {
    setIsOpen(isOpen === id ? 0 : id);
  };

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

  const handleSuccess = () => {
    // Get the textarea by its ID
    const textarea = document.getElementById("cf-default-textarea");
  
    // Show the SweetAlert popup
    Swal.fire({
      icon: "success",
      title: "Message Sent",
      text: "Your message has been successfully sent.",
      focusConfirm: false,
    }).then(() => {
      // Clear the textarea after the popup is confirmed
      textarea.value = "";
    });
  };
  

  return (
    <>
      <Head title="Home"></Head>
      <div className="bgLine">
        <img className="bg" src={bgimg} alt="" />
      </div>

      <section id="wallSection">
        <div className="content">
          <h1 className="heading">Best Trading Investments <br /><span> For Worldwide</span></h1>
          <h5 className="subTitle">Filan trading gives you daily profit through trading</h5>
          <div className="btnDiv">
            <Link to={`${process.env.PUBLIC_URL}/auth-register`} href="" className="btn">Join Now
            </Link>
          </div>

        </div>

      </section>

      <section className="cardSection">
        <div className="card">
          <h5 className="title">Our digital currency investment company is led by cryptocurrency, forex and finance experts.</h5>
          <img src={img3} alt="" />
        </div>
        <div className="card">
          <h4 className="title">We are constantly striving to make you a good percentage of profit every day.</h4>
          <img src={img2} alt="" />
        </div>
        <div className="card">
          <h4 className="title">We prioritize your investment security with advanced technologies and risk management.</h4>
          <img src={img5} alt="" />
        </div>
        <div className="card">
          <h4 className="title">Our platform undergoes regular third-party security audits to ensure system integrity.</h4>
          <img src={img4} alt="" />
        </div>
        <div className="card">
          <h4 className="title">Enjoy instant access to your funds with our fast and seamless withdrawal process.</h4>
          <img src={img1} alt="" />
        </div>
        <div className="card">
          <h4 className="title">Achieve high returns with our strategic investment approach designed for maximum growth.</h4>
          <img src={img1} alt="" />
        </div>
      </section>

      <div className="bannerSection">
        <div className='containerDiv'>
          <div className="bg"> <img src={bg3} alt="" /></div>
          <div className="imgDiv">
            <div className="tradingview-widget-container">
              <div className="tradingview-widget-container__widget"></div>
            </div>
          </div>
          <div className="contentDiv">
            <p className="label">About Filan Trading</p>
            <h3 className="title">The Best Trading Platform</h3>
            <p>Our expert team utilizes cutting-edge technology to address challenges in the financial sector, delivering advanced solutions that enhance efficiency, security, and regulatory compliance. We specialize in serving financial institutions, corporations, and investors within a fast-paced market environment. Our white paper outlines our future strategies and offers a comprehensive overview of Filan Trading, highlighting our involvement in cryptocurrency and forex trading.</p>
            <a href="https://t.me/+A-F3EFPyjJ1jNDQ1" className="btn1">Subscribe Now</a>
          </div>
        </div>
      </div>

      <div className="bannerSection">
        <div className='containerDiv containerDivReverse'>
          <div className="bg"> <img src={bg3} alt="" /></div>
          <div className="imgDiv">
          <img src={img3} alt="" />
          </div>
          <div className="contentDiv">
            <p className="label">The Best Trading Platform</p>
            <h3 className="title">Why Choose Filan Trading</h3>
            <p>Joining the Filan Trading community now offers users a unique opportunity to earn daily profits from crypto and forex trading while benefiting from the future growth of the Filan Token. As an investor, you can enjoy consistent returns, a secure and transparent trading environment, and exclusive early access to the Filan Token’s utility. By being part of the community early, you position yourself for potential rewards, staking opportunities, and lower trading fees once the Filan Token is fully integrated. Don’t miss the chance to grow your wealth with Filan Trading’s innovative approach!</p>
          </div>
        </div>
      </div>

      {/* <section className="payoutsSection">

        <h2 className="heading">Why Choose Filan Trading</h2>
        <div className="cardDiv">
          <div className="card">
            <h4 className="title">All Members</h4>
            <h2 className="value">10,458</h2>
          </div>
          <div className="card">
            <h4 className="title">Average Investment</h4>
            <h2 className="value">95,00,000</h2>
          </div>
          <div className="card">
            <h4 className="title">Countries Supported</h4>
            <h2 className="value">190+</h2>
          </div>
          <div className="card">
            <h4 className="title">Experiance</h4>
            <h2 className="value">10+ yrs</h2>
          </div>
        </div>
      </section> */}

      <section className="processSection">
        <div className="bg"> <img src={bg3} alt="" /></div>
        <h2 className="heading">Become an Filan Trader & <br /> start earning today</h2>
        <ul className="cardDiv">
          <li>
            <p className="number">1</p>
            <p className="text">Set up your account and log in to access all features and services.</p>
          </li>
          <li>
            <p className="number">2</p>
            <p className="text">Select a payment method, add funds, and start using our services.</p>
          </li>
          <li>
            <p className="number">3</p>
            <p className="text">Choose services to boost visibility and gain publicity. Enjoy results once your order is complete.</p>
          </li>
        </ul>
        <a href="" className="btn1">Register Now</a>
      </section>

      <section id="testmonials">
        {/* <div className="bg"> <img src={bg3} alt="" /></div> */}
        <h2 className="heading">Successful Stories <br />
          <span> 10000+ Happy customers & counting</span></h2>
        <Slider {...settings2}>
          <Col className="px-3">
            <Card className="card-bordered pricing">
              <img className='quote' src={quote} alt="" />
              <div className="pricing-head">
                <div className="imgDiv">
                  <img src={profile} alt="" />
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
                  <img src={profile} alt="" />
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
                  <img src={profile} alt="" />
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
                  <img src={profile} alt="" />
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
                  <img src={profile} alt="" />
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

      <section id="reviewSection">
        <div className="bg"> <img src={bg3} alt="" /></div>
        <h2 className="heading">Share your experiance</h2>

        <div className="form-group">
          <div className="form-control-wrap">
            <textarea
              className="form-control form-control-sm"
              id="cf-default-textarea"
              placeholder="Write your message here...."
            ></textarea>
          </div>
        </div>

        <div className="form-group">
          <Button color="btn" size="lg" onClick={() => handleSuccess()}>
            Send Message
          </Button>
        </div>
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
              <h6 className="title">What is Filan Token? What are the future benefits of Filan Token?</h6>
              <span className="accordion-icon">
                {isOpen === "1" ? '-' : '+'}
              </span>
            </div>
            <Collapse className="accordion-body" isOpen={isOpen === "1"}>
              <div className="accordion-inner">
                <p>Filan Token is the official utility cryptocurrency token of Filan Trading Company, developed to support and enhance the company’s trading ecosystem. It plays a key role in enabling transactions, rewarding users, and accessing exclusive features within the platform.</p>
                <p>The company’s vision is to drive the long-term growth and success of Filan Token within the broader crypto and financial markets.</p>
                <p>Investing in Filan Token during its early launch phase, while the price is still low, offers a strong opportunity for future gains. As the platform grows and adoption increases, the value of Filan Token is expected to rise, potentially generating higher returns for early holders who choose to hold the token long-term.</p>
              </div>
            </Collapse>
          </div>

          {/* Accordion Item 7 */}
          <div className="accordion-item">
            <div
              className={`accordion-head ${isOpen === "7" ? "" : "collapsed"}`}
              onClick={() => toggleAccordion("7")}
            >
              <h6 className="title">Where can users buy Filan Token?</h6>
              <span className="accordion-icon">
                {isOpen === "7" ? '-' : '+'}
              </span>
            </div>
            <Collapse className="accordion-body" isOpen={isOpen === "7"}>
              <div className="accordion-inner">
                <p>Currently, Filan Token is exclusively available on the Filan Trading platform at an early-stage, low entry price. It is not yet listed on external cryptocurrency exchanges.</p>
                <p>However, the company is actively working to list Filan Token on major crypto exchanges in the near future. As the platform grows and upcoming projects and programs related to Filan Token are launched, its market value is expected to increase progressively over time.</p>
                <p>Early buyers have the opportunity to invest at a lower price before public exchange listings and broader adoption.</p>
              </div>
            </Collapse>
          </div>

          {/* Accordion Item 2 */}
          <div className="accordion-item">
            <div
              className={`accordion-head ${isOpen === "2" ? "" : "collapsed"}`}
              onClick={() => toggleAccordion("2")}
            >
              <h6 className="title">What is the minimum investment amount required to get started?</h6>
              <span className="accordion-icon">
                {isOpen === "2" ? '-' : '+'}
              </span>
            </div>
            <Collapse className="accordion-body" isOpen={isOpen === "2"}>
              <div className="accordion-inner">
                <p>Filan Trading allows users to start trading with a minimum investment of just $15, making it accessible for all types of investors. There is no upper limit, so users can deposit any amount based on their financial goals.</p>
                <p>Higher capital typically leads to higher potential returns, and users also have the flexibility to add more funds at any time to increase their trading capital and earning potential.</p>
              </div>
            </Collapse>
          </div>

          {/* Accordion Item 8 */}
          <div className="accordion-item">
            <div
              className={`accordion-head ${isOpen === "8" ? "" : "collapsed"}`}
              onClick={() => toggleAccordion("8")}
            >
              <h6 className="title">Who is the founder of Filan Trading and Filan Token?</h6>
              <span className="accordion-icon">
                {isOpen === "8" ? '-' : '+'}
              </span>
            </div>
            <Collapse className="accordion-body" isOpen={isOpen === "8"}>
              <div className="accordion-inner">
                <p>The founder of Filan Trading Company and the visionary behind the Filan Token is Felix Liam Nelson. Under his leadership, the company is pioneering innovation in the crypto and forex trading space, with a strong focus on transparency, advanced technology, and the development of its native utility token—Filan Token—which serves as the foundation of its growing digital ecosystem</p>
              </div>
            </Collapse>
          </div>

          {/* Accordion Item 3 */}
          <div className="accordion-item">
            <div
              className={`accordion-head ${isOpen === "3" ? "" : "collapsed"}`}
              onClick={() => toggleAccordion("3")}
            >
              <h6 className="title">How do initiate a withdrawal, and how long does it take?</h6>
              <span className="accordion-icon">
                {isOpen === "3" ? '-' : '+'}
              </span>
            </div>
            <Collapse className="accordion-body" isOpen={isOpen === "3"}>
              <div className="accordion-inner">
                <p>Withdrawing your funds is a straightforward process. Simply log in to your account, navigate to the withdrawal section, and follow the prompts. We take pride in providing fastest withdrawal options, allowing you to access your funds promptly.</p>
              </div>
            </Collapse>
          </div>

          {/* Accordion Item 4 */}
          <div className="accordion-item">
            <div
              className={`accordion-head ${isOpen === "4" ? "" : "collapsed"}`}
              onClick={() => toggleAccordion("4")}
            >
              <h6 className="title">Are there any hidden fees or charges associated with investment?</h6>
              <span className="accordion-icon">
                {isOpen === "4" ? '-' : '+'}
              </span>
            </div>
            <Collapse className="accordion-body" isOpen={isOpen === "4"}>
              <div className="accordion-inner">
                <p>No, there are no hidden fees or charges associated with investing in Filan Trading Company. All charges are fully transparent and clearly displayed within the platform.</p>
                <p>The company only takes a small percentage from the daily profit as its share, and this is communicated upfront. Additionally, investors are eligible to receive 70% of their capital back after their trading plan duration ends.</p>
                <p>All fees—such as withdrawal charges or transaction costs—are detailed clearly in each section of the platform. Filan Trading prioritizes honest and transparent operations, ensuring investors know exactly where their money goes.</p>
              </div>
            </Collapse>
          </div>

          {/* Accordion Item 5 */}
          <div className="accordion-item">
            <div
              className={`accordion-head ${isOpen === "5" ? "" : "collapsed"}`}
              onClick={() => toggleAccordion("5")}
            >
              <h6 className="title">How does company ensure the security of investments?</h6>
              <span className="accordion-icon">
                {isOpen === "5" ? '-' : '+'}
              </span>
            </div>
            <Collapse className="accordion-body" isOpen={isOpen === "5"}>
              <div className="accordion-inner">
                <p>We prioritize the security of your investments through a multi-layered approach. Our platform undergoes regular security audits, employs the latest encryption technologies, and adheres to industry best practices. Your investment is very safe trade by our expert trained team members with years of experience in crypto and forex trading fields. Additionally, our expert team continuously monitors and adapts to emerging security threats to ensure the safety of your assets.</p>
              </div>
            </Collapse>
          </div>

          {/* Accordion Item 6 */}
          <div className="accordion-item">
            <div
              className={`accordion-head ${isOpen === "6" ? "" : "collapsed"}`}
              onClick={() => toggleAccordion("6")}
            >
              <h6 className="title">Will the company give high profit every day?</h6>
              <span className="accordion-icon">
                {isOpen === "6" ? '-' : '+'}
              </span>
            </div>
            <Collapse className="accordion-body" isOpen={isOpen === "6"}>
              <div className="accordion-inner">
                <p>Filan Trading Company operates in both the crypto and forex markets, which are known for their high volatility and risk. While the company employs expert traders and advanced strategies to aim for consistent daily profits, no trading platform can guarantee high profits every day due to unpredictable market conditions.</p>
                <p>The company does have techniques to recover losses from future trades, which helps maintain overall profitability. However, daily profit amounts will vary based on market performance, and some days may see lower returns or even temporary losses.</p>
                <p>In summary, the goal is to provide steady and reliable profits over time, but daily high profits are not guaranteed—they depend on market behavior and trading outcomes.</p>
              </div>
            </Collapse>
          </div>

        </div>
      </section>

    </>
  );
}

export default Home;
