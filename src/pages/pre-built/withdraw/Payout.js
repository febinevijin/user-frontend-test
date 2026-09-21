import React, { useContext, useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import { BlockBetween, BlockDes, BlockContent, BlockHead, BlockTitle, RSelect, Icon } from "../../../components/Component";
import { Button, Card, Input } from "reactstrap";
import Head from "../../../layout/head/Head";
import axiosInstance from "../../../utils/AxiosInstance";
import { AuthContext } from "../../../context/AuthContext";
import useShowToast from "../../hooks/useShowToast";
import CopyToClipboard from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";

export const defaultOptions = [
  // { value: "0", label: "Main Balance", isDisabled: true },
  { value: "1", label: "CURRENT BALANCE" },
];

const Payout = () => {
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const showToast = useShowToast();
  const [wallet, setWallet] = useState({});
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isWithdrawAllowed, setIsWithdrawAllowed] = useState(false);
  const [min, setMin] = useState(10);
  const [max, setMax] = useState(10000);
  const [amount, setAmount] = useState(0);
  const [accountBalanceType, setAccountBalanceType] = useState("1"); // default to interest Balance
  const [withdrawCharge, setWithdrawCharge] = useState(0); // Store withdraw charge percentage
 const navigate = useNavigate();
  const fetchWallet = async () => {
    try {
      const { data } = await axiosInstance.get("/user/profile/wallet", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`, // Assuming the token is in the adminInfo context
        },
      });
      setWallet(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching wallet details:", error);
      setLoading(false);
    }
  };
  const fetchWithdrawDays = async () => {
    try {
      const { data } = await axiosInstance.get("/user/withdraw-day/list", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`, // Assuming the token is in the adminInfo context
        },
      });
      setDays(data.data.allowedDays);
      setWithdrawCharge(data.data.withdrawCharge); // Store withdraw charge
      setLoading(false);
    } catch (error) {
      console.error("Error fetching withdraw days:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchWithdrawDays();
  }, [userInfo.token,userInfo.withdrawAddress]);

  // Convert numeric days to string names
  const getDayName = (dayIndex) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[dayIndex];
  };

  // Check if today matches allowed withdraw days
  const checkWithdrawAllowed = () => {
    const todayIndex = new Date().getDay(); // Get the current day index (0 = Sunday, 6 = Saturday)
    setIsWithdrawAllowed(days.includes(todayIndex.toString())); // Compare with allowedDays from the API
  };

  useEffect(() => {
    if (days.length > 0) {
      checkWithdrawAllowed();
    }
  }, [days]);

  const handleContinueToBuy = async () => {
    // Check if withdraw address is present
    if (!userInfo.withdrawAddress || userInfo.withdrawAddress.trim() === "") {
      showToast("Warning", "Withdraw address is missing. Please add it in your profile.", "danger");
      navigate("/profile-setting"); // Navigate to profile-setting page
      return;
    }
    if (amount < min || amount > max) {
      showToast("Warning", "amount must be match the limit", "danger");
      return; // Simple validation to check if amount is valid
    }

    try {
      const response = await axiosInstance.post(
        "/user/withdraw/request",
        {
          amount,
          accountBalanceType,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      // After successful API call, update the wallet and reset inputs
      if (response.data.success) {
        await fetchWallet(); // Refresh wallet data
        setAmount(0); // Clear amount input
        setAccountBalanceType("0"); // Reset account balance type to default

        showToast("Done", "Withdrawal request successful!", "success");
      }
    } catch (error) {
      console.error("Error during withdrawal request:", error);

      showToast("Error", "There was an error processing your withdrawal request.", "danger");
      showToast("Error", error.response.data.message, "danger");
    }
  };

  const chargeAmount = (withdrawCharge / 100) * amount;
  const payableAmount = amount - chargeAmount;

  return (
    <>
      <Head title="Withdraw"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween className="g-3">
            <BlockContent>
              <BlockTitle className="text-white">Withdraw</BlockTitle>
              <BlockDes className="text-soft">
                <p className="text-white">Payout funds easily and securely</p>
              </BlockDes>
            </BlockContent>
          </BlockBetween>
        </BlockHead>

        <div className="deposit-card">
          <Card className="deposit-card-div">
            <div className="reffer-div w-100">
              <label className="form-label text-white text-break">Wallet Address{userInfo?.withdrawAddress}</label>

              <div className="reffer">
                <Input className="input" value={userInfo?.withdrawAddress || ""} readOnly />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label text-white">Select Wallet</label>
              <RSelect
                options={defaultOptions}
                defaultValue={defaultOptions[0]} // Set default value to "Interest Balance - 0$"
                onChange={(selectedOption) => setAccountBalanceType(selectedOption.value)}
              />
            </div>

            <div className="input-div">
              <label className="text-white">Amount to withdraw</label>
              <input
                className="form-control form-control-xl"
                placeholder="Enter amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
              />
              <span>USD</span>
            </div>
            <p className="limit">
              Transaction Limit : {min}$ - {max}$
            </p>

            <Button color="primary" className="buy-btn" disabled={!isWithdrawAllowed} onClick={handleContinueToBuy}>
              <span>Continue to withdraw</span>
            </Button>
          </Card>

          {/* Wallet Balances */}
          <div className="deposit-card-div">
            <table className="depo-table">
              <tbody>
                {/* <tr>
                  <td>Main Balance</td>
                  <td> - </td>
                  <td>{wallet?.mainBalance !== undefined ? `${wallet.mainBalance}$` : "0$"}</td>
                </tr> */}
                <tr>
                  <td>Current Balance</td>
                  <td> - </td>
                  {/* If wallet.interestBalance is not available, show a default value (e.g., 0) */}
                  <td>{wallet?.earnedBalance !== undefined ? `${wallet.earnedBalance.toFixed(2)}$` : "0$"}</td>
                </tr>
                <tr>
                  <td>Amount</td>
                  <td> - </td>
                  {/* Replace 100$ with the actual value if needed */}
                  <td>{amount && amount !== "" ? amount.toFixed(2) : 0}$</td>
                </tr>
                <tr>
                  <td>Charge ({withdrawCharge.toFixed(2)}%)</td> {/* Show percentage */}
                  <td> - </td>
                  {/* Replace 0$ with the actual charge value if needed */}
                  <td>{chargeAmount > 0 ? chargeAmount.toFixed(2) : 0}$</td> {/* Display charge amount */}
                </tr>
                {/* <tr>
                  <td>Payable</td>
                  <td> - </td>
                  <td>{payableAmount > 0 ? payableAmount.toFixed(2) : 0}$</td>
                </tr> */}
                <tr>
                  <td>Amount Will Be Credited</td>
                  <td> - </td>
                  <td>{payableAmount > 0 ? payableAmount.toFixed(2) : 0}$</td>
                </tr>
                <tr>
                  <td>Network</td>
                  <td> - </td>
                  {/* Replace BNB Smart Chain (BEP20) with dynamic data if necessary */}
                  <td>BNB Smart Chain (BEP20)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Withdraw Days Section */}
          <div className="deposit-card-div mt-3 days tot-reffer">
            <h5 className="text-white cardRel">Allowed Withdrawal Days:</h5>
            <ul className="cardRel">
              {days.length > 0 ? (
                days.map((day, index) => (
                  <li className="text-white" key={index}>
                    {getDayName(day)}
                  </li>
                ))
              ) : (
                <li className="text-white">No withdraw days available</li>
              )}
            </ul>
          </div>

          <div className="deposit-card-div mt-3 days tot-reffer">
            <ul className="cardRel">
              <li className="text-white list">Withdrawal amount will be credited on Monday or Tuesday.</li>
              <li className="text-white list">
                The maximum time it takes for your withdrawal amount to reach your wallet address is by 11:30 PM on
                Tuesday
              </li>
            </ul>
          </div>
        </div>
      </Content>
    </>
  );
};

export default Payout;
