import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Content from "../../../layout/content/Content";
import { Card, Badge, Modal, ModalBody, Row, Col } from "reactstrap";
import Head from "../../../layout/head/Head";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  InputSwitch,
  Button,
} from "../../../components/Component";
import UserProfileAside from "./UserProfileAside";
import { Link } from "react-router-dom";
import axiosInstance from "../../../utils/AxiosInstance";
import useShowToast from "../../hooks/useShowToast";

const UserProfileSettingPage = () => {
  const KYCStatusEnum = {
    PENDING: "0",
    APPROVED: "1",
    REJECTED: "2",
    NOTSUBMITTED: "4",
  };
  const { userInfo, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [kyc, setKyc] = useState();
  const [sm, updateSm] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Add confirmPassword state
  const [isPasswordsMatch, setIsPasswordsMatch] = useState(true); // State to track password match
  const showToast = useShowToast();
  // function to change the design view under 990 px
  const viewChange = () => {
    if (window.innerWidth < 990) {
      setMobileView(true);
    } else {
      setMobileView(false);
      updateSm(false);
    }
  };

  const [modal, setModal] = useState(false);
  const [passState, setPassState] = useState(false);

  useEffect(() => {
    viewChange();
    window.addEventListener("load", viewChange);
    window.addEventListener("resize", viewChange);
    document.getElementsByClassName("nk-header")[0].addEventListener("click", function () {
      updateSm(false);
    });
    return () => {
      window.removeEventListener("resize", viewChange);
      window.removeEventListener("load", viewChange);
    };
  }, []);

  // Handle the password change
  const handleChangePassword = async () => {
    if (newPassword === confirmPassword) {
      try {
        const { data } = await axiosInstance.put(
          "/user/profile/change/password",
          { oldPassword, newPassword },
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`, // Add token from context
            },
          }
        );

        if (data.success) {
          showToast("Done", "Password changed successfully. Please login again.", "success");
          setModal(false); // Close the modal after successful change
          logout(); // Call logout function after successful password change
        }
      } catch (error) {
        console.error("Error changing password:", error);

        showToast("Error", "Failed to change password. Please check your old password or try again.", "danger");
      }
    } else {
      showToast("Error", "Password do not match", "danger");
      return;
    }
  };

  // Function to check if passwords match
  const checkPasswordsMatch = () => {
    if (newPassword !== confirmPassword) {
      setIsPasswordsMatch(false);
    } else {
      setIsPasswordsMatch(true);
    }
  };

  const fetchKyc = async () => {
    try {
      const { data } = await axiosInstance.get("/user/kyc/get", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`, // Assuming the token is in the adminInfo context
        },
      });

      setKyc(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching kyc details:", error);
      setLoading(false);
    }
  };
 useEffect(() => {
   if (userInfo.token) {
     fetchKyc();
   }
 }, [userInfo.token]);

  useEffect(() => {
    checkPasswordsMatch();
  }, [newPassword, confirmPassword]);

  return (
    <React.Fragment>
      <Head title="Profile-Setting"></Head>
      <Content>
        <Card className="card-bordered">
          <div className="card-aside-wrap">
            <div
              className={`card-aside card-aside-left user-aside toggle-slide toggle-slide-left toggle-break-lg ${
                sm ? "content-active" : ""
              }`}
            >
              <UserProfileAside updateSm={updateSm} sm={sm} />
            </div>
            <div className="card-inner card-inner-lg">
              {sm && mobileView && <div className="toggle-overlay" onClick={() => updateSm(!sm)}></div>}
              <BlockHead size="lg">
                <BlockBetween>
                  <BlockHeadContent>
                    <BlockTitle tag="h4" className="text-white">
                      Security Settings
                    </BlockTitle>
                    <BlockDes>
                      <p className="text-white">These settings will help you to keep your account secure.</p>
                    </BlockDes>
                  </BlockHeadContent>
                  <BlockHeadContent className="align-self-start d-lg-none">
                    <Button
                      className={`toggle btn btn-icon btn-trigger mt-n1 ${sm ? "active" : ""}`}
                      onClick={() => updateSm(!sm)}
                    >
                      <Icon name="menu-alt-r"></Icon>
                    </Button>
                  </BlockHeadContent>
                </BlockBetween>
              </BlockHead>

              <Block>
                <Card className="card-bordered">
                  <div className="card-inner-group">
                    <div className="card-inner">
                      <div className="between-center flex-wrap g-3">
                        <div className="nk-block-text">
                          <h6 className="text-white">Change Password</h6>
                          <p className="text-white">Set a unique password to protect your account.</p>
                        </div>
                        <div className="nk-block-actions flex-shrink-sm-0">
                          <ul className="align-center flex-wrap flex-sm-nowrap gx-3 gy-2">
                            <li className="order-md-last">
                              <Button onClick={() => setModal(true)} color="primary">
                                Change Password
                              </Button>
                            </li>
                            <li>
                              <em className="text-date fs-12px text-white">
                                Last changed: <span>Oct 2, 2019</span>
                              </em>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="between-center flex-wrap flex-md-nowrap g-3">
                        <div className="nk-block-text">
                          <h6 className="text-white">
                            KYC Auth &nbsp;{" "}
                            {/* <Badge color="success" className="ml-0">
                              Enabled
                            </Badge> */}
                            {kyc?.kycStatus === KYCStatusEnum.NOTSUBMITTED && (
                              <Badge color="primary" className="ml-0">
                                not submitted
                              </Badge>
                            )}
                            {kyc?.kycStatus === KYCStatusEnum.PENDING && (
                              <Badge color="warning" className="ml-0">
                                Pending
                              </Badge>
                            )}
                            {kyc?.kycStatus === KYCStatusEnum.APPROVED && (
                              <Badge color="success" className="ml-0">
                                Approved
                              </Badge>
                            )}
                            {kyc?.kycStatus === KYCStatusEnum.REJECTED && (
                              <Badge color="danger" className="ml-0">
                                Rejected
                              </Badge>
                            )}
                          </h6>
                          <p className="text-white">
                            To complete your KYC authentication with Filan Trading, simply upload your personal
                            document, such as an ID card or passport, through their secure platform.{" "}
                          </p>
                        </div>
                        <div className="nk-block-actions">
                          {!loading && kyc ? (
                            <>
                              {kyc?.kycStatus === KYCStatusEnum.NOTSUBMITTED && (
                                <Link to={`${process.env.PUBLIC_URL}/kyc-add`} className="btn bg-primary text-white">
                                  Apply
                                </Link>
                              )}
                              {kyc?.kycStatus === KYCStatusEnum.PENDING && (
                                <button className="btn bg-warning text-white" disabled>
                                  Pending
                                </button>
                              )}
                              {kyc?.kycStatus === KYCStatusEnum.APPROVED && (
                                <button className="btn bg-success text-white" disabled>
                                  Verified
                                </button>
                              )}
                              {kyc?.kycStatus === KYCStatusEnum.REJECTED && (
                                <Link to={`${process.env.PUBLIC_URL}/kyc-add`} className="btn bg-danger text-white">
                                  Apply Again
                                </Link>
                              )}
                            </>
                          ) : (
                            <button className="btn bg-secondary text-white" disabled>
                              Loading...
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Block>

              {/* Change Password Modal */}
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
                    <h5 className="title">Change Password</h5>
                    <div className="tab-content mt-4">
                      <Row>
                        <Col md="12">
                          <div className="form-group">
                            <div className="form-label-group">
                              <label className="form-label" htmlFor="old-password">
                                Enter Old Password
                              </label>
                            </div>
                            <div className="form-control-wrap">
                              <a
                                href="#old-password"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setPassState(!passState);
                                }}
                                className={`form-icon lg form-icon-right passcode-switch ${
                                  passState ? "is-hidden" : "is-shown"
                                }`}
                              >
                                <Icon name="eye" className="passcode-icon icon-show"></Icon>

                                <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                              </a>
                              <input
                                type={passState ? "text" : "password"}
                                id="old-password"
                                placeholder="Enter your old password"
                                className="form-control-lg form-control"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                              />
                            </div>
                          </div>
                        </Col>
                        <Col md="12">
                          <div className="form-group">
                            <div className="form-label-group">
                              <label className="form-label" htmlFor="new-password">
                                Enter New Password
                              </label>
                            </div>
                            <div className="form-control-wrap">
                              <a
                                href="#new-password"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setPassState(!passState);
                                }}
                                className={`form-icon lg form-icon-right passcode-switch ${
                                  passState ? "is-hidden" : "is-shown"
                                }`}
                              >
                                <Icon name="eye" className="passcode-icon icon-show"></Icon>

                                <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                              </a>
                              <input
                                type={passState ? "text" : "password"}
                                id="new-password"
                                placeholder="Enter your new password"
                                className="form-control-lg form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                            </div>
                          </div>
                        </Col>
                        <Col md="12">
                          <div className="form-group">
                            <div className="form-label-group">
                              <label className="form-label" htmlFor="confirm-password">
                                Confirm New Password
                              </label>
                            </div>
                            <div className="form-control-wrap">
                              <a
                                href="#confirm-password"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setPassState(!passState);
                                }}
                                className={`form-icon lg form-icon-right passcode-switch ${
                                  passState ? "is-hidden" : "is-shown"
                                }`}
                              >
                                <Icon name="eye" className="passcode-icon icon-show"></Icon>

                                <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                              </a>
                              <input
                                type={passState ? "text" : "password"}
                                id="confirm-password"
                                placeholder="Confirm your new password"
                                className="form-control-lg form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                              />
                            </div>
                            {!isPasswordsMatch && <small className="text-danger">Passwords do not match!</small>}
                          </div>
                        </Col>
                        <Col md="12">
                          <Button
                            color="primary"
                            className="btn-block mt-4"
                            onClick={handleChangePassword}
                            disabled={!isPasswordsMatch || !oldPassword || !newPassword}
                          >
                            Change Password
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </ModalBody>
              </Modal>
            </div>
          </div>
        </Card>
      </Content>
    </React.Fragment>
  );
};

export default UserProfileSettingPage;
