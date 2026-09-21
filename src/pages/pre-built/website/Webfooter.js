import React from 'react';
import Logo from "../../../images/logo.png";
import telegram from "../../../images/icons/tgram.png";
import whatsapp from "../../../images/icons/wp.png";
import insta from "../../../images/icons/instagram.png";
import facebook from "../../../images/icons/facebook-app-symbol.png";
import { Link } from 'react-router-dom';

function Webfooter() {
    return (
        <>
            <section id="footerSection" className="section sectionSpace">

                <div className="innerSection">
                    <div className="footerMain">
                        <a href="/" className="logoDiv">
                            <img src={Logo} alt="" />
                        </a>
                        <div className="menu">
                            <h5 className="title">COMPANY</h5>

                            <Link to={`${process.env.PUBLIC_URL}`}>Home</Link>
                            <Link to={`${process.env.PUBLIC_URL}/plans`}>Plans</Link>
                            <Link to={`${process.env.PUBLIC_URL}/about-us`}>About us</Link>
                            <Link to={`${process.env.PUBLIC_URL}/contact-us`}>Contact us</Link>
                            <Link to={`${process.env.PUBLIC_URL}/terms-and-condition`} className="menuListLink">Terms and Conditions</Link>
                        </div>
                        <div className="menu">
                            <h5 className="title">CONTACT</h5>
                            {/* <a href="tel:" className="menuListLink">971 4529 4233</a> */}
                            <a href="mailto:csfilantrading@gmail.com" className="menuListLink">
                                csfilantrading@gmail.com</a>
                        </div>
                        <div className="menu">
                            <h5 className="title">SOCIAL</h5>
                            <div className="smLink">
                                <a target="_blank" href="https://t.me/+A-F3EFPyjJ1jNDQ1"><img src={telegram} alt="" /></a>
                                <a target="_blank" href="https://youtube.com/@filantrading?si=aa1OPxuj3WrUARbT"><img src={whatsapp} alt="" /></a>
                                <a target="_blank" href="https://www.instagram.com/filantrading?igsh=MWNkMGJlOWZ3azNtOA=="><img src={insta} alt="" /></a>
                                <a target="_blank" href="https://x.com/filantrading?t=LwQSAunIpwZwQ3hvhiu4bw&s=09"><img src={facebook} alt="" /></a>
                            </div>
                        </div>
                    </div>
                    <div className="footerBottom">
                        <p className="text">
                            © COPYRIGHT 2026 Filan Trading
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Webfooter
