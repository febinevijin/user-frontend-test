import React, { useContext, useEffect, useState } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import img1 from "../images/icons/account-secure.svg";
import img2 from "../images/icons/card-credit.svg";
import img3 from "../images/icons/card-debit.svg";
import img4 from "../images/icons/invoice.svg";
import img5 from "../images/icons/code-scan.svg";
import img6 from "../images/icons/bills.svg";
import img7 from "../images/icons/plan-s3.svg";
import { Button, Card, Input } from "reactstrap";
import {
  Block,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockBetween,
  BlockTitle,
  PreviewAltCard,
  Row,
  Col,
  LineChartExample,
  Icon,
  PreviewCard,
  BlockContent,
} from "../components/Component";
import { solidLineChart } from "./ChartData";
import TrafficDougnut from "../components/partials/analytics/traffic-dougnut/TrafficDoughnut";
import CopyToClipboard from "react-copy-to-clipboard";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../utils/AxiosInstance";
import GraphWrapper from "./GraphWrapper";
import { formatInTimeZone } from "date-fns-tz";
import { Icons } from "react-toastify";

const CryptoHomePage = () => {
  const { userInfo } = useContext(AuthContext);
  const [graphData, setGraphData] = useState([]);
  const [weeklyInterest, setWeeklyInterest] = useState([]);
  const [totalCountData, setTotalCountData] = useState({});
  const [userReferralLink, setUserReferralLink] = useState({});
  const [userRank, setUserRank] = useState("")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, setValue] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log(userInfo);
      try {
        setLoading(true);

        // Fetch graph data
        const graphResponse = await axiosInstance.get("/user/dashboard/user-graph-value", {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`, // Assuming userInfo has a token property
          },
        });

        // Fetch interest data
        const commonInterestData = await axiosInstance.get("/user/interest/list", {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`, // Assuming userInfo has a token property
          },
        });

        // Fetch total count data
        const totalCountResponse = await axiosInstance.get("/user/dashboard/user-total-amount", {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        });
        // Fetch user referral link
        const userReferralLink = await axiosInstance.get("/user/referral/link", {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        });

        // fetch Rank
        const userRankData = await axiosInstance.get("/user/profile/get-rank", {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        });

        // Update state with the data from both APIs
        setGraphData(graphResponse.data.data);
        setWeeklyInterest(commonInterestData.data.data.weeklyInterest);
        setTotalCountData(totalCountResponse.data.data);
        setUserReferralLink(userReferralLink.data.data);
        setUserRank(userRankData.data.data.rank);
        console.log(userRankData.data.data.rank);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (userInfo && userInfo.userName) {
      setValue(`${process.env.REACT_APP_PUBLIC_URL}/auth-refer-register?referral=${userInfo.userName}`);
    }
    fetchDashboardData();
  }, [userInfo]);
  // console.log(totalCountData);
  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
  //   script.async = true;
  //   script.innerHTML = JSON.stringify({
  //     colorTheme: 'light',
  //     dateRange: '12M',
  //     showChart: false,
  //     locale: 'en',
  //     largeChartUrl: '',
  //     isTransparent: false,
  //     showSymbolLogo: true,
  //     showFloatingTooltip: false,
  //     width: '400',
  //     height: '550',
  //     plotLineColorGrowing: 'rgba(41, 98, 255, 1)',
  //     plotLineColorFalling: 'rgba(41, 98, 255, 1)',
  //     gridLineColor: 'rgba(240, 243, 250, 0)',
  //     scaleFontColor: 'rgba(19, 23, 34, 1)',
  //     belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)',
  //     belowLineFillColorFalling: 'rgba(41, 98, 255, 0.12)',
  //     belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)',
  //     belowLineFillColorFallingBottom: 'rgba(41, 98, 255, 0)',
  //     symbolActiveColor: 'rgba(41, 98, 255, 0.12)',
  //     tabs: [
  //       {
  //         title: 'crypto',
  //         symbols: [
  //           {
  //             "s": "MARKETSCOM:BITCOIN"
  //           },
  //           {
  //             "s": "MARKETSCOM:ETHEREUM"
  //           },
  //           {
  //             "s": "COINBASE:SOLUSD"
  //           },
  //           {
  //             "s": "BITSTAMP:XRPUSD"
  //           },
  //           {
  //             "s": "BINANCE:BNBUSD"
  //           },
  //           {
  //             "s": "KRAKEN:USDTUSD"
  //           },
  //           {
  //             "s": "BITSTAMP:USDCUSD"
  //           },
  //           {
  //             "s": "COINBASE:DOGEUSD"
  //           },
  //           {
  //             "s": "CRYPTO:TONUSD"
  //           }
  //         ],
  //       },
  //     ],
  //   });

  //   document.querySelector('.tradingview-widget-container').appendChild(script);
  // }, []);
  const [sm, updateSm] = useState(false);

  // Helper function to get today's interest data
  const getTodayInterestData = () => {
    const today = new Date().toLocaleString("en-US", { weekday: "long" }); // Get the current day name
    return weeklyInterest.find((item) => item.day === today);
  };

  const todayInterest = getTodayInterestData();

  const formatTime = (date) => {
    let hours = date.getUTCHours(); // Use UTC hours to prevent timezone mismatches
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // if hour is 0, set it to 12
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };
  const getFnsTimeZone = () => {
    const nowTime = new Date();

    // Get the IST time (formatted)
    const formattedISTTime = formatInTimeZone(
      nowTime,
      "Asia/Kolkata",
      "yyyy-MM-dd'T'HH:mm:ss.SSSX", // ISO format with milliseconds and timezone offset
      { timeZone: "Asia/Kolkata" }
    );

    return formattedISTTime;
  };

  const extractTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12; // Convert to 12-hour format
    hours = hours ? hours : 12; // Handle midnight (0:00) case

    return { hours, minutes, seconds, ampm };
  };

  const trimDateTimeString = (dateTimeString) => {
    // Split the ISO string at the '.' to remove milliseconds and offset
    return dateTimeString.split(".")[0]; // Keep only the date and time part (without milliseconds)
  };

  const isCreditedTimeReached = (creditTime) => {
    const trimmedDateTime = trimDateTimeString(getFnsTimeZone());
    const currentTime = new Date(trimmedDateTime);

    const trimmedDateTime2 = trimDateTimeString(creditTime);
    const creditDate = new Date(trimmedDateTime2);

    // Extract the time components (hours, minutes, seconds, AM/PM) for both currentTime and creditDate
    const {
      hours: currentHours,
      minutes: currentMinutes,
      seconds: currentSeconds,
      ampm: currentAmPm,
    } = extractTime(currentTime);
    const {
      hours: creditHours,
      minutes: creditMinutes,
      seconds: creditSeconds,
      ampm: creditAmPm,
    } = extractTime(creditDate);
    console.log(currentHours);
    console.log(creditHours);
    // Compare AM/PM first
    if (currentAmPm !== creditAmPm) return currentAmPm === "PM";

    // Compare hours, minutes, and seconds
    if (currentHours > creditHours) return true;
    if (currentHours === creditHours && currentMinutes > creditMinutes) return true;
    if (currentHours === creditHours && currentMinutes === creditMinutes && currentSeconds >= creditSeconds)
      return true;

    return false;
  };

  const filterWeeklyInterestTillNow = (interestList) => {
    const today = new Date();
    const currentDayName = today.toLocaleString("en-US", { weekday: "long" });

    // Convert interest time to real date
    return interestList.filter((item) => {
      const itemDay = item.day;
      const itemTime = new Date(item.time);

      if (itemDay === currentDayName) {
        // Include today only if the credited time has passed
        return isCreditedTimeReached(item.time);
      }

      // Include only if the day comes before today
      const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      const todayIndex = weekDays.indexOf(currentDayName);
      const itemIndex = weekDays.indexOf(itemDay);

      return itemIndex < todayIndex;
    });
  };


  return (
    <>
      <Head title="Dashboard Overview" />
      <Content>
        <BlockHead size="sm" className="pb-2">
          <BlockBetween>
            <BlockHeadContent className="w-100">
              {/* <BlockTitle page className="text-white">
                Overview
              </BlockTitle> */}
              {/* <BlockDes className="text-soft">
                <p className="text-white">Welcome to Filan Trading</p>
              </BlockDes> */}
              <div className="d-flex align-item-start justify-content-between">
                <BlockDes>
                  <span style={{ color: "#fff" }}>
                    Username : <span style={{ color: "#f4bd0e" }}>&nbsp;{userInfo.userName}</span>
                  </span>{" "}
                  <br />
                  <span className="mt-2" style={{ color: "#fff" }}>
                    Filan ID : <span style={{ color: "#f4bd0e" }}>&nbsp;{userInfo.ID}</span>
                  </span>
                </BlockDes>

                <BlockDes>
                  <span style={{ color: "#fff" }}>
                    {" "}
                    Rank : <span style={{ color: "#f4bd0e" }}>&nbsp;{userRank}</span>
                  </span>
                </BlockDes>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        {loading ? (
          <p className="text-white">Loading...</p>
        ) : error ? (
          <p className="text-white">{error}</p>
        ) : (
          <>
            <Block>
              <Row>
                <Col lg="3" className="mb-3">
                  {/* <Card className="card-bordered pricing text-center">
                <div className="pricing-body">
                  <div className="pricing-media">
                    <img src={img1} alt="" />
                  </div>
                  <div className="pricing-title overview">
                    <h5 className="title">$1000.00</h5>
                    <p className="amount">
                      Main Balance
                    </p>
                  </div>
                </div>
              </Card> */}

                  <PreviewCard className="card-bordered reffer-card tot-reffer card1" bodyClass="card-inner-sm">
                    <BlockHead className="pb-1">
                      <BlockContent>
                        <BlockTitle className="text-uppercase text-1" tag="h6">
                          CURRENT BALANCE
                        </BlockTitle>
                      </BlockContent>
                    </BlockHead>
                    <div className="reffer-div w-100 cardRel mb-0">
                      <div className="reffer">
                        <h5 style={{ color: "#f4bd0e" }}>${totalCountData.earnedBalance.toFixed(2) || 0}</h5>
                      </div>
                    </div>
                  </PreviewCard>
                </Col>

                <Col lg="3" className="mb-3">
                  {/* <Card className="card-bordered pricing text-center">
                <div className="pricing-body">
                  <div className="pricing-media">
                    <img src={img2} alt="" />
                  </div>
                  <div className="pricing-title overview">
                    <h5 className="title">$1000.00</h5>
                    <p className="amount">
                      Interest Balance
                    </p>
                  </div>
                </div>
              </Card> */}

                  <PreviewCard className="card-bordered reffer-card tot-reffer card1" bodyClass="card-inner-sm">
                    <BlockHead className="pb-1">
                      <BlockContent>
                        {/* here Interest balance means interest + referred balnce which is stored in earned balance */}
                        <BlockTitle className="text-uppercase text-1" tag="h6">
                          Capital Trade Amount
                        </BlockTitle>
                      </BlockContent>
                    </BlockHead>
                    <div className="reffer-div w-100 cardRel mb-0">
                      <div className="reffer">
                        <h5 style={{ color: "#f4bd0e" }}>${totalCountData.capitalAmount.toFixed(2) || 0}</h5>
                      </div>
                    </div>
                  </PreviewCard>
                </Col>
                <Col lg="3" className="mb-3">
                  {/* <Card className="card-bordered pricing text-center">
                <div className="pricing-body">
                  <div className="pricing-media">
                    <img src={img3} alt="" />
                  </div>
                  <div className="pricing-title overview">
                    <h5 className="title">$1000.00</h5>
                    <p className="amount">
                      Total Deposit
                    </p>
                  </div>
                </div>
              </Card> */}

                  <PreviewCard className="card-bordered reffer-card tot-reffer card1" bodyClass="card-inner-sm">
                    <BlockHead className="pb-1">
                      <BlockContent>
                        <BlockTitle className="text-uppercase text-1" tag="h6">
                          Total Downline Trade volume
                        </BlockTitle>
                      </BlockContent>
                    </BlockHead>
                    <div className="reffer-div w-100 cardRel mb-0">
                      <div className="reffer">
                        <h5 style={{ color: "#f4bd0e" }}>${totalCountData.totalVolume.toFixed(2) || 0}</h5>
                      </div>
                    </div>
                  </PreviewCard>
                </Col>
                <Col lg="3" className="mb-3">
                  <PreviewCard className="card-bordered reffer-card tot-reffer card1" bodyClass="card-inner-sm">
                    <BlockHead className="pb-1">
                      <BlockContent>
                        {/* here Interest balance means interest + referred balnce which is stored in earned balance */}
                        <BlockTitle className="text-uppercase text-1" tag="h6">
                          Available Filan Token
                        </BlockTitle>
                      </BlockContent>
                    </BlockHead>
                    <div className="reffer-div w-100 cardRel mb-0">
                      <div className="reffer">
                        <h5 style={{ color: "#f4bd0e" }}>{totalCountData.userToken.toFixed(2) || 0}</h5>
                      </div>
                    </div>
                  </PreviewCard>
                </Col>
              </Row>
            </Block>

            <Block className="p-0">
              <Row>
                <Col lg="3" className="mb-3">
                  {/* <Card className="card-bordered pricing text-center">
                <div className="pricing-body">
                  <div className="pricing-media">
                    <img src={img4} alt="" />
                  </div>
                  <div className="pricing-title overview">
                    <h5 className="title">$1000.00</h5>
                    <p className="amount">
                      Total Earn
                    </p>
                  </div>
                </div>
              </Card> */}

                  <PreviewCard className="card-bordered reffer-card tot-reffer card1" bodyClass="card-inner-sm">
                    <BlockHead className="pb-1">
                      <BlockContent>
                        <BlockTitle className="text-uppercase text-1" tag="h6">
                          TOTAL Earnings
                        </BlockTitle>
                      </BlockContent>
                    </BlockHead>
                    <div className="reffer-div w-100 cardRel mb-0">
                      <div className="reffer">
                        <h5 style={{ color: "#f4bd0e" }}>${totalCountData.totalEarnedBalance.toFixed(2) || 0}</h5>
                      </div>
                    </div>
                  </PreviewCard>
                </Col>
                <Col lg="3" className="mb-3">
                  {/* <Card className="card-bordered pricing text-center">
                <div className="pricing-body">
                  <div className="pricing-media">
                    <img src={img4} alt="" />
                  </div>
                  <div className="pricing-title overview">
                    <h5 className="title">$1000.00</h5>
                    <p className="amount">
                      Total Earn
                    </p>
                  </div>
                </div>
              </Card> */}

                  <PreviewCard className="card-bordered reffer-card tot-reffer card1" bodyClass="card-inner-sm">
                    <BlockHead className="pb-1">
                      <BlockContent>
                        <BlockTitle className="text-uppercase text-1" tag="h6">
                          Today's Earnings
                        </BlockTitle>
                      </BlockContent>
                    </BlockHead>
                    <div className="reffer-div w-100 cardRel mb-0">
                      <div className="reffer">
                        <h5 style={{ color: "#f4bd0e" }}>${totalCountData.totalTodayEarning.toFixed(2) || 0}</h5>
                      </div>
                    </div>
                  </PreviewCard>
                </Col>
                <Col lg="3" className="mb-3">
                  {/* <Card className="card-bordered pricing text-center">
                <div className="pricing-body">
                  <div className="pricing-media">
                    <img src={img2} alt="" />
                  </div>
                  <div className="pricing-title overview">
                    <h5 className="title">$1000.00</h5>
                    <p className="amount">
                      Total Invest
                    </p>
                  </div>
                </div>
              </Card> */}
                  <PreviewCard className="card-bordered reffer-card tot-reffer card1" bodyClass="card-inner-sm">
                    <BlockHead className="pb-1">
                      <BlockContent>
                        <BlockTitle className="text-uppercase text-1" tag="h6">
                          Total Withdrawal
                        </BlockTitle>
                      </BlockContent>
                    </BlockHead>
                    <div className="reffer-div w-100 cardRel mb-0">
                      <div className="reffer">
                        <h5 style={{ color: "#f4bd0e" }}>${totalCountData.withdrawnAmount.toFixed(2) || 0}</h5>
                      </div>
                    </div>
                  </PreviewCard>
                </Col>
                <Col lg="3" className="mb-3">
                  <PreviewCard className="card-bordered reffer-card tot-reffer card1" bodyClass="card-inner-sm">
                    <BlockHead className="pb-1">
                      <BlockContent>
                        <BlockTitle className="text-uppercase text-1" tag="h6">
                          {" "}
                          DEPOSIT Balance
                        </BlockTitle>
                      </BlockContent>
                    </BlockHead>
                    <div className="reffer-div w-100 cardRel mb-0">
                      <div className="reffer">
                        <h5 style={{ color: "#f4bd0e" }}>${totalCountData.depositBalance.toFixed(2) || 0}</h5>
                      </div>
                    </div>
                  </PreviewCard>
                </Col>
                <Col lg="3" className="mb-3">
                  {/* <Card className="card-bordered pricing text-center">
                <div className="pricing-body">
                  <div className="pricing-media">
                    <img src={img2} alt="" />
                  </div>
                  <div className="pricing-title overview">
                    <h5 className="title">$1000.00</h5>
                    <p className="amount">
                      Total Invest
                    </p>
                  </div>
                </div>
              </Card> */}

                  <PreviewCard className="card-bordered reffer-card tot-reffer card1" bodyClass="card-inner-sm">
                    <BlockHead className="pb-1">
                      <BlockContent>
                        <BlockTitle className="text-uppercase text-1" tag="h6">
                          Total Deposit
                        </BlockTitle>
                      </BlockContent>
                    </BlockHead>
                    <div className="reffer-div w-100 cardRel mb-0">
                      <div className="reffer">
                        <h5 style={{ color: "#f4bd0e" }}>${totalCountData.totalDepositBalance.toFixed(2) || 0}</h5>
                      </div>
                    </div>
                  </PreviewCard>
                </Col>
                <Col lg="3" className="mb-3">
                  {/* <Card className="card-bordered pricing text-center">
                <div className="pricing-body">
                  <div className="pricing-media">
                    <img src={img5} alt="" />
                  </div>
                  <div className="pricing-title overview">
                    <h5 className="title">$1000.00</h5>
                    <p className="amount">
                      Total payout
                    </p>
                  </div>
                </div>
              </Card> */}

                  <PreviewCard className="card-bordered reffer-card tot-reffer card1" bodyClass="card-inner-sm">
                    <BlockHead className="pb-1">
                      <BlockContent>
                        <BlockTitle className="text-uppercase text-1" tag="h6">
                          {" "}
                          Total Invest
                        </BlockTitle>
                      </BlockContent>
                    </BlockHead>
                    <div className="reffer-div w-100 cardRel mb-0">
                      <div className="reffer">
                        <h5 style={{ color: "#f4bd0e" }}>${totalCountData.totalInvested.toFixed(2) || 0}</h5>
                      </div>
                    </div>
                  </PreviewCard>
                </Col>
                {/* <Col lg="3" className="mb-3">
              <Card className="card-bordered pricing text-center">
                <div className="pricing-body">
                  <div className="pricing-media">
                    <img src={img6} alt="" />
                  </div>
                  <div className="pricing-title overview">
                    <h5 className="title">$1000.00</h5>
                    <p className="amount">
                      Total Ticket
                    </p>
                  </div>
                </div>
              </Card>
            </Col> */}
                <Col lg="3" className="mb-3">
                  {/* <Card className="card-bordered pricing text-center">
                <div className="pricing-body">
                  <div className="pricing-media">
                    <img src={img7} alt="" />
                  </div>
                  <div className="pricing-title overview">
                    <h5 className="title">$1000.00</h5>
                    <p className="amount">
                      Total Refferal Bonus
                    </p>
                  </div>
                </div>
              </Card> */}
                  <PreviewCard className="card-bordered reffer-card tot-reffer card1" bodyClass="card-inner-sm">
                    <BlockHead className="pb-1">
                      <BlockContent>
                        <BlockTitle className="text-uppercase text-1" tag="h6">
                          TOTAL REFERRAL BONUS
                        </BlockTitle>
                      </BlockContent>
                    </BlockHead>
                    <div className="reffer-div w-100 cardRel mb-0">
                      <div className="reffer">
                        <h5 style={{ color: "#f4bd0e" }}>${totalCountData.totalReferralAmount.toFixed(2) || 0}</h5>
                      </div>
                    </div>
                  </PreviewCard>
                </Col>
                <Col lg="3" className="mb-3">
                  {/* <Card className="card-bordered pricing text-center">
                <div className="pricing-body">
                  <div className="pricing-media">
                    <img src={img7} alt="" />
                  </div>
                  <div className="pricing-title overview">
                    <h5 className="title">$1000.00</h5>
                    <p className="amount">
                      Total Refferal Bonus
                    </p>
                  </div>
                </div>
              </Card> */}
                  {/* here refer total fund added by user under the team */}
                  <PreviewCard className="card-bordered reffer-card tot-reffer card1" bodyClass="card-inner-sm">
                    <BlockHead className="pb-1">
                      <BlockContent>
                        <BlockTitle className="text-uppercase text-1" tag="h6">
                          Total Downline Invested Amount
                        </BlockTitle>
                      </BlockContent>
                    </BlockHead>
                    <div className="reffer-div w-100 cardRel mb-0">
                      <div className="reffer">
                        <h5 style={{ color: "#f4bd0e" }}>${totalCountData.totalReferralUserFund.toFixed(2) || 0}</h5>
                      </div>
                    </div>
                  </PreviewCard>
                </Col>
                <Col lg="3" className="mb-3">
                  {/* <Card className="card-bordered pricing text-center">
                <div className="pricing-body">
                  <div className="pricing-media">
                    <img src={img7} alt="" />
                  </div>
                  <div className="pricing-title overview">
                    <h5 className="title">$1000.00</h5>
                    <p className="amount">
                      Total Refferal Bonus
                    </p>
                  </div>
                </div>
              </Card> */}

                  <PreviewCard className="card-bordered reffer-card tot-reffer card1" bodyClass="card-inner-sm">
                    <BlockHead className="pb-1">
                      <BlockContent>
                        <BlockTitle className="text-uppercase text-1" tag="h6">
                          Direct Team Trade Volume
                        </BlockTitle>
                      </BlockContent>
                    </BlockHead>
                    <div className="reffer-div w-100 cardRel mb-0">
                      <div className="reffer">
                        <h5 style={{ color: "#f4bd0e" }}>${totalCountData.totalDirectAmount.toFixed(2) || 0}</h5>
                      </div>
                    </div>
                  </PreviewCard>
                </Col>
              </Row>
            </Block>
            {/* Bottom Cards: Trade Profit & Referral Link (50% / 50% width on Desktop) */}
            <Block className="pb-4">
              <Row className="g-gs">
                {/* 5. Trade Profit Card */}
                <Col lg="6" md="12">
                  <div className="bottom-info-card h-100">
                    <div className="card-top-head">
                      <div className="card-top-icon gold">
                        <Icon name="trend-up" />
                      </div>
                      <div className="card-top-texts">
                        <h5>Trade Profit</h5>
                        <p>Daily performance and credit status</p>
                      </div>
                    </div>

                    <div className="profit-details-content">
                      {todayInterest ? (
                        <>
                          <div className="profit-stat-row">
                            <span className="stat-label">Trading Day</span>
                            <span className="stat-val">{todayInterest.day}</span>
                          </div>

                          {isCreditedTimeReached(todayInterest.time) ? (
                            <>
                              <div className="profit-stat-row">
                                <span className="stat-label">Profit Rate</span>
                                <span className="stat-val gold">+{todayInterest.interest}%</span>
                              </div>
                              <div className="profit-stat-row">
                                <span className="stat-label">Credited At</span>
                                <span className="stat-val">{formatTime(new Date(todayInterest.time))}</span>
                              </div>
                            </>
                          ) : (
                            <div className="profit-message-box">
                              <Icon name="clock" /> Today's trade profit will be revealed soon.
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-white mb-0">No data for today.</p>
                      )}
                    </div>
                  </div>
                </Col>

                {/* 6. Referral Link Card */}
                <Col lg="6" md="12">
                  <div className="bottom-info-card h-100">
                    <div className="card-top-head">
                      <div className="card-top-icon green">
                        <Icon name="users" />
                      </div>
                      <div className="card-top-texts">
                        <h5>Referral Link</h5>
                        <p>Invite a Friend and Share the Benefits!</p>
                      </div>
                    </div>

                    <div className="referral-action-content">
                      {userReferralLink.linkStatus ? (
                        <div className="referral-copy-box">
                          <Input
                            className="form-control"
                            value={`${process.env.REACT_APP_PUBLIC_URL}/auth-refer-register?referral=${userReferralLink.userName}`}
                            onChange={({ target: { value } }) => setValue(value)}
                            disabled
                          />
                          <CopyToClipboard text={value} onCopy={() => setCopied(true)}>
                            <Button className="copy-btn">
                              <Icon name="copy" /> Copy
                            </Button>
                          </CopyToClipboard>
                        </div>
                      ) : (
                        <div className="referral-alert-box">
                          <Icon name="alert-circle" /> Activate referral link only after plan purchase
                        </div>
                      )}

                      {copied && (
                        <div className="copied-toast-pill">
                          <Icon name="check-circle-fill" /> Link copied to clipboard!
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </Block>
            {/* Graphs Section (Main Line, Weekly Line, Daily Yield Bar) */}
            <Block className="mb-4">
              <GraphWrapper
                graphData={graphData?.graphData || graphData || []}
                weeklyInterest={filterWeeklyInterestTillNow(weeklyInterest)}
              />
            </Block>
            <Block>
              <Row>
                {/* <Col lg='6'>
              <div className="tradingview-widget-container">
                <div className="tradingview-widget-container__widget"></div>
              </div>
            </Col> */}
                {/* <Col lg="6">
                  <PreviewCard className="card-bordered reffer-card" bodyClass="card-inner-lg">
                    <BlockHead>
                      <BlockContent>
                        <BlockTitle tag="h5">Referral link</BlockTitle>
                        <BlockDes>
                          <p>Invite a Friend and Share the Benefits!</p>
                        </BlockDes>
                      </BlockContent>
                    </BlockHead>
                    <div className="reffer-div w-100">
                      <div className="reffer">
                        <Input
                          className="input"
                          value={value}
                          onChange={({ target: { value } }) => setValue(value)}
                          disabled
                        />
                        <CopyToClipboard text={value} onCopy={() => setCopied(true)}>
                          <Button color="primary" className="buy-btn">
                            <Icon name="copy" />
                          </Button>
                        </CopyToClipboard>
                      </div>
                      {copied ? <p>Link copied!</p> : null}
                    </div>
                  </PreviewCard>
                </Col> */}
              </Row>
            </Block>
          </>
        )}
      </Content>
    </>
  );
};

export default CryptoHomePage;
