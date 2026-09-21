import React, { useState, useEffect, useContext } from "react";
import UserAvatar from "../../../../components/user/UserAvatar";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import { Icon } from "../../../../components/Component";
import { LinkList, LinkItem } from "../../../../components/links/Links";
import { useTheme, useThemeUpdate } from "../../../provider/Theme";
import { AuthContext } from "../../../../context/AuthContext";

const User = () => {
  const { userInfo, THEME, toggleTheme, logout } = useContext(AuthContext); // Get user info and theme controls
  const theme = useTheme();
  const themeUpdate = useThemeUpdate();
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prevState) => !prevState);
 
//  const changeThemeFn = () => {
//   //  ev.preventDefault();
//    const newTheme = theme.skin === "dark" ? "light" : "dark";
//    themeUpdate.skin(newTheme);
//    toggleTheme();
//   };

  
  
 
  
  return (
    <Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
      <DropdownToggle
        tag="a"
        href="#toggle"
        className="dropdown-toggle"
        onClick={(ev) => {
          ev.preventDefault();
        }}
      >
        <div className="user-toggle">
          <UserAvatar icon="user-alt" className="sm" />
          <div className="user-info d-none d-md-block">
            {/* <div className="user-status">User</div> */}
            <div className="user-name dropdown-indicator text-white">{userInfo?.userName || "User Name"}</div>
            <span className="text-white">{userInfo.ID}</span>
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu end className="dropdown-menu-md dropdown-menu-s1 glassborder glassborderBottom">
        <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block glassbg">
          <div className="user-card sm">
            <div className="user-avatar">
              <span>{userInfo?.userName?.[0]}</span>
            </div>
            <div className="user-info">
              <span className="lead-text text-white">{userInfo?.firstName || "User Name"}</span>
              <span className="sub-text text-white">{userInfo?.email || "user@example.com"}</span>
            </div>
          </div>
        </div>
        <div className="dropdown-inner glassbg glassborderTop">
          <LinkList>
            <LinkItem className="text-white" link="/profile-setting" icon="user-alt" onClick={toggle}>
              View Profile
            </LinkItem>
            <LinkItem className="text-white" link="/user-profile-setting" icon="setting-alt" onClick={toggle}>
              Account Setting
            </LinkItem>

            <LinkItem className="text-white" link="/user-profile-notification" icon="bell" onClick={toggle}>
              Messages
            </LinkItem>
            {/* <LinkItem link="/user-profile-activity" icon="activity-alt" onClick={toggle}>
              Login Activity
            </LinkItem> */}
            <li>
              {/* <a className={`dark-switch ${theme === THEME ? "active" : ""}`} href="#" onClick={changeThemeFn}>
                {theme === THEME ? (
                  <>
                    <em className="icon ni ni-sun"></em>
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <em className="icon ni ni-moon"></em>
                    <span>Dark Mode</span>
                  </>
                )}
              </a> */}
              {/* <a
                className={`dark-switch ${theme.skin === "dark" ? "active" : ""}`}
                href="#"
                onClick={(ev) => {
                  ev.preventDefault();
                  themeUpdate.skin(theme.skin === "dark" ? "light" : "dark");
                }}
              >
                {theme.skin === "dark" ? (
                  <>
                    <em className="icon ni ni-sun"></em>
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <em className="icon ni ni-moon"></em>
                    <span>Dark Mode</span>
                  </>
                )}
              </a> */}
            </li>
          </LinkList>
        </div>
        <div className="dropdown-inner glassbg glassborderTop">
          {/* <LinkList>
            <a href={`${process.env.PUBLIC_URL}/auth-login`}>
              <Icon name="signout"></Icon>
              <span>Sign Out</span>
            </a>
          </LinkList> */}
          <LinkList>
            <a className="text-white"
              href="#signout"
              onClick={(ev) => {
                ev.preventDefault();
                logout(); // Call logout function from AuthContext
              }}
            >
              <Icon name="signout"></Icon>
              <span>Sign Out</span>
            </a>
          </LinkList>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default User;


