import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Icon, UserAvatar } from "../../../components/Component";
import { findUpper } from "../../../utils/Utils";
import {
  DropdownItem,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  Row,
  Col,
  Label,
  Button,
  Input,
  Spinner,
} from "reactstrap";
import { AuthContext } from "../../../context/AuthContext";
import axiosInstance from "../../../utils/AxiosInstance";
import usePreviewImg from "../../hooks/usePreviewImg";
import useShowToast from "../../hooks/useShowToast";

const UserProfileAside = ({ updateSm, sm }) => {
  // const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("user");
  const [wallet, setWallet] = useState();
 
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const [modal, setModal] = useState(false);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const [previewUrl, setPreviewUrl] = useState(null); // Local state for image preview
  const [loading, setLoading] = useState(false); // Loading state for the upload process
  const showToast = useShowToast();
  useEffect(() => {
    sm ? document.body.classList.add("toggle-shown") : document.body.classList.remove("toggle-shown");
  }, [sm]);

  const fetchWallet = async () => {
    try {
      const { data } = await axiosInstance.get("/user/profile/wallet", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`, // Assuming the token is in the adminInfo context
        },
      });

      setWallet(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching wallet details:", error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchWallet();
    
  }, [userInfo.token]);

  // Handle image change and generate preview URL
  const handleImageChangeAndPreview =async (e) => {
    const ImgUrl = await handleImageChange(e); // Call the custom hook to handle the image
    console.log(ImgUrl);
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const preview = URL.createObjectURL(file); // Generate preview URL
      setPreviewUrl(preview); // Set preview URL
      setImgUrl(ImgUrl);
    } else {
      setPreviewUrl(null); // Reset preview URL if no file is selected
    }
  };

  const handleFileUpload = async () => {
    if (!imgUrl) {
      showToast("Error", "must upload image", "warning");
        return false;
    }
    setLoading(true); // Set loading state to true when upload starts
    const data = new FormData();
    data.append("file", imgUrl);
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
        const response = await axiosInstance.put(
          "/user/profile/update-pic",
          { profilePic: uploadedImageUrl.secure_url },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo.token}`, // Use token from AuthContext
            },
          }
        );
        if (response.data.success) {
          // Show success toast
          showToast("Done", "Profile updated successfully", "success");

          // Update userInfo in AuthContext and localStorage while preserving the token
          const updatedUserInfo = {
            ...userInfo, // Preserve existing token and other data
            ...response.data.data, // Merge updated user data
          };

          setUserInfo(updatedUserInfo); // Update context
          localStorage.setItem("filanUserserInfo", JSON.stringify(updatedUserInfo)); // Update localStorage

          setModal(false); // Close the modal after successful update
          setPreviewUrl(null);
        } else {
          console.error("Error updating profile picture:", response.data);
          showToast("Error", "Failed to updating profile picture", "warning");
          setPreviewUrl(null);
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast("Error", "Failed to updating profile picture", "danger"); // Error toast
      setPreviewUrl(null);
    } finally {
      setLoading(false); // Set loading state to false when upload finishes
    }
  };

  return (
    <div className="card-inner-group">
      <div className="card-inner">
        <div className="user-card">
          {userInfo.profilePic ? (
            <img
              src={userInfo.profilePic} // Use preview URL as the src
              alt="Profile Preview"
              style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "1rem", objectFit: "cover" }} // Styling for preview
            />
          ) : (
            <UserAvatar text={findUpper(userInfo.firstName)} theme="primary" />
          )}

          <div className="user-info">
            <span className="lead-text text-white">
              {" "}
              {userInfo.firstName} {userInfo.lastName}
            </span>
            <span className="sub-text text-white">{userInfo.email}</span>
            <span className="sub-text text-white">{userInfo.ID}</span>
          </div>
          <div className="user-action">
            <UncontrolledDropdown>
              <DropdownToggle tag="a" className="btn btn-icon btn-trigger me-n2">
                <Icon name="more-v" className="text-white"></Icon>
              </DropdownToggle>
              <DropdownMenu end>
                <ul className="link-list-opt no-bdr">
                  <li>
                    <DropdownItem tag="a" href="#dropdownitem" onClick={() => setModal(true)}>
                      <Icon name="camera-fill" className="text-white"></Icon>
                      <span className="text-white">Change Photo</span>
                    </DropdownItem>
                  </li>
                  <li>
                    {/* <DropdownItem tag="a" href="#dropdownitem" onClick={() => setModal(true)}>
                      <Icon name="edit-fill"></Icon>
                      <span>Updated Profile</span>
                    </DropdownItem> */}
                  </li>
                </ul>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
      </div>
      <div className="card-inner">
        {!loading ? (
          <div className="user-account-info py-0">
            <h6 className="overline-title-alt text-white"> Wallet Account</h6>
            <div className="user-balance textYellow">
              {wallet?.mainBalance.toFixed(2)} <small className="currency currency-btc">Deposit balance</small>
            </div>
            <div className="user-balance-sub">
              <span className="text-white">
                {wallet?.interestBalance.toFixed(2)} <span className="currency currency-btc text-white">Current balance</span>
              </span>
            </div>
          </div>
        ) : (
          <p className="text-white">Loading...</p>
        )}
      </div>
      <div className="card-inner p-0">
        <ul className="link-list-menu">
          <li onClick={() => updateSm(false)}>
            <Link
              to={`${process.env.PUBLIC_URL}/profile-setting`}
              className={window.location.pathname === `${process.env.PUBLIC_URL}/profile-setting` ? "active" : ""}
            >
              <Icon name="user-fill-c" className="text-white"></Icon>
              <span className="text-white">Personal Information</span>
            </Link>
          </li>
          <li onClick={() => updateSm(false)}>
            <Link
              to={`${process.env.PUBLIC_URL}/user-profile-notification`}
              className={
                window.location.pathname === `${process.env.PUBLIC_URL}/user-profile-notification` ? "active" : ""
              }
            >
              <Icon name="bell-fill" className="text-white"></Icon>
              <span className="text-white">Messages</span>
            </Link>
          </li>
          {/* <li onClick={() => updateSm(false)}>
            <Link
              to={`${process.env.PUBLIC_URL}/user-profile-activity`}
              className={window.location.pathname === `${process.env.PUBLIC_URL}/user-profile-activity` ? "active" : ""}
            >
              <Icon name="activity-round-fill"></Icon>
              <span>Account Activity</span>
            </Link>
          </li> */}
          <li onClick={() => updateSm(false)}>
            <Link
              to={`${process.env.PUBLIC_URL}/user-profile-setting`}
              className={window.location.pathname === `${process.env.PUBLIC_URL}/user-profile-setting` ? "active" : ""}
            >
              <Icon name="lock-alt-fill" className="text-white"></Icon>
              <span className="text-white">Security Setting</span>
            </Link>
          </li>
        </ul>
      </div>

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
            <h5 className="title">Profile Settings</h5>

            <div className="tab-content">
              <Row>
                <Col md="12" className="mt-4">
                  <div className="form-group">
                    <label className="form-label">Upload Profile Image</label>
                    <div className="form-control-wrap">
                      <div className="form-file">
                        <Input
                          type="file"
                          id="customFile"
                          // onChange={(e) => setDefaultFiles(e.target.files[0].name)}
                          onChange={handleImageChangeAndPreview}
                        />
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
                          style={{ width: "200px", height: "200px", borderRadius: "8px", objectFit: "cover" }} // Styling for preview
                        />
                      </div>
                    </div>
                  </Col>
                )}

                {/* Uploading Status */}
                {loading && (
                  <Col md="12" className="mt-4 text-center">
                    <Spinner color="primary" /> Uploading...
                  </Col>
                )}

                {/* Action Buttons */}
                <Col size="12">
                  <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2 justify-content-end mt-3">
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
                      <Button color="primary" size="md" onClick={handleFileUpload} disabled={loading}>
                        {loading ? "Uploading..." : "upload"}
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
  );
};

export default UserProfileAside;
