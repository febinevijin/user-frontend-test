import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { Alert } from "reactstrap";
import {
  Block,
  Col,
  Row,
  Icon,
} from "../../../components/Component";
import { Card } from "reactstrap";
import axiosInstance from "../../../utils/AxiosInstance";

function Plan() {

  const [plans, setPlans] = useState([]);
  const [currentInterest, setCurrentInterest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {

      try {
        const { data } = await axiosInstance.get(`/website/plan-list`);
        setPlans(data.data.plans || []);
        console.log(data);

        setCurrentInterest(data.data.interest?.currentInterest || null);
      } catch (err) {
        setError("Failed to fetch plans. Please try again.");
        console.log(err);

      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

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
  return (
    <>
      <Head title="Plan"></Head>
      <Content>
      <h2 className="webPlanHeading">Our Most Popular Active Plans</h2>
      {/* <p className="text">Select our most popular active plan for flexibility and proven results.</p> */}
        <Block className="webPlan">
          {loading ? (
            <p className="loadingText">Loading plans...</p>
          ) : error ? (
            <Alert color="danger">{error}</Alert>
          ) : plans.length === 0 ? (
            <Alert color="warning">No plans available at the moment.</Alert>
          ) : (
            <Row className="g-gs">
              {plans.map((plan) => (
                <Col className="webPlanCardSection" sm={6} md={6} key={plan._id}>
                  <Card className={`card-bordered pricing webPlanHead ${plan.featured ? "recommend" : ""}`}>
                    <div className="pricing-head">
                      <div className="pricing-title">
                        <h4 className="card-title title">{plan.planName}</h4>
                        <p className="sub-text">Amount : {plan.priceType === "0" ? plan.fixedAmount : plan.minAmount +" - "+ plan.maxAmount}</p>
                      </div>
                      <div className="card-text">
                        <h4 className="h4 fw-500 profitPer">
                        Daily Profit (0.5% - 10%)
                          {/* {plan.return === "1" ? `${plan.maturity} Days` : "Lifetime"} Plan */}
                        </h4>
                        <h4 className="list">
                          Plan duration : 6 Months
                        </h4>
                        {/* <p className="note text-success">*earn upto 500% profit of br your <br /> deposit</p> */}
                        {/* <h4 className="list">
                          <Icon name="check-circle" /> Capital Back:{" "}
                          {plan.capitalBack ? <Alert color="success">Yes</Alert> : <Alert color="danger">No</Alert>}
                        </h4> */}
                        {/* <h4 className="list">
                          <Icon name="check-circle" /> Return Type: <Alert color="success">{getReturnType(plan.return)}</Alert>
                        </h4> */}
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Block>
      </Content>
    </>
  )
}

export default Plan