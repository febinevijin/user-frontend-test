import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="nk-footer glassbg glassborderTop">
      <div className="container-fluid">
        <div className="nk-footer-wrap">
          <div className="nk-footer-copyright text-white">
            {" "}
            &copy; 2026 Filan Trading.
          </div>
          <div className="nk-footer-links">
            <ul className="nav nav-sm">
              <li className="nav-item">
                <Link to={`${process.env.PUBLIC_URL}/pages/terms-policy`} className="nav-link text-white">
                  Terms
                </Link>
              </li>
              <li className="nav-item">
                <Link to={`${process.env.PUBLIC_URL}/pages/faq`} className="nav-link text-white">
                  Help
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link to={`${process.env.PUBLIC_URL}/pages/terms-policy`} className="nav-link text-white">
                  Privacy
                </Link>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
