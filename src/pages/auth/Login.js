import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Icon,
  PreviewCard,
} from "../../components/Component";
import { Form, Spinner, Alert } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/AxiosInstance";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  

  const [loading, setLoading] = useState(false);
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");
  const navigate = useNavigate();
  // const onFormSubmit = (formData) => {
  //   setLoading(true);
  //   const loginName = "info@softnio.com";
  //   const pass = "123456";
  //   if (formData.name === loginName && formData.passcode === pass) {
  //     localStorage.setItem("accessToken", "token");
  //     setTimeout(() => {
  //       window.history.pushState(
  //         `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`,
  //         "auth-login",
  //         `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`
  //       );
  //       window.location.reload();
  //     }, 1000);
  //   } else {
  //     setTimeout(() => {
  //       setError("Cannot login with credentials");
  //       setLoading(false);
  //     }, 1000);
  //   }
  // };

    const { login } = useContext(AuthContext); // Access login from AuthContext
    const { userInfo, setUserInfo } = useContext(AuthContext);

     useEffect(() => {
       const queryParams = new URLSearchParams(window.location.search);
       const userId = queryParams.get("userId");
       const token = queryParams.get("token");

       // If both userId and token are present
       if (userId && token) {
         // Save the token in localStorage for further requests
         localStorage.setItem("filanUserToken", token);

         // Call the API to get user profile data
         const fetchUserProfile = async () => {
           try {
             const response = await axiosInstance.get(`/user/profile`, {
               headers: {
                 Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
               },
             });

             const userData = response.data.data;
             // Add the token from URL to userData
             const updatedUserData = {
               ...userData,
               token: token, // Add token to the user data
             };

             // Save the user info in localStorage
             localStorage.setItem("filanUserInfo", JSON.stringify(updatedUserData));

             // Update the context with user info
             setUserInfo(updatedUserData);

             // Redirect to the overview page
             navigate("/overview");
           } catch (error) {
             console.error("Error fetching user profile:", error);
             // Handle error (for example, invalid token or user not found)
           }
         };

         fetchUserProfile();
       }
     }, [setUserInfo, navigate]);

  // Check if userInfo is present in localStorage
  // useEffect(() => {
  //   const userInfo = localStorage.getItem("userInfo");
  //   if (userInfo) {
  //     navigate(`${process.env.PUBLIC_URL}/pricing-table`);
  //   }
  // }, [navigate]);
   useEffect(() => {
     if (userInfo) {
       navigate("/overview"); // Redirect to home page if already logged in
     }
   }, [userInfo, navigate]);


  const onFormSubmit = async (formData) => {
    setLoading(true);
     const loginData = {
       loginInput: formData.loginInput,
       password: formData.passcode,
     };
    try {
      // API call using axiosInstance
      const response = await axiosInstance.post("/auth/login", loginData);
      const { data } = response;

      // Assuming the API returns a token and user info
      if (data.success) {
         localStorage.removeItem("filanUserInfo");
        login(data.data); // Use the login function from AuthContext
        setLoading(false);
      } else {
        setError("Invalid login credentials");
        setLoading(false);
      }
    } catch (error) {
      setError("Cannot login with credentials");
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

 

  return (
    <>
      <Head title="Login" />
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
              <BlockTitle tag="h4">Sign-In</BlockTitle>
              <BlockDes>
                <p>Access Filan using your email and passcode.</p>
              </BlockDes>
            </BlockContent>
          </BlockHead>
          {errorVal && (
            <div className="mb-3">
              <Alert color="danger" className="alert-icon">
                <Icon name="alert-circle" /> Unable to login with credentials{" "}
              </Alert>
            </div>
          )}
          <Form className="is-alter" onSubmit={handleSubmit(onFormSubmit)}>
            <div className="form-group">
              <div className="form-label-group">
                <label className="form-label text-white" htmlFor="default-01">
                  Email or Username
                </label>
              </div>
              <div className="form-control-wrap">
                <input
                  type="text"
                  id="default-01"
                  {...register("loginInput", { required: "This field is required" })}
                  
                  placeholder="Enter your email address or username"
                  className="form-control-lg form-control"
                />
                {errors.loginInput && <span className="invalid">{errors.loginInput.message}</span>}
              </div>
            </div>
            <div className="form-group">
              <div className="form-label-group">
                <label className="form-label text-white" htmlFor="password">
                  Passcode
                </label>
                <Link className="link link-primary link-sm" to={`${process.env.PUBLIC_URL}/auth-reset`}>
                  Forgot Code?
                </Link>
              </div>
              <div className="form-control-wrap">
                <a
                  href="#password"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setPassState(!passState);
                  }}
                  className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                >
                  <Icon name="eye" className="passcode-icon icon-show"></Icon>

                  <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                </a>
                <input
                  type={passState ? "text" : "password"}
                  id="password"
                  {...register("passcode", { required: "This field is required" })}
                 
                  placeholder="Enter your passcode"
                  className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                />
                {errors.passcode && <span className="invalid">{errors.passcode.message}</span>}
              </div>
            </div>
            <div className="form-group">
              <Button size="lg" className="btn-block" type="submit" color="primary">
                {loading ? <Spinner size="sm" color="light" /> : "Sign in"}
              </Button>
            </div>
          </Form>
          <div className="form-note-s2 text-center pt-4 text-white">
            New on our platform? <Link to={`${process.env.PUBLIC_URL}/auth-register`}>Create an account</Link>
          </div>
          {/* <div className="text-center pt-4 pb-3">
            <h6 className="overline-title overline-title-sap">
              <span>OR</span>
            </h6>
          </div>
          <ul className="nav justify-center gx-4">
            <li className="nav-item">
              <a
                className="nav-link"
                href="#socials"
                onClick={(ev) => {
                  ev.preventDefault();
                }}
              >
                Facebook
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#socials"
                onClick={(ev) => {
                  ev.preventDefault();
                }}
              >
                Google
              </a>
            </li>
          </ul> */}
        </PreviewCard>
      </Block>
      <AuthFooter />
    </>
  );
};
export default Login;
