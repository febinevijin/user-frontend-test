import React, { useContext, useState } from 'react'
import Head from '../../../layout/head/Head';
import { Block, BlockBetween, BlockHead, BlockHeadContent, BlockTitle, PreviewCard, RSelect } from '../../../components/Component';
import { Button, Col, Input, Label, Row } from 'reactstrap';
import Content from '../../../layout/content/Content';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import useShowToast from '../../hooks/useShowToast';

import axiosInstance from '../../../utils/AxiosInstance';
import usePreviewImg, { useKYCPreviewImg } from '../../hooks/usePreviewImg';

export const defaultOptions = [
    { value: "0", label: "National ID Card" },
    { value: "1", label: "Passport" },
    { value: "2", label: "Driving License" },
];

function KYCAdd() {
  const { userInfo } = useContext(AuthContext); // Get userInfo from AuthContext
    const navigate = useNavigate();
    const showToast = useShowToast();
    const { handleImageChange, imgUrl, setImgUrl } = useKYCPreviewImg();
  const [formData, setFormData] = useState({
    docType: "",
    docId: "",
    docFrontSideImg: "",
    docBackSideImg: "",
    userImg: "",
    fullName: "",
    address: "",
    age: "",
    gender: "0", // Default to Male
  });
  const [previewUrls, setPreviewUrls] = useState({
    docFrontSide: null,
    docBackSide: null,
    userImage: null,
  });
  const [loading, setLoading] = useState(false);

//   const handleFileChange = async (e, fieldName) => {
//    console.log("1")

//       await handleImageChange(e); // Compress and get the compressed file
//         console.log("4");
//     const file = e.target.files[0];
//     if (file) {
//       // Generate preview URL from the compressed file
//       const preview = URL.createObjectURL(file);
//  console.log("preview1", preview);
//  console.log("imgUrl2", imgUrl);
//         // Set the preview URL for the image
//          await handleImageChange(e);
//       setPreviewUrls((prev) => ({ ...prev, [fieldName]: preview }));

//       // Store the compressed file (or URL) in formData for later submission
//         setFormData((prev) => ({ ...prev, [fieldName]: imgUrl })); // Store the compressed file for uploading
//           console.log("4");
//     } else {
//         setPreviewUrls((prev) => ({ ...prev, [fieldName]: null })); // Reset preview URL if no file is selected or compression fails
//           console.log("5");
//     }
//   };

  
    // const handleFileChange = async (e, fieldName) => {
    //   console.log("enter");

    //   // Compress and get the compressed file
    //   const compressedFile = await handleImageChange(e);

    //   if (compressedFile) {
    //     // Generate a preview URL directly from the compressed file
    //     const preview = URL.createObjectURL(compressedFile);

    //     // Set the preview URL for displaying the image
    //     setPreviewUrls((prev) => ({ ...prev, [fieldName]: preview }));

    //     // Store the compressed file in the formData state for later use
    //     setFormData((prev) => ({ ...prev, [fieldName]: compressedFile }));
    //   } else {
    //     setPreviewUrls((prev) => ({ ...prev, [fieldName]: null })); // Reset if no valid file
    //   }
    // };

    const handleFileChangeOne = async (e) => {
      console.log("Uploading Document Front Side");

      // Compress and get the compressed file
      const compressedFile = await handleImageChange(e);

      if (compressedFile) {
        // Generate a preview URL directly from the compressed file
        const preview = URL.createObjectURL(compressedFile);

        // Set the preview URL for displaying the image
        setPreviewUrls((prev) => ({ ...prev, docFrontSideImg: preview }));

        // Store the compressed file in the formData state for later use
        setFormData((prev) => ({ ...prev, docFrontSideImg: compressedFile }));
      } else {
        setPreviewUrls((prev) => ({ ...prev, docFrontSideImg: null })); // Reset if no valid file
      }
    };

    const handleFileChangeTwo = async (e) => {
      console.log("Uploading Document Back Side");

      // Compress and get the compressed file
      const compressedFile = await handleImageChange(e);

      if (compressedFile) {
        // Generate a preview URL directly from the compressed file
        const preview = URL.createObjectURL(compressedFile);

        // Set the preview URL for displaying the image
        setPreviewUrls((prev) => ({ ...prev, docBackSideImg: preview }));

        // Store the compressed file in the formData state for later use
        setFormData((prev) => ({ ...prev, docBackSideImg: compressedFile }));
      } else {
        setPreviewUrls((prev) => ({ ...prev, docBackSideImg: null })); // Reset if no valid file
      }
    };

    const handleFileChangeThree = async (e) => {
      console.log("Uploading User Image");

      // Compress and get the compressed file
      const compressedFile = await handleImageChange(e);

      if (compressedFile) {
        // Generate a preview URL directly from the compressed file
        const preview = URL.createObjectURL(compressedFile);

        // Set the preview URL for displaying the image
        setPreviewUrls((prev) => ({ ...prev, userImg: preview }));

        // Store the compressed file in the formData state for later use
        setFormData((prev) => ({ ...prev, userImg: compressedFile }));
      } else {
        setPreviewUrls((prev) => ({ ...prev, userImg: null })); // Reset if no valid file
      }
    };
    
    const handleSubmit = async (e) => {
      console.log( "debug"); // Debug log
      e.preventDefault();
      setLoading(true); // Set loading state to true when upload starts
      console.log(formData, "debug"); // Debug log
      // Check for required fields
      if (!formData.docId || !formData.fullName || !formData.address || !formData.age || !formData.gender) {
        showToast("Error", "All fields are required", "warning");
        setLoading(false);
        return false;
      }

      // Ensure formData contains actual File objects

      // Prepare FormData for Cloudinary upload
      const uploadData = new FormData();
      const uploadPreset = process.env.REACT_APP_CLOUDINARY_PRESET_NAME;
      const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

      // Upload Images to Cloudinary
      try {
        const uploadedUrls = await Promise.all(
          Object.entries(formData).map(async ([key, value]) => {
            if (value instanceof Blob) {
              console.log("img uploading ...");
              // Check if the entry is a File
              uploadData.append("file", value);
              uploadData.append("upload_preset", uploadPreset);
              uploadData.append("cloud_name", cloudName);

              const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: uploadData,
              });

              const uploadedImageUrl = await res.json();
              //   return uploadedImageUrl.secure_url;
              if (uploadedImageUrl.secure_url) {
                console.log(`${key} uploaded successfully: ${uploadedImageUrl.secure_url}`);
                return { [key]: uploadedImageUrl.secure_url };
              } else {
                console.error(`Failed to upload ${key}:`, uploadedImageUrl);
                return null;
              }
            }
            return null; // If it's not a file, return null
          })
        );

        // const [docFrontSideImgUrl, docBackSideImgUrl, userImgUrl] = uploadedUrls;

        // Filter out null values (failed uploads or non-file fields)
        const uploadedImages = uploadedUrls.filter((url) => url !== null);

        // Prepare final form data with uploaded URLs
        const finalFormData = {
          ...formData,
          ...uploadedImages.reduce((acc, curr) => ({ ...acc, ...curr }), {}), // Merge URLs into formData
          };
          
          console.log("Final form data with URLs:", finalFormData);

        // const kycData = {
        //   docType: formData.docType,
        //   docId: formData.docId,
        //   docFrontSideImg: docFrontSideImgUrl,
        //   docBackSideImg: docBackSideImgUrl,
        //   userImg: userImgUrl,
        //   fullName: formData.fullName,
        //   address: formData.address,
        //   age: parseInt(formData.age, 10),
        //   gender: formData.gender,
        // };

        const response = await axiosInstance.post("/user/kyc/submit", finalFormData, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        showToast("Done", "KYC submitted successfully", "success");
        // Clear all form data after successful submission
        setFormData({
          docType: "",
          docId: "",
          docFrontSideImg: "",
          docBackSideImg: "",
          userImg: "",
          fullName: "",
          address: "",
          age: "",
          gender: "0",
        });
        setPreviewUrls({ docFrontSide: null, docBackSide: null, userImage: null });
        navigate(`${process.env.PUBLIC_URL}/user-profile-setting`); // Redirect or close modal
      } catch (error) {
        console.error("Error submitting KYC:", error);
        showToast("Error", "Error submitting KYC", "danger"); // Error toast
      } finally {
        setLoading(false); // Set loading state to false when upload finishes
      }
    };
  

  return (
    <>
      <Head title="KYC"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle className="text-white" page>Add KYC Details</BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <PreviewCard>
            <div className="card-head mb-4">
              <h5 className="card-title text-white">Upload Document</h5>
            </div>
            <form onSubmit={handleSubmit}>
              <Row className="g-4">
                <Col lg="6">
                  <div className="form-group">
                    <label className="form-label">Select Doc Type</label>
                    <RSelect
                      options={defaultOptions}
                      onChange={(option) => setFormData({ ...formData, docType: option.value })}
                    />
                  </div>
                </Col>
                <Col lg="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="idNumber">
                      ID No (Add Selected Doc ID)
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        name="docId"
                        id="idNumber"
                        className="form-control"
                        placeholder="Enter Your ID No"
                        onChange={(e) => setFormData({ ...formData, docId: e.target.value })}
                      />
                    </div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="form-group">
                    <label className="form-label">Upload Document Front Side</label>
                    <div className="form-control-wrap">
                      <div className="form-file">
                        <input type="file" onChange={handleFileChangeOne} />
                      </div>
                      {previewUrls.docFrontSide && (
                        <img src={previewUrls.docFrontSide} alt="Document Front Side Preview" />
                      )}
                    </div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="form-group">
                    <label className="form-label">Upload Document Back Side</label>
                    <div className="form-control-wrap">
                      <div className="form-file">
                        <input type="file" onChange={handleFileChangeTwo} />
                      </div>
                      {previewUrls.docBackSide && (
                        <img src={previewUrls.docBackSide} alt="Document Back Side Preview" />
                      )}
                    </div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="form-group">
                    <label className="form-label">Upload Your Image</label>
                    <div className="form-control-wrap">
                      <div className="form-file">
                        <input type="file" onChange={handleFileChangeThree} />
                      </div>
                      {previewUrls.userImage && <img src={previewUrls.userImage} alt="User Image Preview" />}
                    </div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="full-name-1">
                      Full Name
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        id="full-name-1"
                        className="form-control"
                        placeholder="Enter Your Fullname"
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="form-group">
                    <Label htmlFor="address" className="form-label">
                      Address
                    </Label>
                    <div className="form-control-wrap">
                      <Input
                        className="no-resize"
                        id="address"
                        placeholder="Enter Your Address"
                        type="textarea"
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="age">
                      Age
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        id="age"
                        className="form-control"
                        placeholder="Enter Your Age"
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <ul className="custom-control-group g-3 align-center">
                      <li>
                        <div className="custom-control custom-control-sm custom-radio">
                          <input
                            type="radio"
                            className="custom-control-input"
                            id="genderM"
                            name="gender"
                            value="0"
                            checked={formData.gender === "0"}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          />
                          <label className="custom-control-label text-white" htmlFor="genderM">
                            Male
                          </label>
                        </div>
                      </li>
                      <li>
                        <div className="custom-control custom-control-sm custom-radio">
                          <input
                            type="radio"
                            className="custom-control-input"
                            id="genderF"
                            name="gender"
                            value="1"
                            checked={formData.gender === "1"}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          />
                          <label className="custom-control-label text-white" htmlFor="genderF">
                            Female
                          </label>
                        </div>
                      </li>
                      <li>
                        <div className="custom-control custom-control-sm custom-radio">
                          <input
                            type="radio"
                            className="custom-control-input"
                            id="genderO"
                            name="gender"
                            value="2"
                            checked={formData.gender === "2"}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          />
                          <label className="custom-control-label text-white" htmlFor="genderO">
                            Others
                          </label>
                        </div>
                      </li>
                    </ul>
                  </div>
                </Col>
                <Col xl="12" className="d-flex justify-content-end">
                  <Button
                    color="light"
                    size="lg"
                    className="me-2"
                    onClick={() => navigate(`${process.env.PUBLIC_URL}/user-profile-setting`)}
                  >
                    Back
                  </Button>
                  <Button color="primary" size="lg" type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Save Changes"}
                  </Button>
                </Col>
              </Row>
            </form>
          </PreviewCard>
        </Block>
      </Content>
    </>
  );
}

export default KYCAdd;
