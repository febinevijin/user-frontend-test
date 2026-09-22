import React, { useContext, useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import {
  Input,
} from "reactstrap";
import {
  Button,
  Block,
  BlockDes,
  BlockHead,
  BlockTitle,
  Icon,
  PreviewCard,
  BlockContent,
} from "../../../components/Component";
import CopyToClipboard from "react-copy-to-clipboard";
import { Link } from "react-router-dom";
import Logo from "../../../../src/images/logo.png";
import LogoDark from "../../../../src/images/logo-dark.png";
import { AuthContext } from "../../../context/AuthContext";
import axiosInstance from "../../../utils/AxiosInstance";

const Refferal = () => {
  const { userInfo } = useContext(AuthContext); // Get userInfo from AuthContext

  // copy clipboard
  const [value, setValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [linkStatus, setLinkStatus] = useState(false);

 

  // Fetch referral link status when the component mounts
  useEffect(() => {
    const fetchReferralLink = async () => {
      if (userInfo && userInfo.token) {
        try {
          const response = await axiosInstance.get(`/user/referral/link`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });

          if (response.data.success) {
            const { userName, linkStatus } = response.data.data;
            setLinkStatus(linkStatus);
            if (linkStatus) {
              setValue(`https://user-frontend-test.vercel.app/auth-refer-register?referral=${userName}`);
            }
          }
        } catch (error) {
          console.error("Failed to fetch referral link:", error);
        }
      }
    };

    fetchReferralLink();
  }, [userInfo]);

  return (
    <>
      <Head title="Reffer Friend" />

      <Content>
        <Block className="nk-block-middle nk-auth-body wide-xs">
          <div className="brand-logo pb-4 text-center">
            <Link to={process.env.PUBLIC_URL + "/"}>
              <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
              <img className="logo-dark logo-img logo-img-lg" src={LogoDark} alt="logo-dark" />
            </Link>
          </div>
          <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
            <BlockHead>
              <BlockContent>
                <BlockTitle tag="h5">Referral link</BlockTitle>
                <BlockDes>
                  <p>Invite a Friend and Share the Benefits!</p>
                </BlockDes>
              </BlockContent>
            </BlockHead>

            <div className="reffer-div w-100">
              {linkStatus ? (
                <div className="reffer">
                  <Input
                    className="input"
                    value={value}
                    onChange={({ target: { value } }) => setValue(value)}
                    disabled
                  />
                  <CopyToClipboard text={value} onCopy={() => setCopied(true)}>
                    <Button color="primary" className="buy-btn">
                      <Icon name="copy" />
                    </Button>
                  </CopyToClipboard>
                </div>
              ) : (
                <p className="text-warning">Activate referral link only after plan purchase</p>
              )}

              {copied ? <p className="text-white">Link copied!</p> : null}
            </div>
          </PreviewCard>
        </Block>
      </Content>
    </>
  );
};

export default Refferal;