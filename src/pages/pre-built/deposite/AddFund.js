import React, { useContext, useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import { Card, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from "reactstrap";
import { Alert } from "reactstrap";
import { BlockBetween, BlockDes, BlockContent, BlockHead, BlockTitle, Icon, Col } from "../../../components/Component";
import { Button } from "reactstrap";
import Dropzone from "react-dropzone";
import CopyToClipboard from "react-copy-to-clipboard";
import Head from "../../../layout/head/Head";
import { AuthContext } from "../../../context/AuthContext";
import axiosInstance from "../../../utils/AxiosInstance";
import usePreviewImg from "../../hooks/usePreviewImg";
import useShowToast from "../../hooks/useShowToast";
import qrImg from "../../../images/qr_img.jpg";

const AddFund = () => {
  // console.log(process.env.REACT_APP_PUBLIC_URL);
  // console.log(process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
  // console.log(process.env.REACT_APP_CLOUDINARY_PRESET_NAME);
  const { userInfo } = useContext(AuthContext);
  const [modal, setModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState();
  const [paymentMethodsList, setPaymentMethodsList] = useState([]);
  const [modalForm, setModalForm] = useState(false);
  const [previewQRModal, setPreviewQRModal] = useState(false);

  const toggleForm = () => {
    setModalForm(!modalForm);
    setPreviewQRModal(false);
  };
  const toggleQRModal = () => setPreviewQRModal(!previewQRModal);

  const INITIAL_TIME = 600; // 10 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const [defaultFiles, setDefaultFiles] = useState("");
  const [loading, setLoading] = useState(false);

  // copy clipboard
  const [value, setValue] = useState("");
  const [copied, setCopied] = useState(false);

  const [amount, setAmount] = useState("");
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [isAmountValid, setIsAmountValid] = useState(false);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const [previewUrl, setPreviewUrl] = useState(null); // Local state for image preview
  const showToast = useShowToast();

  // fetch payment method api
  const fetchPaymentMethod = async () => {
    try {
      const response = await axiosInstance.get("/user/payment-method", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`, // Assuming the token is in the adminInfo context
        },
      });
      const methods = response.data.data.paymentMethods.filter(method => method.isActive === true);
      setPaymentMethodsList(methods);
      if (methods && methods.length > 0) {
        setPaymentMethod(methods[0]);
      }
    } catch (error) {
      console.error("Error fetching payment method:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPaymentMethod();
  }, [userInfo.token]);

  const handleTryAgain = () => {
    setModalForm(false);
    setPreviewQRModal(false);
    setAmount("");
    setOrderId("");
    setEmail("");
    setScreenshotUrl("");
    setPreviewUrl(null);
    setIsAmountValid(false);
    fetchPaymentMethod();
    setTimeLeft(INITIAL_TIME);
  };



  // enable/disable button proceed to buy btn
  const handleAmountChange = (e) => {
    const enteredAmount = e.target.value;
    setAmount(enteredAmount);
    if (paymentMethod) {
      const { minAmount, maxAmount } = paymentMethod;
      if (enteredAmount >= minAmount && enteredAmount <= maxAmount) {
        setIsAmountValid(true);
      } else {
        setIsAmountValid(false);
      }
    }
  };

  // Handle image change and generate preview URL
  const handleImageChangeAndPreview = async (e) => {
    // Call the custom hook to handle the image
    const ImgUrl = await handleImageChange(e);
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const preview = URL.createObjectURL(file); // Generate preview URL
      // Set screenshot
      setPreviewUrl(preview); // Set preview URL

      // setScreenshotUrl(imgUrl);
      // console.log(imgUrl, "img");
      setScreenshotUrl(ImgUrl);

    } else {
      setPreviewUrl(null); // Reset preview URL if no file is selected
    }
  };
  // submit data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (timeLeft <= 0) {
      showToast("Error", "Session expired! Please click Try Again.", "warning");
      return false;
    }

    if (!screenshotUrl || !amount || !orderId || !email) {
      showToast("Error", "must upload image", "warning");
      return false;
    }
    setLoading(true); // Set loading state to true when upload starts
    // first upload image
    // if image upload successfully upload data
    const data = new FormData();
    data.append("file", screenshotUrl);
    data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET_NAME);
    data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const uploadedImageUrl = await res.json();
      if (uploadedImageUrl) {
        const uploadData = {
          amount: parseFloat(amount), // Assuming the amount is numeric
          orderId,
          paymentScreenshotUrl: uploadedImageUrl.secure_url,
          method: paymentMethod?._id,
          email,
        };
        const response = await axiosInstance.post("/user/fund/add", uploadData, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        // console.log("Fund added successfully:", response.data);
        showToast("Done", "Fund request submitted successfully", "success");
        // Clear all form data after successful submission
        setAmount("");
        setOrderId("");
        setEmail("");
        setScreenshotUrl("");
        setPreviewUrl(null);
        setIsAmountValid(false);
        toggleForm(); // Close the modal on success
        setPreviewUrl(null);
      } else {
        console.error("Error adding screenshot:", res.data);
        showToast("Error", "Error uploading screenshot", "danger");
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error("Error adding fund:", error);
      showToast("Error", "Error adding fund", "danger"); // Error toast
      setPreviewUrl(null);
    } finally {
      setLoading(false); // Set loading state to false when upload finishes
    }
  };

  return (
    <>
      <Head title="Deposit"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween className="g-3">
            <BlockContent>
              <BlockTitle className="text-white">Deposit</BlockTitle>
              <BlockDes className="text-soft">
                <p className="text-white">Deposit funds easily and securely</p>
              </BlockDes>
            </BlockContent>
          </BlockBetween>
        </BlockHead>

        <div className="deposit-card">
          <Card className="deposit-card-div card1">
            <div className="input-div cardRel">
              <label className="text-white">Amount to deposit</label>
              <input
                className="form-control form-control-xl"
                placeholder="Enter amount"
                value={amount}
                onChange={handleAmountChange}
              />
              <span>USD</span>
            </div>
            <p className="limit cardRel mb-3">
              Transaction Limit : {paymentMethod?.minAmount}$ - {paymentMethod?.maxAmount}$
            </p>

            {/* Integrated Session Expiry Notice & Countdown Badge */}
            <div
              className="d-flex align-items-center justify-content-between p-3 my-3"
              style={{
                backgroundColor: timeLeft <= 0 ? "rgba(239, 68, 68, 0.12)" : "rgba(217, 119, 6, 0.12)",
                border: timeLeft <= 0 ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(245, 158, 11, 0.3)",
                borderRadius: "10px",
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={timeLeft <= 0 ? "#ef4444" : "#f59e0b"} strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div>
                  <span style={{ fontWeight: "700", color: timeLeft <= 0 ? "#ef4444" : "#fbbf24", fontSize: "13px", display: "block" }}>
                    {timeLeft <= 0 ? "Session Expired!" : "Do not go back!"}
                  </span>
                  <span style={{ color: timeLeft <= 0 ? "#fca5a5" : "#fcd34d", fontSize: "12px" }}>
                    {timeLeft <= 0 ? "Timer ended. Data upload disabled." : "Session active"}
                  </span>
                </div>
              </div>
              <div
                className="px-3 py-1 rounded-pill"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  border: timeLeft <= 0 ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(245, 158, 11, 0.4)",
                  color: timeLeft <= 0 ? "#ef4444" : "#f59e0b",
                  fontWeight: "700",
                  fontSize: "14px",
                  fontFamily: "monospace",
                }}
              >
                {formatTime(timeLeft)}
              </div>
            </div>

            {timeLeft <= 0 ? (
              <Button
                color="primary"
                className="buy-btn"
                style={{
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                }}
                onClick={handleTryAgain}
              >
                <Icon name="reload" />
                <span>Try Again</span>
              </Button>
            ) : (
              <Button color="primary" disabled={!isAmountValid} onClick={toggleForm} className="buy-btn">
                <span>Continue to deposit</span>
              </Button>
            )}
          </Card>

          <div className="deposit-card-div">
            <table className="depo-table">
              <tbody>
                <tr>
                  <td>Amount</td>
                  <td> - </td>
                  <td>{amount && amount !== "" ? amount : 0}$</td>
                </tr>
                <tr>
                  <td>Charge</td>
                  <td> - </td>
                  <td>0$</td>
                </tr>
                <tr>
                  <td>Payable</td>
                  <td> - </td>
                  <td>{amount && amount !== "" ? amount : 0}$</td>
                </tr>
                <tr>
                  <td>Network</td>
                  <td> - </td>
                  <td>BNB Smart Chain (BEP20)</td>
                </tr>
                <tr>
                  <td>Payment Method</td>
                  <td> - </td>
                  <td>{paymentMethod?.paymentMethodName}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <Modal isOpen={modalForm} toggle={toggleForm}>
          <ModalHeader
            toggle={toggleForm}
            close={
              <button className="close" onClick={toggleForm}>
                <Icon name="cross" />
              </button>
            }
          >
            Pay With Wallet
          </ModalHeader>
          <ModalBody>
            {timeLeft <= 0 ? (
              <div className="text-center py-4 px-3">
                <div
                  className="d-inline-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(239, 68, 68, 0.15)",
                    color: "#ef4444",
                    boxShadow: "0 0 20px rgba(239, 68, 68, 0.2)",
                  }}
                >
                  <Icon name="alert-circle" style={{ fontSize: "32px" }} />
                </div>
                <h4 className="text-white fw-bold mb-2">Session Expired</h4>
                <p style={{ color: "#9ca3af", fontSize: "14px", maxWidth: "340px", margin: "0 auto 24px auto" }}>
                  Your deposit session has timed out. Please try again.
                </p>
                <div className="d-flex align-items-center justify-content-center gap-3 pt-2">
                  <Button
                    type="button"
                    onClick={toggleForm}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#d1d5db",
                      borderRadius: "8px",
                      padding: "10px 24px",
                      fontSize: "14px",
                      fontWeight: "600",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    className="buy-btn"
                    onClick={handleTryAgain}
                    style={{
                      borderRadius: "8px",
                      padding: "10px 28px",
                      fontSize: "14px",
                      fontWeight: "600",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Icon name="reload" />
                    <span>Try Again</span>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {paymentMethod?.extraDetails?.walletQRCode && (
                  <div className="text-center my-3 p-3 rounded" style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    <div className="mb-2 text-white-50" style={{ fontSize: "13px", fontWeight: "500" }}>
                      Scan QR Code
                    </div>
                    <div
                      className="d-inline-block p-2 bg-white rounded shadow-sm"
                      style={{ maxWidth: "220px", width: "100%" }}
                    >
                      <img
                        src={paymentMethod?.extraDetails?.walletQRCode}
                        alt="QR Code"
                        className="img-fluid"
                        style={{
                          maxHeight: "200px",
                          width: "auto",
                          objectFit: "contain",
                          borderRadius: "4px",
                          display: "block",
                          margin: "0 auto",
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="form-group mb-4">
                  <label className="form-label" style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "6px" }}>
                    Wallet address (BEP-20)
                  </label>
                  <div
                    className="d-flex align-items-start justify-content-between p-3 rounded"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      gap: "12px",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        color: "#ffffff",
                        fontSize: "14px",
                        fontFamily: "monospace",
                        wordBreak: "break-all",
                        overflowWrap: "anywhere",
                        userSelect: "all",
                        lineHeight: "1.5",
                        fontWeight: "500",
                        flex: "1",
                      }}
                    >
                      {paymentMethod?.extraDetails?.walletAddress || "N/A"}
                    </div>
                    <CopyToClipboard
                      text={paymentMethod?.extraDetails?.walletAddress || ""}
                      onCopy={() => {
                        setCopied(true);
                        showToast("Success", "Wallet address copied to clipboard!", "success");
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      <button
                        type="button"
                        className="btn p-1"
                        style={{
                          color: copied ? "#22c55e" : "#9ca3af",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          flexShrink: 0,
                          transition: "color 0.2s ease",
                          lineHeight: 1,
                          marginTop: "2px",
                        }}
                        title={copied ? "Copied!" : "Copy Address"}
                      >
                        <Icon name={copied ? "check" : "copy"} style={{ fontSize: "20px" }} />
                      </button>
                    </CopyToClipboard>
                  </div>
                </div>

                <Alert color="warning">
                  <ul>
                    <li>
                      Send exactly <span>{amount && amount !== "" ? amount : 0} USDT</span> to the wallet address above.
                    </li>
                    <li>Only use BNB Smart Chain (BEP-20) network.</li>
                    <li>Transactions sent through any other network (TRC-20, ERC-20, Polygon, etc.) may be lost and cannot be recovered.</li>
                    <li>Please ensure the wallet address and network are correct before confirming the transaction.</li>
                    <li>Network (gas) fees are charged separately by your wallet and are not included in the deposit amount.</li>
                  </ul>
                </Alert>

                <div className="form-group">
                  <label className="form-label" htmlFor="full-name">
                    Transaction ID
                  </label>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      className="form-control"
                      id="full-name"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <Col>
                  <div className="form-group">
                    <label className="form-label">Screenshot Upload</label>
                    <div className="form-control-wrap">
                      <div className="form-file">
                        <Input type="file" id="customFile" onChange={handleImageChangeAndPreview} />
                      </div>
                    </div>
                  </div>
                </Col>

                {/* Image Preview */}
                {previewUrl && (
                  <Col md="12" className="mt-4">
                    <div className="form-group">
                      <label className="form-label">Image Preview</label>
                      <div className="form-control-wrap">
                        <img
                          src={previewUrl} // Use preview URL as the src
                          alt="Profile Preview"
                          style={{ width: "100%", height: "200px", borderRadius: "8px", objectFit: "contain" }} // Styling for preview
                        />
                      </div>
                    </div>
                  </Col>
                )}

                <Col className="mb-3">
                  <Alert color="warning">
                    <ul>
                      <li>Deposits are typically approved within few minutes. In some cases, verification may take a few hours depending on payment validation. Once approved, the deposit will be automatically reflected in your account.</li>
                    </ul>
                  </Alert>
                </Col>

                <div className="form-group d-flex align-items-center justify-content-end gap-3 mt-4 pt-2">
                  <Button
                    type="button"
                    onClick={toggleForm}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#d1d5db",
                      borderRadius: "8px",
                      padding: "10px 24px",
                      fontSize: "14px",
                      fontWeight: "600",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    disabled={loading}
                    style={{
                      borderRadius: "8px",
                      padding: "10px 28px",
                      fontSize: "14px",
                      fontWeight: "600",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {loading && <Spinner size="sm" color="light" />}
                    <span>{loading ? "Uploading..." : "Upload"}</span>
                  </Button>
                </div>
              </form>
            )}
          </ModalBody>
        </Modal>
      </Content>
    </>
  );
};

export default AddFund;
