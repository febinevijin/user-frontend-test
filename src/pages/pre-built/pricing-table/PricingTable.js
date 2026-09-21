import React, { useContext, useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { pricingTableData } from "./PricingTableData";
import { Alert, Button, Label, Modal, ModalBody } from "reactstrap";
import {
  BlockBetween,
  BlockDes,
  Block,
  BlockContent,
  BlockHead,
  BlockTitle,
  Col,
  Row,
  Icon,
} from "../../../components/Component";
import { Card } from "reactstrap";
import axiosInstance from "../../../utils/AxiosInstance";
import { AuthContext } from "../../../context/AuthContext";
import useShowToast from "../../hooks/useShowToast";

const PricingTable = () => {
  const { userInfo } = useContext(AuthContext); // Use your actual context
  const [plans, setPlans] = useState([]);
  const [currentInterest, setCurrentInterest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null); // Store selected plan details
  const [amount, setAmount] = useState(""); // Store user-entered amount
  const [amountError, setAmountError] = useState("");
  const showToast = useShowToast();

  const accountBalanceTypeEnum = {
    DEPOSIT: "0",
    EARNED: "1",
  };
  const [accountBalanceType, setAccountBalanceType] = useState(accountBalanceTypeEnum.DEPOSIT);
  useEffect(() => {
    const fetchPlans = async () => {
      const token = userInfo.token;

      try {
        const { data } = await axiosInstance.get(`/user/plan/list`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        });
        setPlans(data.data.plans || []);
        // console.log(data.data.plans || []);
        setCurrentInterest(data.data.interest?.currentInterest || null);
      } catch (err) {
        setError("Failed to fetch plans. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [userInfo]);
  const getPriceType = (priceType) => {
    return priceType === "0" ? "Fixed" : "Range";
  };

  const getAccrualType = (accrual) => {
    switch (accrual) {
      case "0":
        return "Every Hour";
      case "1":
        return "Every Day";
      case "2":
        return "Every Week";
      case "3":
        return "Every Month";
      case "4":
        return "Every Year";
      default:
        return "Unknown";
    }
  };

  const getReturnType = (returnType) => {
    return returnType === "0" ? "Lifetime" : "Period";
  };

  // Function to handle the amount input for range plans
  const handleAmountChange = (e) => {
    const enteredAmount = e.target.value;
    setAmount(enteredAmount);

    // Validate amount if it's a range priceType
    if (selectedPlan?.priceType === "1") {
      const { minAmount, maxAmount } = selectedPlan;
      if (enteredAmount < minAmount || enteredAmount > maxAmount) {
        setAmountError(`Amount must be between ${minAmount} and ${maxAmount}`);
      } else {
        setAmountError(""); // Clear error if amount is valid
      }
    }
  };

  // Function to open modal and select plan
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan); // Set the selected plan details
    setAmount(plan.priceType === "0" ? plan.fixedAmount : ""); // Set fixed amount or clear for range
    setModal(true); // Open the modal
  };

  // Function to handle Save Changes button click
  const handleSaveChanges = async () => {
    if (selectedPlan && !amountError) {
      try {
        setLoading(true); // Start loading
        const token = userInfo.token;
        const amountInvested = parseFloat(amount); // Ensure amountInvested is a float

        // Call the API
        const { data } = await axiosInstance.post(
          `/user/plan/purchase/${selectedPlan._id}`,
          { amountInvested, accountBalanceType },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        // Handle success (e.g., show a success message or redirect)
        console.log("Plan purchased successfully");
        showToast("Done", "Plan purchased successfully", "success");
        setModal(false);
      } catch (err) {

        // Handle error (e.g., show an error message)
        // console.error("Failed to purchase plan", err.response.data.message);
        showToast("Failed to purchase plan", err.response.data.message, "danger");
        setModal(false)
      } finally {
        setModal(false)
        setLoading(false); // Stop loading
      }
    }
  };

  return (
    <>
      <Head title="Plan"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween className="g-3">
            <BlockContent>
              <BlockTitle className="text-white">Investment Plans</BlockTitle>
              <BlockDes className="text-soft">
                <p className="text-white">Choose your best plans and make good profits every day.</p>
              </BlockDes>
            </BlockContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          {loading ? (
            <p className="text-white">Loading plans...</p>
          ) : error ? (
            <Alert color="danger">{error}</Alert>
          ) : plans.length === 0 ? (
            <Alert color="warning">No plans available at the moment.</Alert>
          ) : (
            <Row className="g-gs">
              {plans.map((plan) => (
                <Col sm={6} md={4} xxl={3} key={plan._id}>
                  <Card className={`card-bordered card1 pricing ${plan.featured ? "recommend" : ""}`}>
                    <div className="pricing-head cardRel">
                      <div className="pricing-title">
                        <h4 className="card-title title text-white">{plan.planName}</h4>
                        {/* <p className="sub-text">price type : {plan.priceType === "0" ? "fixed" : "range"}</p> */}
                        <p className="sub-text text-white">
                          Amount : {plan.priceType === "0" ? plan.fixedAmount : plan.minAmount + " - " + plan.maxAmount}{" "}
                          $
                        </p>
                      </div>
                      <div className="card-text">
                        <h4 className="h4 fw-500 profitPer">
                          Daily Profit (0.5% - 5%)
                          {/* {plan.return === "1" ? `${plan.maturity} Days` : "Lifetime"} Plan */}
                        </h4>
                        {/* <h4 className="list">
                          <Icon name="check-circle" /> Accrual: {getAccrualType(plan.acural)}
                        </h4>
                        <h4 className="list">
                          <Icon name="check-circle" /> Capital Back:{" "}
                          {plan.capitalBack ? <Alert color="success">Yes</Alert> : <Alert color="danger">No</Alert>}
                        </h4> */}
                        <h4 className="list text-white">Plan Duration : {plan.maturity} months</h4>
                        {/* <p className="note text-success">
                          *earn upto 500% profit of br your <br /> deposit
                        </p> */}
                      </div>
                      <div className="pricing-action">
                        <Button color="primary" className="text-white" outline onClick={() => handlePlanSelect(plan)}>
                          Choose this plan
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Block>

        {/* Modal for Plan Selection */}
        <Modal isOpen={modal} className="modal-dialog-centered" size="md" toggle={() => setModal(false)}>
          <a
            href="#dropdownitem"
            onClick={(ev) => {
              ev.preventDefault();
              setModal(false);
            }}
            className="close"
          >
            <Icon name="cross-sm"></Icon>
          </a>
          <ModalBody>
            <div className="p-2">
              <h5 className="title">Choose Plan</h5>

              {selectedPlan && (
                <div className="tab-content">
                  <Row>
                    {/* Plan Name */}
                    <Col md="12" className="mt-4">
                      <div className="form-group">
                        <Label className="form-label" htmlFor="amnt">
                          {selectedPlan.priceType === "0" ? "Plan Amount ($)" : "Enter Plan Amount ($)"}
                        </Label>
                        <div className="form-control-wrap">
                          <input
                            type="number"
                            id="amnt"
                            name="amnt"
                            placeholder="Enter Amount"
                            className="form-control"
                            value={amount}
                            onChange={handleAmountChange}
                            disabled={selectedPlan.priceType === "0"} // Disable input if fixed
                          />
                        </div>
                        {/* Display error for invalid amount */}
                        {amountError && <span className="text-danger mt-1">{amountError}</span>}
                      </div>
                    </Col>

                    {/* Show Min and Max for Range Price Type */}
                    {selectedPlan.priceType === "1" && (
                      <>
                        <Col md="6">
                          <span>
                            Min Amount: <b>{selectedPlan.minAmount}</b>
                          </span>
                        </Col>
                        <Col md="6">
                          <span>
                            Max Amount: <b>{selectedPlan.maxAmount}</b>
                          </span>
                        </Col>
                      </>
                    )}

                    <Col md="12" className="mt-3">
                      <div className="form-group">
                        <Label className="form-label" htmlFor="balanceType">
                          Select Balance Type
                        </Label>
                        <div className="form-control-wrap">
                          <select
                            id="balanceType"
                            name="balanceType"
                            className="form-control"
                            value={accountBalanceType}
                            onChange={(e) => setAccountBalanceType(e.target.value)}
                          >
                            <option value={accountBalanceTypeEnum.DEPOSIT}>Deposit Balance</option>
                            <option value={accountBalanceTypeEnum.EARNED}>Current Balance</option>
                          </select>
                        </div>
                      </div>
                    </Col>

                    {/* Action Buttons */}
                    <Col size="12">
                      <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2 justify-content-end mt-3">
                        <li>
                          <a
                            href="#dropdownitem"
                            onClick={(ev) => {
                              ev.preventDefault();
                              setModal(false);
                            }}
                            className="link link-light"
                          >
                            Cancel
                          </a>
                        </li>
                        <li>
                          <Button
                            color="primary"
                            size="md"
                            disabled={selectedPlan?.priceType === "1" && !!amountError} // Disable if invalid
                            onClick={handleSaveChanges}
                          >
                            {loading ? "Processing..." : "Purchase"}
                          </Button>
                        </li>
                      </ul>
                    </Col>
                  </Row>
                </div>
              )}
            </div>
          </ModalBody>
        </Modal>
      </Content>
    </>
  );
};

export default PricingTable;
