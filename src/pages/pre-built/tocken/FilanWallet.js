import React, { useContext, useState, useEffect } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import {
  Block,
  BlockBetween,
  BlockContent,
  BlockHead,
  BlockTitle,
  Icon,
  PreviewCard,
} from "../../../components/Component";
import { Alert, Button, Col, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import axiosInstance from "../../../utils/AxiosInstance";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";

function FilanWallet() {
  const { userInfo } = useContext(AuthContext);
  const [walletBalances, setWalletBalances] = useState({
    currentBalance: 0,
    depositBalance: 0,
  });
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [selectedBalanceType, setSelectedBalanceType] = useState("mainBalance");
  const [addAmount, setAddAmount] = useState("");

  // State for token data
  const [tokenMainBalance, setTokenMainBalance] = useState(0);
  const [tokenInfo, setTokenInfo] = useState({
    tokenMainBalance: 0,
    tokenRate: 0,
    canPurchaseTokens: 0,
  });
  const [purchasedTokens, setPurchasedTokens] = useState(0);
  const [loading, setLoading] = useState({
    balance: false,
    tokenInfo: false,
    purchasedTokens: false,
  });

  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenConv, setIsOpenConv] = useState(false);

  // Token purchase state
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [calculatedTokens, setCalculatedTokens] = useState(0);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Toggle modals
  const toggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchWalletBalances();
    }
  };

  const toggleConv = () => {
    setIsOpenConv(!isOpenConv);
    if (!isOpenConv) {
      setPurchaseAmount("");
      setCalculatedTokens(0);
    }
  };

  // Fetch token main balance
  const fetchTokenMainBalance = async () => {
    try {
      setLoading((prev) => ({ ...prev, balance: true }));
      const { data } = await axiosInstance.get("/user/token/balance", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setTokenMainBalance(data.data.tokenMainBalance);
    } catch (error) {
      console.error("Error fetching token main balance:", error);
      toast.error("Failed to load token balance");
    } finally {
      setLoading((prev) => ({ ...prev, balance: false }));
    }
  };

  // Fetch token info
  const fetchTokenInfo = async () => {
    try {
      setLoading((prev) => ({ ...prev, tokenInfo: true }));
      const { data } = await axiosInstance.get("/user/token/token-info", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setTokenInfo(data.data);
    } catch (error) {
      console.error("Error fetching token info:", error);
      toast.error("Failed to load token info");
    } finally {
      setLoading((prev) => ({ ...prev, tokenInfo: false }));
    }
  };

  // Fetch purchased tokens
  const fetchPurchasedTokens = async () => {
    try {
      setLoading((prev) => ({ ...prev, purchasedTokens: true }));
      const { data } = await axiosInstance.get("/user/token/purchased-tokens", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setPurchasedTokens(data.data.totalPurchasedTokens);
    } catch (error) {
      console.error("Error fetching purchased tokens:", error);
      toast.error("Failed to load purchased tokens");
    } finally {
      setLoading((prev) => ({ ...prev, purchasedTokens: false }));
    }
  };

  // Fetch wallet balances
  const fetchWalletBalances = async () => {
    try {
      setLoadingBalances(true);
      const { data } = await axiosInstance.get("/user/token/wallet-balances", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setWalletBalances(data.data);
    } catch (error) {
      console.error("Error fetching wallet balances:", error);
      toast.error("Failed to load wallet balances");
    } finally {
      setLoadingBalances(false);
    }
  };

  // Calculate tokens based on amount and rate
  useEffect(() => {
    if (purchaseAmount && !isNaN(purchaseAmount) && tokenInfo.tokenRate) {
      const amount = parseFloat(purchaseAmount);
      if (amount > 0) {
        // Changed calculation: amount / rate = tokens
        const tokens = amount / tokenInfo.tokenRate;
        setCalculatedTokens(tokens);
      } else {
        setCalculatedTokens(0);
      }
    } else {
      setCalculatedTokens(0);
    }
  }, [purchaseAmount, tokenInfo.tokenRate]);

  // Handle add fund
  const handleAddFund = async (e) => {
    e.preventDefault();

    const amountNumber = parseFloat(addAmount);

    if (isNaN(amountNumber) || amountNumber <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const availableBalance =
      selectedBalanceType === "mainBalance" ?  walletBalances.depositBalance : walletBalances.currentBalance ;

    if (amountNumber < 5) {
     alert("Minimum amount should be $5.");
      return;
    }
    if (amountNumber > availableBalance) {
     
      
      alert("Entered amount exceeds available balance.");
      return;
    }

    try {
      const { data } = await axiosInstance.post(
        "/user/token/add-fund",
        {
          amount: amountNumber,
          fromBalanceType: selectedBalanceType,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      alert("Fund added successfully!");
      setIsOpen(false);
      setAddAmount("");
      setSelectedBalanceType("mainBalance");

      // Refresh data
      await Promise.all([fetchWalletBalances(), fetchTokenMainBalance(), fetchTokenInfo(), fetchPurchasedTokens()]);
    } catch (error) {
      console.error("Add fund error:", error);
      alert(error.response?.data?.message || "Failed to add fund.");
    }
  };

  // Handle token purchase
  const handlePurchaseToken = async (e) => {
    e.preventDefault();
    setIsPurchasing(true);

    const amountNumber = parseFloat(purchaseAmount);

    // Validate input
    if (isNaN(amountNumber)) {
      alert("Please enter a valid amount.");
      setIsPurchasing(false);
      return;
    }

    if (amountNumber <= 0) {
      alert("Amount must be greater than 0.");
      setIsPurchasing(false);
      return;
    }

    // Check balance
    if (amountNumber > tokenMainBalance) {
      alert("Insufficient balance for this purchase.");
      setIsPurchasing(false);
      return;
    }

    try {
      const { data } = await axiosInstance.post(
        "/user/token/purchase-token",
        { amount: amountNumber },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (data.success) {
        toast.success(`Successfully purchased ${data.data.tokensPurchased} tokens!`);
        setIsOpenConv(false);
        setPurchaseAmount("");

        // Refresh all data
        await Promise.all([fetchTokenMainBalance(), fetchTokenInfo(), fetchPurchasedTokens()]);
      } else {
       alert(data.message || "Failed to complete purchase");
      }
    } catch (error) {
      console.error("Purchase token error:", error);
     alert(error.response?.data?.message || "Failed to complete purchase");
    } finally {
      setIsPurchasing(false);
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchTokenMainBalance();
    fetchTokenInfo();
    fetchPurchasedTokens();
  }, []);

  return (
    <>
      <Head title="Filan Wallet"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween className="g-3">
            <BlockContent>
              <BlockTitle className="text-white">Filan Wallet</BlockTitle>
            </BlockContent>
            <Button color="primary" onClick={toggleConv}>
              Buy Tokens
            </Button>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Row>
            <Col lg="4" className="mb-3">
              <PreviewCard className="card-bordered reffer-card tot-reffer card1" bodyClass="card-inner-sm">
                <BlockHead className="pb-1">
                  <BlockContent className="d-flex align-items-center justify-content-between">
                    <BlockTitle className="text-uppercase text-1 mb-0" tag="h6">
                      MAIN BALANCE
                    </BlockTitle>
                    <Button color="primary" onClick={toggle}>
                      Add Fund
                    </Button>
                  </BlockContent>
                </BlockHead>
                <div className="reffer-div w-100 cardRel mb-0">
                  <div className="reffer mt-3">
                    <h3 style={{ color: "#f4bd0e" }}>{loading.balance ? "..." : `$ ${tokenMainBalance.toFixed(2)}`}</h3>
                  </div>
                </div>
              </PreviewCard>
            </Col>

            <Col lg="4" className="mb-3">
              <PreviewCard className="card-bordered reffer-card tot-reffer card1" bodyClass="card-inner-sm">
                <BlockHead className="pb-1">
                  <BlockContent className="d-flex align-items-center justify-content-between">
                    <BlockTitle className="text-uppercase text-1 mb-0" tag="h6">
                      Filan Token Value
                    </BlockTitle>
                  </BlockContent>
                </BlockHead>
                <div className="reffer-div w-100 cardRel mb-0">
                  <div className="reffer mt-2">
                    <h4 style={{ color: "#f4bd0e" }}>{loading.tokenInfo ? "..." : "$ "+tokenInfo.tokenRate}</h4>
                  </div>
                </div>
              </PreviewCard>
            </Col>

            <Col lg="4" className="mb-3">
              <PreviewCard className="card-bordered reffer-card tot-reffer card1" bodyClass="card-inner-sm">
                <BlockHead className="pb-1">
                  <BlockContent className="d-flex align-items-center justify-content-between">
                    <BlockTitle className="text-uppercase text-1 mb-0" tag="h6">
                      Available Filan Tokens
                    </BlockTitle>
                  </BlockContent>
                </BlockHead>
                <div className="reffer-div w-100 cardRel mb-0">
                  <div className="reffer mt-2">
                    <h4 style={{ color: "#f4bd0e" }}>{loading.purchasedTokens ? "..." : purchasedTokens.toFixed(2)}</h4>
                  </div>
                </div>
              </PreviewCard>
            </Col>
          </Row>
        </Block>
      </Content>

      {/* Add Fund Modal */}
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add Fund</ModalHeader>
        <ModalBody>
          <table className="table bordered">
            <tbody>
              <tr>
                <td className="p-2">
                  <p className="m-0 text-black">Current Balance</p>
                  <h3 style={{ color: "#f4bd0e" }}>
                    ${loadingBalances ? "..." : walletBalances.currentBalance.toFixed(2)}
                  </h3>
                </td>
                <td className="p-2">
                  <p className="m-0 text-black">Deposit Balance</p>
                  <h3 style={{ color: "#f4bd0e" }}>
                    ${loadingBalances ? "..." : walletBalances.depositBalance.toFixed(2)}
                  </h3>
                </td>
              </tr>
            </tbody>
          </table>
          <form onSubmit={handleAddFund}>
            <div className="form-group">
              <Label htmlFor="balanceType" className="form-label">
                Add Fund From
              </Label>
              <div className="form-control-wrap mb-3">
                <div className="form-control-select">
                  <Input
                    type="select"
                    id="balanceType"
                    value={selectedBalanceType}
                    onChange={(e) => setSelectedBalanceType(e.target.value)}
                  >
                    <option value="mainBalance">Deposit Balance (${walletBalances.depositBalance.toFixed(2)})</option>
                    <option value="earnedBalance">Current Balance (${walletBalances.currentBalance.toFixed(2)})</option>
                  </Input>
                </div>
              </div>
            </div>

            <div className="form-group">
              <Label htmlFor="addAmount" className="form-label">
                Add Amount
              </Label>
              <div className="form-control-wrap">
                <Input
                  id="addAmount"
                  placeholder="Enter Amount"
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  min="1"
                  step="0.01"
                />
              </div>
              <p className="limit cardRel text-primary mt-1">
                <b>Minimum: $5</b>
              </p>
            </div>

            <div className="form-group d-flex justify-content-end mt-5">
              <Button color="light" onClick={toggle} className="me-3">
                Cancel
              </Button>
              <Button color="primary" type="submit" disabled={!addAmount || isNaN(addAmount)}>
                Add Funds
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>

      {/* Buy Tokens Modal */}
      <Modal isOpen={isOpenConv} toggle={toggleConv}>
        <ModalHeader toggle={toggleConv}>Buy Filan Tokens</ModalHeader>
        <ModalBody>
          <form onSubmit={handlePurchaseToken}>
            <Alert color="info">
              <h6 className="mb-2">Conversion Information</h6>
              <p className="mb-1">Current rate: {tokenInfo.tokenRate || 0} USD = 1 token</p>
              <p className="mb-0">Your available balance: ${tokenMainBalance.toFixed(2)}</p>
            </Alert>

            <div className="form-group mt-4">
              <Label htmlFor="purchaseAmount" className="form-label">
                Amount to Spend (USD)
              </Label>
              <div className="form-control-wrap">
                <Input
                  id="purchaseAmount"
                  placeholder="Enter amount in USD"
                  type="number"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                />
              </div>
              {purchaseAmount && !isNaN(purchaseAmount) && (
                <div className="mt-3">
                  <p className="mb-1">You will receive:</p>
                  <h4 style={{ color: "#f4bd0e" }}>{calculatedTokens.toFixed(4)} tokens</h4>
                </div>
              )}
            </div>

            <div className="form-group d-flex justify-content-end mt-5">
              <Button color="light" onClick={toggleConv} className="me-3" disabled={isPurchasing}>
                Cancel
              </Button>
              <Button color="primary" type="submit" disabled={!purchaseAmount || isNaN(purchaseAmount) || isPurchasing}>
                {isPurchasing ? "Processing..." : "Confirm Purchase"}
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
}

export default FilanWallet;