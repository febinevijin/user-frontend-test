import React from "react";
import Head from "../../../layout/head/Head";
import DarkImage from "../../../images/logo-dark2x.png";
import Facebook from "../../../images/socials/facebook.png";
import Twitter from "../../../images/socials/twitter.png";
import Youtube from "../../../images/socials/youtube.png";
import {
  EmailBody,
  EmailBodyContent,
  EmailFooter,
  EmailHeader,
  EmailWrapper,
} from "../../../components/Component";

function Support() {
  return (
    <>
      <Head title="Home"></Head>
      <EmailWrapper>
        <EmailHeader>
          <a
            href="#logo"
            onClick={(ev) => {
              ev.preventDefault();
            }}
          >
            <img className="email-logo" src={DarkImage} alt="logo" />
          </a>
        </EmailHeader>
        <EmailBody>
          <EmailBodyContent className="p-3 p-sm-5">
            <p>
              <strong>Hello User</strong>,
            </p>
            <p>Stay ahead in the world of trading by subscribing to our Telegram channel! Receive real-time updates, expert insights, and exclusive market analysis straight to your device. Whether you're a seasoned trader or just starting out, our channel provides valuable information to help you make informed decisions. Don't miss out on the latest opportunities—join our Telegram community today!</p>
            <p>
              Hope you'll enjoy the experience, we're here if you have any questions, drop us a line at
              <a href="mailto:csfilantrading@gmail.com" className="menuListLink">
                csfilantrading@gmail.com</a> anytime.{" "}
            </p>
            <div className="btnDiv">
              <a href="https://t.me/+A-F3EFPyjJ1jNDQ1" target="blank" className="teleBtn btn btn-primary text-white me-3 mt-4">Subscribe Now</a>
              <a href="http://t.me/csfilantrading" target="blank" className="teleBtn btn btn-primary text-white mt-4">Chat With us</a>
            </div>
          </EmailBodyContent>
        </EmailBody>
        <EmailFooter>
          <p className="email-copyright-text text-white">
            Copyright © 2026 Filan Trade. All rights reserved.
          </p>
          <ul className="email-social">
            <li>
              <a
                href="#socials"
                onClick={(ev) => {
                  ev.preventDefault();
                }}
              >
                <img src={Facebook} alt="" />
              </a>
            </li>
            <li>
              <a
                href="#socials"
                onClick={(ev) => {
                  ev.preventDefault();
                }}
              >
                <img src={Twitter} alt="" />
              </a>
            </li>
            <li>
              <a
                href="#socials"
                onClick={(ev) => {
                  ev.preventDefault();
                }}
              >
                <img src={Youtube} alt="" />
              </a>
            </li>
          </ul>
        </EmailFooter>
      </EmailWrapper>
    </>
  )
}

export default Support
