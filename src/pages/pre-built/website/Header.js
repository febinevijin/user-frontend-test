import React, { useState } from 'react';
import logo from '../../../images/logo.png';
import { Icon } from '../../../components/Component';
import { Link, useNavigate } from 'react-router-dom';

function Header() {

    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);

    const [color, setColor] = useState(false);
    const changeColor = () => {
        if (window.scrollY >= 80) {
            setColor(true);
        } else {
            setColor(false);
        }
    };

    const navigate = useNavigate();

    const handleLoginClick = () => {
        closeMenu();
        navigate(`${process.env.PUBLIC_URL}/auth-login`);
    };

    const handleRegisterClick = () => {
        closeMenu();
        navigate(`${process.env.PUBLIC_URL}/auth-register`);
    };

    window.addEventListener('scroll', changeColor);

    const closeMenu = () => setClick(false);

    return (
        <>
            <div className={color ? 'header header-bg' : 'header'}>
                <nav className="navbar">
                    <a href="/" className="logo">
                        <img src={logo} alt="logo" />
                    </a>
                    <div className="hamburger" onClick={handleClick}>
                        {click ? (
                            <Icon name="cross" />
                        ) : (
                            <Icon name="menu-circled" />
                        )}
                    </div>
                </nav>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                        <li className="nav-item">
                            <Link to={`${process.env.PUBLIC_URL}`} onClick={closeMenu}>
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={`${process.env.PUBLIC_URL}/plans`} onClick={closeMenu}>
                                Plans
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={`${process.env.PUBLIC_URL}/about-us`} onClick={closeMenu}>
                                About us
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={`${process.env.PUBLIC_URL}/contact-us`} onClick={closeMenu}>
                                Contact us
                            </Link>
                        </li>
                        <div className="btnDivMob">
                            <button className="logIn" onClick={handleLoginClick}>
                                Login
                            </button>
                            <button className="register" onClick={handleRegisterClick}>
                                Register
                            </button>
                        </div>
                    </ul>

                    <div className="btnDiv">
                            <button className="logIn" onClick={handleLoginClick}>
                                Login
                            </button>
                            <button className="register" onClick={handleRegisterClick}>
                                Register
                            </button>
                        </div>
            </div>
        </>
    );
}

export default Header;
