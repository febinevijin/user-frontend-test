import React from "react";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import { Block, BlockDes, BlockHead, BlockHeadContent, BlockTitle, PreviewCard } from "../../components/Component";

const Terms = ({ ...props }) => {
  return (
    <>
      <Head title="Terms &amp; Conditions" />
      <Content>
        <div className="content-page wide-md m-auto">
          <BlockHead size="lg" wide="xs" className="mx-auto">
            <BlockHeadContent className="text-center">
              <BlockTitle tag="h2" className="fw-normal text-white">
                Terms &amp; Policy
              </BlockTitle>
              <BlockDes>
                <p className="lead text-white">
                Welcome to Filan Trading Company. These Terms and Conditions govern your use of our digital asset trading platform and related services, including the trading of cryptocurrencies and our proprietary token, the FILAN TOKEN. By accessing or using our services, you agree to comply with and be bound by these Terms. If you do not agree, you must immediately discontinue use of the platform.
                </p>
              </BlockDes>
            </BlockHeadContent>
          </BlockHead>
          <Block>
            <PreviewCard className="card-bordered">
              <div className="entry">
                <h3 className="mb-3 text-white">Terms and Conditions</h3>
                <p className="text-white">Filan Trading Company is dedicated to delivering the best trading experience to users worldwide. Our primary mission is to promote, develop, and achieve global listing of the FILAN TOKEN across reputable exchanges and platforms. In line with this mission, we reserve the right to amend, update, or revise these Terms at any time, with or without prior notice. Continued use of our services following any changes constitutes acceptance of the revised Terms, and it is the responsibility of all users to stay informed.</p>

                <p className="text-white">Your privacy and data security are of utmost importance to us. We do not misuse, sell, rent, or share your personal information. Any data collected is used solely for necessary functions such as user verification, transaction processing, and compliance with regulatory obligations. All data is managed with robust, industry-standard security protocols. Please refer to our Privacy Policy for more information.</p>

                <p className="text-white">Users must be at least 18 years old and legally permitted to use cryptocurrency trading services in their jurisdiction. You agree to provide accurate information during registration and to maintain the confidentiality of your login credentials. The Company may suspend or terminate access if these Terms are violated, if unlawful or suspicious activity is detected, or if required by law.</p>

                <p className="text-white">The platform enables users to trade supported digital assets, including the FILAN TOKEN, and offers tools such as real-time market data and secure wallet management. However, cryptocurrency trading carries inherent risks. The Company is not liable for losses arising from market volatility, user decisions, or third-party issues. We recommend users consult a financial advisor and trade responsibly.</p>
                
                <p className="text-white">The FILAN TOKEN is the official digital asset of Filan Trading Company. We reserve full control over its technical development, listing strategy, and related business decisions. Any platform or policy updates supporting this mission may lead to changes in these Terms.</p>

                <p className="text-white">All content and intellectual property on the platform, including logos, designs, and software, are owned by Filan Trading Company or its licensors. Unauthorized use is strictly prohibited.</p>
                
                <p className="text-white">If you have any questions or concerns about these Terms, please contact us at:</p>
                <a className="text-white" href="mailto:csfilantrading@gmail.com">Email: csfilantrading@gmail.com</a><br />
                <a className="text-white" href="www.filantrading.com">Website: www.filantrading.com</a>
              </div>
            </PreviewCard>
          </Block>
        </div>
      </Content>
    </>
  );
};

export default Terms;
