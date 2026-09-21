import React, { useState, useEffect, useContext } from "react";
import Content from "../../../layout/content/Content";
import { Card } from "reactstrap";
import Head from "../../../layout/head/Head";
import DatePicker from "react-datepicker";
import { Modal, ModalBody } from "reactstrap";
import Swal from "sweetalert2";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  Button,
  RSelect,
} from "../../../components/Component";
import { countryOptions, userData } from "./UserData";
import { getDateStructured } from "../../../utils/Utils";
import UserProfileAside from "./UserProfileAside";
import { AuthContext } from "../../../context/AuthContext";
import axiosInstance from "../../../utils/AxiosInstance";
import useShowToast from "../../hooks/useShowToast";

const handleWarning = () => {
  Swal.fire({
    icon: "warning",
    title: "Editing Restricted",
    text: "Please contact the administrator to request changes.",
    focusConfirm: false,
  });
};

const UserProfileRegularPage = () => {
  const [sm, updateSm] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  const [modalTab, setModalTab] = useState("1");
  const [userInfo, setUserInfo] = useState(userData[0]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    countryCode: "",
    phone: "",
    email: "",
    address: "",
    address2: "",
    state: "",
    country: "",
  });
  const [modal, setModal] = useState(false);
  const [walletAddrressmodal, setwalletAddrressmodal] = useState(false);

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // function to change the design view under 990 px
  const viewChange = () => {
    if (window.innerWidth < 990) {
      setMobileView(true);
    } else {
      setMobileView(false);
      updateSm(false);
    }
  };

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

  // backend developer code
  // **********************************************************
  // AuthContext and Toast hook
  const { userInfo: authUserInfo, setUserInfo: setAuthUserInfo } = useContext(AuthContext);
  const showToast = useShowToast();
  const [withdrawAddress, setWithdrawAddress] = useState("");
  // Populate formData with values from userInfo
  useEffect(() => {
    if (authUserInfo) {
      setFormData({
        firstName: authUserInfo.firstName, // Example mapping
        lastName: authUserInfo.lastName, // Example mapping
        userName: authUserInfo.userName,
        countryCode: authUserInfo.countryCode,
        phone: authUserInfo.phone,
        email: authUserInfo.email,
        address: authUserInfo.address || "", // Use appropriate fields from userData
        state: authUserInfo.state || "",
        country: authUserInfo.country || "",
      });
      setUserInfo(authUserInfo);
    }
  }, [authUserInfo]);

  // edit user details
  // Function to submit the form
  const submitForm = async () => {
    try {
      const response = await axiosInstance.put(
        "/user/profile/edit",
        formData, // Pass formData directly
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authUserInfo.token}`, // Use token from AuthContext
          },
        },
      );

      if (response.data.success) {
        // Show success toast
        showToast("Done", "Profile updated successfully", "success");

        // Update userInfo in AuthContext and localStorage while preserving the token
        const updatedUserInfo = {
          ...authUserInfo, // Preserve existing token and other data
          ...response.data.data, // Merge updated user data
        };

        setAuthUserInfo(updatedUserInfo); // Update context
        localStorage.setItem("filanUserserInfo", JSON.stringify(updatedUserInfo)); // Update localStorage

        setModal(false); // Close the modal after successful update
      } else {
        console.error("Error updating profile:", response.data);
        showToast("Error", "Failed to updating profile", "warning");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Error", "Something went wrong", "danger");
    }
  };

  // update withdraw address
  const handleAddWithdrawAddress = async () => {
    // Validate withdraw address
    if (!withdrawAddress || withdrawAddress.trim() === "") {
      showToast("Error", "Please enter a valid withdraw address", "warning");
      return;
    }

    try {
      // Prepare the payload
      const payload = {
        withdrawAddress: withdrawAddress.trim(),
      };

      // Make the PUT request to update the withdraw address
      const response = await axiosInstance.put("/user/profile/add-withdraw-address", payload, {
        headers: {
          Authorization: `Bearer ${authUserInfo.token}`, // Pass the token in headers
        },
      });

      // Check if the response was successful
      if (response.data.success) {
        // Update the AuthContext with the new userInfo
        const updatedUserInfo = {
          ...authUserInfo,
          ...response.data.data, // Update userInfo with new data from the API response
        };

        setAuthUserInfo(updatedUserInfo); // Update context
        localStorage.setItem("filanUserserInfo", JSON.stringify(updatedUserInfo)); // Update localStorage
        setUserInfo(updatedUserInfo); // Update local userInfo state

        // Show success message
        showToast("Done", "Withdraw address updated successfully", "success");

        // Close the modal after successful update
        setwalletAddrressmodal(false);
        setWithdrawAddress(""); // Clear the input field
      } else {
        showToast("Error", response.data.message || "Failed to update withdraw address", "warning");
      }
    } catch (error) {
      console.error("Error updating withdraw address:", error);
      showToast("Error", error.response?.data?.message || "Something went wrong", "danger");
    }
  };

  // Function to open modal with existing address
  const openWithdrawAddressModal = () => {
    // Pre-fill the input with existing address if available
    if (authUserInfo?.withdrawAddress) {
      setWithdrawAddress(authUserInfo.withdrawAddress);
    } else {
      setWithdrawAddress("");
    }
    setwalletAddrressmodal(true);
  };

  // **********************************************************

  return (
    <React.Fragment>
      <Head title="Profile-Setting"></Head>
      <Content className="scroll">
        <Card className="card-bordered">
          <div className="card-aside-wrap">
            <div
              className={`card-aside card-aside-left user-aside toggle-slide toggle-slide-left toggle-break-lg ${
                sm ? "content-active" : ""
              }`}
            >
              <UserProfileAside updateSm={updateSm} sm={sm} />
            </div>
            <div className="card-inner card-inner-lg w-100">
              {sm && mobileView && <div className="toggle-overlay" onClick={() => updateSm(!sm)}></div>}
              <BlockHead size="lg">
                <BlockBetween className="w-100">
                  <BlockHeadContent>
                    <BlockTitle tag="h4" className="text-white">
                      Personal Information
                    </BlockTitle>
                    <BlockDes>
                      <p className="text-white">
                        Basic info, like your name and address, that you use on Nio Platform.
                      </p>
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
                <div className="nk-data data-list">
                  {/* <div className="data-head">
                    <h6 className="text-dark">Basics</h6>
                  </div> */}
                  <div className="data-item" onClick={() => handleWarning()}>
                    <div className="data-col">
                      <span className="data-label text-white">Filan ID</span>
                      <span className="data-value text-white">{userInfo?.ID}</span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more disable">
                        <Icon name="lock-alt" className="text-white"></Icon>
                      </span>
                    </div>
                  </div>
                  <div className="data-item" onClick={() => handleWarning()}>
                    <div className="data-col">
                      <span className="data-label text-white">Usernme</span>
                      <span className="data-value text-white">{userInfo?.userName}</span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more disable">
                        <Icon name="lock-alt" className="text-white"></Icon>
                      </span>
                    </div>
                  </div>
                  <div className="data-item" onClick={() => setModal(true)}>
                    <div className="data-col">
                      <span className="data-label text-white">Full Name</span>
                      <span className="data-value text-white">
                        {userInfo?.firstName} {userInfo?.lastName}
                      </span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more disable">
                        <Icon name="lock-alt" className="text-white"></Icon>
                      </span>
                    </div>
                  </div>

                  <div className="data-item" onClick={() => handleWarning()}>
                    <div className="data-col">
                      <span className="data-label text-white">Email</span>
                      <span className="data-value text-white">{userInfo?.email}</span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more disable">
                        <Icon name="lock-alt" className="text-white"></Icon>
                      </span>
                    </div>
                  </div>
                  <div className="data-item" onClick={() => handleWarning()}>
                    <div className="data-col">
                      <span className="data-label text-white">Phone Number</span>
                      <span className="data-value text-white">{userInfo?.phone}</span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more disable">
                        <Icon name="lock-alt" className="text-white"></Icon>
                      </span>
                    </div>
                  </div>

                  {/* Updated Withdraw Address Section - Removed lock feature */}
                  <div className="data-item" onClick={openWithdrawAddressModal}>
                    <div className="data-col">
                      <span className="data-label text-white mb-2">Withdraw Address (BNB Smart chain-BEP20)</span>
                      <span className="data-value text-white walletAdd">
                        {userInfo?.withdrawAddress || "No Address Set"}
                      </span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <Icon name="forward-ios" className="text-white"></Icon>
                      </span>
                    </div>
                  </div>

                  <div className="data-item" onClick={() => setModal(true)}>
                    <div className="data-col">
                      <span className="data-label text-white">Address</span>
                      <span className="data-value text-white">
                        {userInfo?.address},<br />
                        {userInfo?.state}, {userInfo?.country}
                      </span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <Icon name="forward-ios" className="text-white"></Icon>
                      </span>
                    </div>
                  </div>
                </div>
              </Block>

              <Modal isOpen={modal} className="modal-dialog-centered" size="lg" toggle={() => setModal(false)}>
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
                    <h5 className="title">Update Profile</h5>
                    <ul className="nk-nav nav nav-tabs">
                      <li className="nav-item">
                        <a
                          className={`nav-link ${modalTab === "1" && "active"}`}
                          onClick={(ev) => {
                            ev.preventDefault();
                            setModalTab("1");
                          }}
                          href="#personal"
                        >
                          Personal
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={`nav-link ${modalTab === "2" && "active"}`}
                          onClick={(ev) => {
                            ev.preventDefault();
                            setModalTab("2");
                          }}
                          href="#address"
                        >
                          Address
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div className={`tab-pane ${modalTab === "1" ? "active" : ""}`} id="personal">
                        <Row className="gy-4">
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="full-name">
                                First Name
                              </label>
                              <input
                                type="text"
                                id="firstName"
                                className="form-control"
                                name="firstName"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.firstName}
                                placeholder="Enter firstName"
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="full-name">
                                last Name
                              </label>
                              <input
                                type="text"
                                id="lastName"
                                className="form-control"
                                name="lastName"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.lastName}
                                placeholder="Enter lastName"
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="display-name">
                                Username
                              </label>
                              <input
                                type="text"
                                id="userName"
                                className="form-control"
                                name="userName"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.userName}
                                placeholder="Enter userName"
                                disabled
                              />
                            </div>
                          </Col>
                          <Col md="6" className="d-flex justify-content-between">
                            <div className="form-group countryCode">
                              <label className="form-label" htmlFor="countryCode">
                                country code
                              </label>
                              <input
                                type="text"
                                id="countryCode"
                                className="form-control"
                                name="countryCode"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.countryCode}
                                placeholder="country code"
                                disabled
                              />
                            </div>
                            <div className="form-group phno">
                              <label className="form-label" htmlFor="phone-no">
                                Phone Number
                              </label>
                              <input
                                type="text"
                                id="phone"
                                className="form-control"
                                name="phone"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.phone}
                                placeholder="Phone Number"
                                disabled
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="email">
                                Email
                              </label>
                              <input
                                type="text"
                                id="email"
                                className="form-control"
                                name="email"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.email}
                                placeholder="Email Address"
                                disabled
                              />
                            </div>
                          </Col>
                          <Col size="12">
                            <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2 justify-content-end">
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
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    submitForm();
                                  }}
                                >
                                  Update Profile
                                </Button>
                              </li>
                            </ul>
                          </Col>
                        </Row>
                      </div>
                      <div className={`tab-pane ${modalTab === "2" ? "active" : ""}`} id="address">
                        <Row className="gy-4">
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="address-l1">
                                Address
                              </label>
                              <input
                                type="text"
                                id="address"
                                name="address"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.address}
                                className="form-control"
                              />
                            </div>
                          </Col>

                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="address-st">
                                State
                              </label>
                              <input
                                type="text"
                                id="address-st"
                                name="state"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.state}
                                className="form-control"
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="address-county">
                                Country
                              </label>
                              <RSelect
                                options={countryOptions}
                                placeholder="Select a country"
                                defaultValue={[
                                  {
                                    value: formData.country,
                                    label: formData.country,
                                  },
                                ]}
                                onChange={(e) => setFormData({ ...formData, country: e.value })}
                              />
                            </div>
                          </Col>
                          <Col size="12">
                            <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2 justify-content-end">
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
                                <Button color="primary" size="md" onClick={() => submitForm()}>
                                  Update Address
                                </Button>
                              </li>
                            </ul>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </ModalBody>
              </Modal>

              <Modal
                isOpen={walletAddrressmodal}
                className="modal-dialog-centered"
                size="md"
                toggle={() => {
                  setwalletAddrressmodal(false);
                  setWithdrawAddress(""); // Clear input when closing
                }}
              >
                <a
                  href="#dropdownitem"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setwalletAddrressmodal(false);
                    setWithdrawAddress(""); // Clear input when closing
                  }}
                  className="close"
                >
                  <Icon name="cross-sm"></Icon>
                </a>
                <ModalBody>
                  <div className="p-2">
                    <h5 className="title">{userInfo?.withdrawAddress ? "Update" : "Add"} Withdraw Address</h5>
                    <div className="tab-content mt-5">
                      <Row className="gy-4">
                        <Col md="12">
                          <div className="form-group">
                            <label className="form-label" htmlFor="withdrawAddress">
                              BNB Smart Chain (BEP20) Address
                            </label>
                            <input
                              type="text"
                              id="withdrawAddress"
                              className="form-control"
                              name="withdrawAddress"
                              placeholder="Enter Withdraw Address (e.g., 0x...)"
                              value={withdrawAddress}
                              onChange={(e) => setWithdrawAddress(e.target.value)} // Update the state on input change
                            />
                            <div className="form-note-s2 mt-1">
                              <small>Please enter a valid BNB Smart Chain (BEP20) wallet address.</small>
                            </div>
                          </div>
                        </Col>
                        <Col size="12">
                          <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2 justify-content-end">
                            <li>
                              <a
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setwalletAddrressmodal(false);
                                  setWithdrawAddress(""); // Clear input on cancel
                                }}
                                className="link link-light"
                              >
                                Cancel
                              </a>
                            </li>
                            <li>
                              <Button color="primary" size="md" onClick={handleAddWithdrawAddress}>
                                {userInfo?.withdrawAddress ? "Update" : "Add"}
                              </Button>
                            </li>
                          </ul>
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

export default UserProfileRegularPage;
