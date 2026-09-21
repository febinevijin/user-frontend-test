import React, { useState } from "react";
import { Collapse } from "reactstrap";

const Accordion = ({ className, variation, ...props }) => {
  const [isOpen, setIsOpen] = useState("1");

  const toggleCollapse = (param) => {
    if (param === isOpen) {
      setIsOpen("0");
    } else {
      setIsOpen(param);
    }
  };

  return (
    <div className={[`accordion${variation ? " accordion-s" + variation : ""}${className ? " " + className : ""}`]}>
      <div className="accordion-item">
        <div className={[`accordion-head${isOpen !== "1" ? " collapsed" : ""}`]} onClick={() => toggleCollapse("1")}>
          <h6 className="title">What is the minimum investment amount required to get started?</h6>
          <span className="accordion-icon"></span>
        </div>
        <Collapse className="accordion-body" isOpen={isOpen === "1" ? true : false}>
          <div className="accordion-inner">
            <p>Our platform accommodates a range of investors, and the minimum investment amount is designed to be accessible. The specific minimum may vary, so please check our platform or contact our support team for the most up-to-date information.</p>
          </div>
        </Collapse>
      </div>
      <div className="accordion-item">
        <div className={[`accordion-head${isOpen !== "2" ? " collapsed" : ""}`]} onClick={() => toggleCollapse("2")}>
          <h6 className="title">How do I initiate a withdrawal, and how long does it take?</h6>
          <span className="accordion-icon"></span>
        </div>
        <Collapse className="accordion-body" isOpen={isOpen === "2" ? true : false}>
          <div className="accordion-inner">
            <p>Withdrawing your funds is a straightforward process. Simply log in to your account, navigate to the withdrawal section, and follow the prompts. We take pride in providing fastest withdrawal options, allowing you to access your funds promptly.</p>
          </div>
        </Collapse>
      </div>
      <div className="accordion-item">
        <div className={[`accordion-head${isOpen !== "3" ? " collapsed" : ""}`]} onClick={() => toggleCollapse("3")}>
          <h6 className="title">Are there any hidden fees or charges associated with my investment?</h6>
          <span className="accordion-icon"></span>
        </div>
        <Collapse className="accordion-body" isOpen={isOpen === "3" ? true : false}>
          <div className="accordion-inner">
            <p>Transparency is a cornerstone of our business. We strive to keep our fee structure clear and straightforward. You can find detailed information about any fees or charges in our terms and conditions. Rest assured, we are committed to providing transparent and fair services to our investors.</p>
          </div>
        </Collapse>
      </div>
      <div className="accordion-item">
        <div className={[`accordion-head${isOpen !== "4" ? " collapsed" : ""}`]} onClick={() => toggleCollapse("4")}>
          <h6 className="title">How does your company ensure the security of my investments?</h6>
          <span className="accordion-icon"></span>
        </div>
        <Collapse className="accordion-body" isOpen={isOpen === "4" ? true : false}>
          <div className="accordion-inner">
            <p>We prioritize the security of your investments through a multi-layered approach. Our platform undergoes regular security audits, employs the latest encryption technologies, and adheres to industry best practices. Your investment is very safe trade by our expert trained team members with years of experience in crypto trading fields. Additionally, our expert team continuously monitors and adapts to emerging security threats to ensure the safety of your assets.</p>
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default Accordion;
