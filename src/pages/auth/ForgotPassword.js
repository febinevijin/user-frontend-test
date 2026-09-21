import React, { useState } from "react";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  PreviewCard,
  Icon,
} from "../../components/Component";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/AxiosInstance";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Focus previous input on backspace if current is empty
    if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  // Step 1: Send OTP to email
  const handleSendLink = async (ev) => {
    ev.preventDefault();

    if (step === 1) {
      // Get email value from input
      const emailInput = document.getElementById("default-01");
      const emailValue = emailInput.value.trim();

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailValue) {
        setError("Please enter your email address");
        return;
      }
      if (!emailRegex.test(emailValue)) {
        setError("Please enter a valid email address");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await axiosInstance.post("/auth/forgot-password", {
          email: emailValue,
        });

        if (response.data.success) {
          setEmail(emailValue);
          setStep(2);
          setLoading(false);
        } else {
          setError(response.data.message || "Failed to send OTP");
          setLoading(false);
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to send OTP. Please try again.");
        setLoading(false);
      }
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (ev) => {
    ev.preventDefault();

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/auth/verify-forgot-password-otp", {
        email: email,
        otp: otpValue,
      });

      if (response.data.success) {
        setResetToken(response.data.resetToken);
        setStep(3);
        setLoading(false);
      } else {
        setError(response.data.message || "Invalid OTP. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to verify OTP. Please try again.");
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (ev) => {
    ev.preventDefault();

    // Validate passwords
    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/auth/reset-password", {
        password: newPassword,
        confirmPassword: confirmPassword,
        token: resetToken,
      });

      if (response.data.success) {
        setStep(4);
        setLoading(false);
      } else {
        setError(response.data.message || "Failed to reset password");
        setLoading(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reset password. Please try again.");
      setLoading(false);
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/auth/forgot-password", {
        email: email,
      });

      if (response.data.success) {
        setOtp(new Array(6).fill(""));
        setLoading(false);
        // Focus on first OTP input
        const firstInput = document.querySelector(".otp-input");
        if (firstInput) firstInput.focus();
      } else {
        setError(response.data.message || "Failed to resend OTP");
        setLoading(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to resend OTP. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Head title="Forgot-Password" />
      <Block className="nk-block-middle nk-auth-body  wide-xs">
        <div className="brand-logo pb-4 text-center">
          <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
            <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
            <img className="logo-dark logo-img logo-img-lg" src={LogoDark} alt="logo-dark" />
          </Link>
        </div>
        <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
          <BlockHead>
            <BlockContent>
              {step === 4 ? (
                <div className="text-center pt-4 pb-2">
                  <div className="mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#1ee0ac" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                  </div>
                  <BlockTitle tag="h5">Password Changed</BlockTitle>
                  <BlockDes>
                    <p>Your password has been successfully updated.</p>
                  </BlockDes>
                </div>
              ) : (
                <>
                  <BlockTitle tag="h5">
                    {step === 1 ? "Reset password" : step === 2 ? "Verify OTP" : "Create New Password"}
                  </BlockTitle>
                  <BlockDes>
                    <p>
                      {step === 1
                        ? "If you forgot your password, well, then we'll email you instructions to reset your password."
                        : step === 2
                          ? "Please enter the 6-digit OTP sent to your email address."
                          : "Please enter your new password and confirm it."}
                    </p>
                  </BlockDes>
                </>
              )}
            </BlockContent>
          </BlockHead>

          {error && (
            <div className="mb-3">
              <div className="alert alert-danger alert-icon">
                <Icon name="alert-circle" /> {error}
              </div>
            </div>
          )}

          {step !== 4 && (
            <form>
              {step === 1 && (
                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      Email Address
                    </label>
                  </div>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    id="default-01"
                    placeholder="Enter your email address"
                    disabled={loading}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="otp-input">
                      Enter 6-digit OTP
                    </label>
                    <a
                      href="#edit"
                      onClick={(e) => {
                        e.preventDefault();
                        setStep(1);
                        setError("");
                      }}
                      className="link link-primary link-sm"
                    >
                      Edit Email
                    </a>
                  </div>
                  <div className="d-flex justify-content-between mb-3" style={{ gap: "0.5rem" }}>
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={data}
                        onChange={(e) => handleChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onFocus={(e) => e.target.select()}
                        className="form-control form-control-lg text-center p-0 otp-input"
                        style={{ width: "3rem", height: "3rem", fontSize: "1.25rem" }}
                        disabled={loading}
                      />
                    ))}
                  </div>
                  <div className="form-note-s2 d-flex justify-content-between pt-2">
                    <span>
                      OTP sent to: <strong>{email}</strong>
                    </span>
                    <span>
                      Didn't receive the code?{" "}
                      <a
                        href="#resend"
                        onClick={handleResendOTP}
                        style={{ cursor: loading ? "not-allowed" : "pointer" }}
                      >
                        <strong>{loading ? "Sending..." : "Resend OTP"}</strong>
                      </a>
                    </span>
                  </div>
                </div>
              )}

              {step === 3 && (
                <>
                  <div className="form-group">
                    <div className="form-label-group">
                      <label className="form-label" htmlFor="new-password">
                        New Password
                      </label>
                    </div>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="new-password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <div className="form-label-group">
                      <label className="form-label" htmlFor="confirm-password">
                        Confirm Password
                      </label>
                    </div>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="confirm-password"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-note-s2">
                    <small>Password must be at least 8 characters long.</small>
                  </div>
                </>
              )}

              <div className="form-group mt-4">
                <Button
                  color="primary"
                  size="lg"
                  className="btn-block"
                  onClick={step === 1 ? handleSendLink : step === 2 ? handleVerifyOTP : handleResetPassword}
                  disabled={loading}
                >
                  {loading
                    ? "Loading..."
                    : step === 1
                      ? "Send Reset Link"
                      : step === 2
                        ? "Verify OTP"
                        : "Reset Password"}
                </Button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div className="form-group mt-4">
              <Link to={`${process.env.PUBLIC_URL}/auth-login`}>
                <Button color="primary" size="lg" className="btn-block">
                  Return to Login
                </Button>
              </Link>
            </div>
          )}

          {step !== 4 && (
            <div className="form-note-s2 text-center pt-4">
              <Link to={`${process.env.PUBLIC_URL}/auth-login`}>
                <strong>Return to login</strong>
              </Link>
            </div>
          )}
        </PreviewCard>
      </Block>
      <AuthFooter />
    </>
  );
};
export default ForgotPassword;
