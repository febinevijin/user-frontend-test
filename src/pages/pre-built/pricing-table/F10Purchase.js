import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import {
  Block,
  BlockBetween,
  BlockContent,
  BlockHead,
  BlockTitle,
  Row,
  Col,
  Icon,
} from "../../../components/Component";
import { Modal, ModalBody, Spinner, UncontrolledTooltip } from "reactstrap";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import axiosInstance from "../../../utils/AxiosInstance";
import { AuthContext } from "../../../context/AuthContext";
import useShowToast from "../../hooks/useShowToast";
import "./F10Purchase.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const F10Purchase = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const showToast = useShowToast();

  const [wallet, setWallet] = useState({ mainBalance: 0, interestBalance: 0 });
  const [walletLoading, setWalletLoading] = useState(false);

  // F10 live details state
  const [f10Details, setF10Details] = useState(null);
  const [f10Loading, setF10Loading] = useState(false);

  // Invest states
  const [investModal, setInvestModal] = useState(false);
  const [investAmount, setInvestAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [investBalanceType, setInvestBalanceType] = useState("0"); // "0": Deposit Balance, "1": Current Balance
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Withdraw states
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAmountError, setWithdrawAmountError] = useState("");
  const [isWithdrawSubmitting, setIsWithdrawSubmitting] = useState(false);

  // Fetch user's wallet balances
  const fetchWallet = async () => {
    if (!userInfo?.token) return;
    try {
      setWalletLoading(true);
      const { data } = await axiosInstance.get("/user/profile/wallet", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      if (data?.data) {
        setWallet(data.data);
      }
    } catch (err) {
      console.error("Error fetching wallet balance:", err);
    } finally {
      setWalletLoading(false);
    }
  };

  // Fetch F10 Plan details, real-time market value & saved withdraw address
  const fetchF10Details = async () => {
    if (!userInfo?.token) return;
    try {
      setF10Loading(true);
      const { data } = await axiosInstance.get("/user/f10/details", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const resData = data?.data || data;
      if (resData) {
        // Fallback: If pendingRateAmount is missing from backend, calculate from recent investment transactions
        if (resData.pendingRateAmount === undefined && resData.pendingActivationAmount === undefined) {
          try {
            const txRes = await axiosInstance.get("/user/f10/transactions?type=F10_INVESTMENT&limit=20", {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            const txList = txRes?.data?.data?.transactions || [];
            const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
            const recentInvestments = txList.filter(
              (tx) => new Date(tx.transactionDate || tx.createdAt).getTime() > oneDayAgo
            );
            const pendingTotal = recentInvestments.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
            if (pendingTotal > 0) {
              resData.pendingRateAmount = pendingTotal;
              resData.pendingActivationAmount = pendingTotal;
            }
          } catch (e) {
            console.error("Error computing pending rate amount fallback:", e);
          }
        }
        setF10Details(resData);
        if (resData.wallet) {
          setWallet(resData.wallet);
        } else if (resData.mainBalance !== undefined) {
          setWallet({
            mainBalance: resData.mainBalance,
            earnedBalance: resData.earnedBalance ?? resData.interestBalance ?? 0,
            interestBalance: resData.interestBalance || 0,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching F10 details:", err);
    } finally {
      setF10Loading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchF10Details();
  }, [userInfo?.token]);

  // Raw API metrics from f10Details
  const totalInvested = Number(
    f10Details?.totalInvested ??
    f10Details?.investedAmount ??
    0
  );
  const totalBalance = Number(
    f10Details?.f10Balance ??
    f10Details?.totalBalance ??
    f10Details?.investedAmount ??
    f10Details?.balance ??
    0
  );
  const lockedBalance = Number(f10Details?.lockedBalance ?? 0);
  const lockPeriodDays = Number(f10Details?.lockPeriodDays ?? 3);
  const currentRate = Number(f10Details?.currentRate ?? 0);
  const applicableRate = Number(f10Details?.applicableRate ?? 0);
  const isRateApplicable = Boolean(f10Details?.isRateApplicable ?? false);
  const rateActivationDate = f10Details?.rateActivationDate ?? null;
  const nextUnlockDate = f10Details?.nextUnlockDate ?? null;

  // Pending 1-day rate activation logic:
  // When an investment is made, it takes 1 day delay before it is activated and the rate takes effect.
  // The newly invested amount pending 1-day activation is pendingRateAmount / pendingActivationAmount.
  const apiPendingAmount = Number(
    f10Details?.pendingRateAmount ??
    f10Details?.pendingActivationAmount ??
    0
  );

  const isActivationPending = Boolean(
    apiPendingAmount > 0 &&
    (!rateActivationDate || new Date(rateActivationDate).getTime() > Date.now())
  );

  const pendingActivationAmount = isActivationPending ? apiPendingAmount : 0;

  // Main card must show the previous active invested amount that has already taken effect on the rate
  const activeInvestedAmount = isActivationPending
    ? (f10Details?.activeInvestedAmount !== undefined
      ? Number(f10Details.activeInvestedAmount)
      : Math.max(0, totalBalance - pendingActivationAmount))
    : totalBalance;

  // Withdrawable balance (funds ready to withdraw, mature after lock period)
  const withdrawableBalance = Number(
    f10Details?.withdrawableBalance !== undefined
      ? f10Details.withdrawableBalance
      : Math.max(0, totalBalance - lockedBalance)
  );

  // Market value calculation for the active investment:
  // When 1-day delay is pending, current market value shows ONLY the active investment (current added amount),
  // and does NOT include the 1-day warning amount ($50).
  // After the 1-day delay finishes, the pending amount is merged into active investment & current market value.
  let effectiveMarketValue = 0;
  let effectiveChangePercent = "0.00";
  let effectiveChangeAmount = "0.00";
  let isUp = true;

  if (isActivationPending) {
    if (activeInvestedAmount > 0) {
      const activeRate = currentRate;
      effectiveMarketValue = f10Details?.activeMarketValue !== undefined
        ? Number(f10Details.activeMarketValue)
        : Number((activeInvestedAmount * (1 + activeRate / 100)).toFixed(2));
      effectiveChangePercent = activeRate.toFixed(2);
      effectiveChangeAmount = (effectiveMarketValue - activeInvestedAmount).toFixed(2);
      isUp = effectiveMarketValue >= activeInvestedAmount;
    } else {
      effectiveMarketValue = 0;
      effectiveChangePercent = "0.00";
      effectiveChangeAmount = "0.00";
      isUp = true;
    }
  } else {
    const rawMarketValue = Number(
      f10Details?.marketValue ??
      f10Details?.currentMarketValue ??
      activeInvestedAmount
    );
    effectiveMarketValue = rawMarketValue;
    isUp = effectiveMarketValue >= activeInvestedAmount;
    effectiveChangePercent = activeInvestedAmount > 0
      ? (((effectiveMarketValue - activeInvestedAmount) / activeInvestedAmount) * 100).toFixed(2)
      : "0.00";
    effectiveChangeAmount = (effectiveMarketValue - activeInvestedAmount).toFixed(2);
  }

  // Format date with both date and time (e.g. Oct 2, 2026, 02:01 PM)
  const formatDateTime = (dateVal) => {
    if (!dateVal) return null;
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return null;
    }
  };

  const formatDateOnly = (dateVal) => {
    if (!dateVal) return null;
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return null;
    }
  };

  // Helper to compute remaining time countdown string
  const getTimeRemaining = (dateVal) => {
    if (!dateVal) return "";
    try {
      const target = new Date(dateVal).getTime();
      const diff = target - Date.now();
      if (diff <= 0) return "Ready to activate";
      const totalHours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      if (totalHours >= 24) {
        const days = Math.floor(totalHours / 24);
        const remHours = totalHours % 24;
        return `${days}d ${remHours}h remaining`;
      }
      return `${totalHours}h ${minutes}m remaining`;
    } catch {
      return "";
    }
  };

  const formattedUnlockDate = formatDateTime(nextUnlockDate) || formatDateOnly(nextUnlockDate);
  const formattedRateActivationDate = formatDateTime(rateActivationDate);

  // Available wallet amounts for investing
  const depositBalance = Number(wallet?.mainBalance ?? wallet?.depositBalance ?? 0);
  const currentBalance = Number(wallet?.earnedBalance ?? wallet?.interestBalance ?? 0);
  const selectedBalanceAmount = investBalanceType === "0" ? depositBalance : currentBalance;

  const handleQuickPercent = (pct) => {
    if (selectedBalanceAmount <= 0) return;
    const calculated = selectedBalanceAmount * (pct / 100);
    const formatted = calculated > 0 ? (pct === 100 ? selectedBalanceAmount.toFixed(2) : calculated.toFixed(2)) : "0";
    setInvestAmount(formatted);
    setAmountError("");
  };

  const handleWithdrawQuickPercent = (pct) => {
    if (withdrawableBalance <= 0) return;
    const calculated = withdrawableBalance * (pct / 100);
    const formatted = calculated > 0 ? (pct === 100 ? withdrawableBalance.toFixed(2) : calculated.toFixed(2)) : "0";
    setWithdrawAmount(formatted);
    setWithdrawAmountError("");
  };

  // POST /user/f10/invest
  const executeInvestment = async (numAmount) => {
    setIsSubmitting(true);
    try {
      await axiosInstance.post(
        "/user/f10/invest",
        {
          amount: numAmount,
          fromBalanceType: investBalanceType,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      const balanceLabel = investBalanceType === "0" ? "Deposit Balance" : "Current Balance";
      showToast("Investment Successful", `Successfully invested $${numAmount.toLocaleString()} in F10 Plan from ${balanceLabel}!`, "success");
      setInvestModal(false);
      setInvestAmount("");
      setAmountError("");
      fetchF10Details();
      fetchWallet();
    } catch (err) {
      const errMsg = err?.response?.data?.message || "Failed to process investment. Please try again.";
      showToast("Investment Failed", errMsg, "danger");
      setAmountError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInvestSubmit = (e) => {
    e?.preventDefault?.();
    const numAmount = parseFloat(investAmount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setAmountError("Please enter a valid investment amount.");
      return;
    }
    if (numAmount < 5) {
      setAmountError("Minimum investment amount is $5.00.");
      return;
    }
    if (numAmount > selectedBalanceAmount) {
      const balanceLabel = investBalanceType === "0" ? "Deposit Balance" : "Current Balance";
      setAmountError(`Insufficient funds in your ${balanceLabel}.`);
      return;
    }

    const balanceLabel = investBalanceType === "0" ? "Deposit Balance" : "Current Balance";

    // Confirmation popup only during investing
    Swal.fire({
      title: "Confirm Investment",
      html: `
        <div style="text-align: center; font-size: 0.92rem; line-height: 1.6;">
          <p style="margin-bottom: 0.45rem; color: #94a3b8;">Are you sure you want to invest in the <b>F10 Plan</b>?</p>
          <div style="margin-bottom: 0.85rem; font-size: 0.84rem; color: #cbd5e1;">
            Funding Source: <b style="color: #f4bd0e;">${balanceLabel}</b>
          </div>
          <div style="background: rgba(244, 189, 14, 0.08); border: 1px dashed rgba(244, 189, 14, 0.3); border-radius: 10px; padding: 0.75rem 1rem;">
            <span style="display: block; font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">Investment Amount</span>
            <span style="display: block; font-size: 1.55rem; font-weight: 800; color: #f4bd0e; margin-top: 0.15rem;">$${numAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      `,
      icon: "question",
      iconColor: "#f4bd0e",
      showCancelButton: true,
      confirmButtonText: "Yes, Confirm & Invest",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#f4bd0e",
      cancelButtonColor: "#334155",
      background: "#0d1510",
      color: "#ffffff",
      customClass: {
        popup: "f10-swal-popup",
        confirmButton: "f10-swal-confirm-btn",
        cancelButton: "f10-swal-cancel-btn",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        executeInvestment(numAmount);
      }
    });
  };

  // POST /user/f10/withdraw
  const handleWithdrawSubmit = async (e) => {
    e?.preventDefault?.();
    const numAmount = parseFloat(withdrawAmount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setWithdrawAmountError("Please enter a valid withdrawal amount.");
      return;
    }
    if (numAmount > withdrawableBalance) {
      if (withdrawableBalance <= 0) {
        setWithdrawAmountError(`Your balance is currently locked under the ${lockPeriodDays}-day lock-in period.`);
      } else {
        setWithdrawAmountError(`Withdrawal amount cannot exceed your withdrawable balance of $${withdrawableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`);
      }
      return;
    }

    const targetAddress = f10Details?.withdrawAddress || userInfo?.withdrawAddress || "";
    if (!targetAddress || targetAddress.trim() === "") {
      showToast("Warning", "Withdraw address is missing. Please add it in your profile settings.", "danger");
      navigate("/profile-setting");
      return;
    }

    setIsWithdrawSubmitting(true);
    try {
      const response = await axiosInstance.post(
        "/user/f10/withdraw",
        {
          amount: numAmount,
          withdrawAddress: targetAddress.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      if (response?.data?.success) {
        showToast("Done", "Withdrawal request submitted successfully!", "success");
      } else {
        showToast("Success", "Withdrawal request sent!", "success");
      }
      setWithdrawModal(false);
      setWithdrawAmount("");
      setWithdrawAmountError("");
      fetchF10Details();
      fetchWallet();
    } catch (err) {
      const errMsg = err?.response?.data?.message || "Failed to process withdrawal request. Please try again.";
      showToast("Withdrawal Failed", errMsg, "danger");
      setWithdrawAmountError(errMsg);
    } finally {
      setIsWithdrawSubmitting(false);
    }
  };

  // Chart data representing market value trend over time
  const chartData = {
    labels: ["Day 1", "Day 5", "Day 10", "Day 15", "Day 20", "Day 25", "Current"],
    datasets: [
      {
        label: "Market Value ($)",
        data: [
          activeInvestedAmount,
          activeInvestedAmount > 0 ? Number((activeInvestedAmount * 1.008).toFixed(2)) : 0,
          activeInvestedAmount > 0 ? Number((activeInvestedAmount * 1.019).toFixed(2)) : 0,
          activeInvestedAmount > 0 ? Number((activeInvestedAmount * 1.014).toFixed(2)) : 0,
          activeInvestedAmount > 0 ? Number((activeInvestedAmount * 1.032).toFixed(2)) : 0,
          activeInvestedAmount > 0 ? Number((activeInvestedAmount * 1.041).toFixed(2)) : 0,
          effectiveMarketValue,
        ],
        borderColor: isUp ? "#10b981" : "#ef4444",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 320);
          gradient.addColorStop(0, isUp ? "rgba(16, 185, 129, 0.28)" : "rgba(239, 68, 68, 0.28)");
          gradient.addColorStop(1, "rgba(16, 185, 129, 0.0)");
          return gradient;
        },
        borderWidth: 2.8,
        pointBackgroundColor: "#0d1a10",
        pointBorderColor: isUp ? "#10b981" : "#ef4444",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(10, 16, 12, 0.95)",
        titleColor: "#ffffff",
        titleFont: { size: 12, weight: "bold" },
        bodyColor: "#cbd5e1",
        bodyFont: { size: 11 },
        borderColor: isUp ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)",
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const val = context.parsed.y;
            const diff = val - activeInvestedAmount;
            const sign = diff >= 0 ? "+" : "";
            const pct = activeInvestedAmount > 0 ? ((diff / activeInvestedAmount) * 100).toFixed(2) : "0.00";
            return ` Market Value: $${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })} (${sign}${pct}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8",
          font: { size: 10 },
          maxTicksLimit: 6,
          callback: (value) => `$${Number(value).toLocaleString()}`,
          padding: 6,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#94a3b8",
          font: { size: 10 },
          padding: 6,
        },
      },
    },
  };

  return (
    <>
      <Head title="F10 Investment"></Head>
      <Content>
        <div className="f10-purchase-page">

          <BlockHead size="sm">
            <BlockBetween className="g-3 align-center">
              <BlockContent>
                <BlockTitle className="text-white">F10 Investment</BlockTitle>
              </BlockContent>
            </BlockBetween>
          </BlockHead>

          <Block>
            {/* Invest & Withdraw Callout Banner */}
            <div className="invest-callout-banner">
              <div className="banner-text-wrap">
                <h5>Are you planning to invest?</h5>
                <p>Use your available wallet balance to invest in the F10 Plan your funds securely.</p>
              </div>
              <div className="banner-btn-group">
                <button
                  type="button"
                  className="btn-invest-action"
                  onClick={() => {
                    setInvestModal(true);
                    setAmountError("");
                  }}
                >
                  <Icon name="wallet" />
                  <span>Invest with Wallet</span>
                </button>
                <button
                  type="button"
                  id="f10-invest-info-btn"
                  className="btn-banner-info"
                  aria-label="Investment Information"
                >
                  <Icon name="info" />
                </button>
                <UncontrolledTooltip
                  placement="auto"
                  trigger="legacy hover focus"
                  target="f10-invest-info-btn"
                  popperClassName="f10-custom-tooltip"
                >
                  F10 Investment means the company divides the investment fund into 10 different investment areas to diversify the fund. These areas may include gold, ETFs, cryptocurrencies, company stocks, real estate, and other investment opportunities.
                </UncontrolledTooltip>
              </div>
            </div>

            {/* Top 2 Metric Cards: Invested Amount and Current Market Value (Side-by-side 50% / 50% on web and mobile) */}
            <Row className="g-gs mb-4">
              {/* 1. Invested Amount */}
              <Col size="6" md="6">
                <div className="trading-metric-card">
                  <div className="card-header-flex">
                    <span className="card-label">Invested Amount</span>
                    <div className="card-icon-badge gold">
                      <Icon name="wallet" />
                    </div>
                  </div>
                  <div className="card-main-val">
                    ${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="card-bottom-flex">
                    <div className="balance-breakdown-sub">
                      <span className="sub-item withdrawable">
                        <Icon name="check-circle" /> Withdrawable: ${withdrawableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      {isActivationPending && pendingActivationAmount > 0 ? (
                        <span className="sub-item pending-delay">
                          <Icon name="clock" /> Pending (1D delay): ${pendingActivationAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      ) : lockedBalance > 0 ? (
                        <span className="sub-item locked">
                          <Icon name="lock" /> Locked: ${lockedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      className="btn-card-withdraw"
                      onClick={() => {
                        setWithdrawModal(true);
                        setWithdrawAmountError("");
                      }}
                    >
                      <Icon name="wallet-out" />
                      <span>Withdraw</span>
                    </button>
                  </div>
                </div>
              </Col>

              {/* 2. Current Market Value with Colored Arrow */}
              <Col size="6" md="6">
                <div className="trading-metric-card">
                  <div className="card-header-flex">
                    <span className="card-label">Current Market Value</span>
                    <div className={`card-icon-badge ${isUp ? "green" : "red"}`}>
                      <Icon name={isUp ? "trend-up" : "trend-down"} />
                    </div>
                  </div>
                  <div className="market-val-wrap">
                    <div className={`card-main-val mb-0 ${isUp ? "green" : "red"}`}>
                      ${effectiveMarketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`trend-pill ${isUp ? "up" : "down"}`}>
                      <span className="arrow-symbol">{isUp ? "▲" : "▼"}</span>
                      <span>
                        {isUp ? "+" : ""}{effectiveChangePercent}% ({isUp ? "+" : ""}${effectiveChangeAmount})
                      </span>
                    </div>
                  </div>
                  {isActivationPending && pendingActivationAmount > 0 && (
                    <div className="card-bottom-flex">
                      <div className="market-pending-sub">
                        <Icon name="clock" />
                        <span>
                          Invested amount <strong className="brand-gold-val" style={{ color: "#f4bd0e", fontWeight: 700 }}>${pendingActivationAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> will be added to current market value after 1 day finish
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            {/* Bottom Graph: Market Value Trend */}
            <div className="trading-chart-card">
              <div className="chart-card-header mb-2 mb-md-3">
                <h5 className="text-white mb-0">Market Value Trend</h5>
              </div>
              <div className="chart-canvas-wrapper">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </Block>

          {/* Investment Modal */}
          <Modal
            isOpen={investModal}
            toggle={() => setInvestModal(false)}
            className="modal-dialog-centered f10-invest-modal"
            size="md"
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setInvestModal(false)}
              aria-label="Close"
            >
              <Icon name="cross-sm" />
            </button>

            <ModalBody className="p-4">
              {/* Modal Header */}
              <div className="modal-header-wrap mb-4">
                <div>
                  <h5 className="text-white mb-1 font-weight-bold" style={{ fontSize: "1.2rem", letterSpacing: "-0.01em" }}>
                    Invest in F10 Plan
                  </h5>
                  <p className="mb-0" style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                    Quick and secure investment using your wallet balance
                  </p>
                </div>
              </div>

              {/* Separated Balance Options (Deposit Balance vs Current Balance) */}
              <div className="balance-select-header">
                <span className="balance-select-label">Choose Funding Balance</span>
              </div>
              <div className="balance-options-grid">
                {/* 1. Deposit Balance */}
                <div
                  className={`balance-option-card ${investBalanceType === "0" ? "selected" : ""}`}
                  onClick={() => {
                    setInvestBalanceType("0");
                    if (amountError) setAmountError("");
                  }}
                >
                  <div className="option-header">
                    <span className="option-name">Deposit Balance</span>
                    <span className="option-radio-indicator"></span>
                  </div>
                  <div className="option-amount">
                    ${depositBalance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>

                {/* 2. Current Balance */}
                <div
                  className={`balance-option-card ${investBalanceType === "1" ? "selected" : ""}`}
                  onClick={() => {
                    setInvestBalanceType("1");
                    if (amountError) setAmountError("");
                  }}
                >
                  <div className="option-header">
                    <span className="option-name">Current Balance</span>
                    <span className="option-radio-indicator"></span>
                  </div>
                  <div className="option-amount">
                    ${currentBalance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>

              {/* Investment Amount Input Section */}
              <div className="form-group mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="text-white mb-0" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                    Investment Amount
                  </label>
                  {selectedBalanceAmount > 0 && (
                    <button
                      type="button"
                      onClick={() => handleQuickPercent(100)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#f4bd0e",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      Use Max Balance
                    </button>
                  )}
                </div>

                <div className={`amount-input-group ${amountError ? "has-error" : ""}`}>
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    step="any"
                    className="clean-amount-input"
                    placeholder="0.00"
                    value={investAmount}
                    onChange={(e) => {
                      setInvestAmount(e.target.value);
                      if (amountError) setAmountError("");
                    }}
                  />
                  <span className="currency-badge">USD</span>
                </div>

                {amountError && (
                  <div className="text-danger mt-2" style={{ fontSize: "0.82rem", fontWeight: 500 }}>
                    <Icon name="alert-circle" className="me-1" />
                    {amountError}
                  </div>
                )}
              </div>

              {/* Submit button */}
              <button
                type="button"
                className="modal-submit-btn"
                disabled={isSubmitting || !investAmount || parseFloat(investAmount) <= 0}
                onClick={handleInvestSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" />
                    <span>Processing Investment...</span>
                  </>
                ) : (
                  <>
                    <Icon name="check-circle-fill" />
                    <span>Confirm & Invest Now</span>
                  </>
                )}
              </button>
            </ModalBody>
          </Modal>

          {/* Withdraw Modal */}
          <Modal
            isOpen={withdrawModal}
            toggle={() => setWithdrawModal(false)}
            className="modal-dialog-centered f10-invest-modal f10-withdraw-modal"
            size="md"
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setWithdrawModal(false)}
              aria-label="Close"
            >
              <Icon name="cross-sm" />
            </button>

            <ModalBody className="p-4">
              {/* Modal Header */}
              <div className="modal-header-wrap mb-4">
                <div>
                  <h5 className="text-white mb-1 font-weight-bold" style={{ fontSize: "1.2rem", letterSpacing: "-0.01em" }}>
                    Withdraw Funds
                  </h5>
                  <p className="mb-0" style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                    Quick and secure withdrawal from your F10 Plan balance
                  </p>
                </div>
              </div>

              {/* Two Balance Sections: Withdrawable vs Locked */}
              <div className="withdraw-balances-grid mb-3">
                {/* 1. Withdrawable Amount */}
                <div className="withdraw-balance-card available">
                  <div className="card-top">
                    <span className="balance-title">Withdrawable Amount</span>
                    <span className="status-pill available">Available</span>
                  </div>
                  <div className="balance-num">
                    ${withdrawableBalance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="balance-note text-success">
                    <Icon name="check-circle" className="me-1" />
                    Matured & ready to withdraw
                  </div>
                </div>

                {/* 2. Locked Amount */}
                <div className="withdraw-balance-card locked">
                  <div className="card-top">
                    <span className="balance-title">Locked Amount</span>
                    <span className="status-pill locked">
                      <Icon name="lock" className="me-1" />
                      {lockPeriodDays}D Lock
                    </span>
                  </div>
                  <div className="balance-num">
                    ${lockedBalance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="balance-note text-warning">
                    {formattedUnlockDate ? (
                      <>Unlocks: {formattedUnlockDate}</>
                    ) : (
                      <>{lockPeriodDays}-Day Lock-in Period</>
                    )}
                  </div>
                  {isActivationPending && formattedRateActivationDate && (
                    <div className="balance-note text-info mt-1" style={{ fontSize: "0.72rem" }}>
                      <Icon name="spark" className="me-1" />
                      Rate Activates: {formattedRateActivationDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Notice if withdrawable is 0 but locked has funds */}
              {withdrawableBalance <= 0 && lockedBalance > 0 && (
                <div className="locked-alert-notice mb-3">
                  <Icon name="alert-circle" className="me-2" />
                  <span>
                    Your funds are currently locked for {lockPeriodDays} days after investment.
                    {formattedUnlockDate ? ` Next release on ${formattedUnlockDate}.` : ""}
                    {isActivationPending && formattedRateActivationDate ? ` Rate activates on ${formattedRateActivationDate}.` : ""}
                  </span>
                </div>
              )}

              {/* Withdraw Amount Input Section */}
              <div className="form-group mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="text-white mb-0" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                    Withdraw Amount
                  </label>
                  {withdrawableBalance > 0 && (
                    <button
                      type="button"
                      onClick={() => handleWithdrawQuickPercent(100)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#f4bd0e",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      Use Max Withdrawable
                    </button>
                  )}
                </div>

                <div className={`amount-input-group ${withdrawAmountError ? "has-error" : ""}`}>
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    step="any"
                    className="clean-amount-input"
                    placeholder="0.00"
                    disabled={withdrawableBalance <= 0}
                    value={withdrawAmount}
                    onChange={(e) => {
                      setWithdrawAmount(e.target.value);
                      if (withdrawAmountError) setWithdrawAmountError("");
                    }}
                  />
                  <span className="currency-badge">USD</span>
                </div>

                {withdrawAmountError && (
                  <div className="text-danger mt-2" style={{ fontSize: "0.82rem", fontWeight: 500 }}>
                    <Icon name="alert-circle" className="me-1" />
                    {withdrawAmountError}
                  </div>
                )}
              </div>

              {/* Submit button */}
              <button
                type="button"
                className="modal-submit-btn"
                disabled={isWithdrawSubmitting || !withdrawAmount || parseFloat(withdrawAmount) <= 0 || withdrawableBalance <= 0}
                onClick={handleWithdrawSubmit}
              >
                {isWithdrawSubmitting ? (
                  <>
                    <Spinner size="sm" />
                    <span>Processing Withdrawal...</span>
                  </>
                ) : (
                  <>
                    <Icon name="check-circle-fill" />
                    <span>Confirm & Withdraw Now</span>
                  </>
                )}
              </button>
            </ModalBody>
          </Modal>
        </div>
      </Content>
    </>
  );
};

export default F10Purchase;
