import React, { useContext, useEffect, useState } from "react";
import { DropdownToggle, DropdownMenu, UncontrolledDropdown } from "reactstrap";

import Icon from "../../../../components/icon/Icon";
import data from "./NotificationData";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import axiosInstance from "../../../../utils/AxiosInstance";
import { NotificationContext } from "../../../../context/NotificationContext";


const limit = 3; // number of notifications to show

const NotificationItem = (props) => {
  const { icon, iconStyle, text, time, id } = props;
  return (
    <div className="nk-notification-item" key={id} id={id}>
      <div className="nk-notification-icon">
        <Icon name={icon} className={[`icon-circle ${iconStyle ? " " + iconStyle : ""}`]} />
      </div>
      <div className="nk-notification-content">
        <div className="nk-notification-text text-white">{text}</div>
        <div className="nk-notification-time">{time}</div>
      </div>
    </div>
  );
};

const Notification = () => {
  const { userInfo } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
   const { unseenCount, fetchUnseenCount } = useContext(NotificationContext);

  const fetchNotifications = async (pageNum = 1) => {
    try {
      const response = await axiosInstance.get(`/notification/user/get?limit=${limit}&page=${pageNum}`, {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });
      if (response.data.success) {
        setNotifications(response.data.data.data);
        setTotal(response.data.data.total);
      }
    } catch (error) {
      console.error("Failed to fetch user notifications:", error.message);
    }
  };

  // const fetchUnseenCount = async () => {
  //   try {
  //     const response = await axiosInstance.get(`/notification/user/unseen-notif`, {
  //       headers: {
  //         Authorization: `Bearer ${userInfo?.token}`,
  //       },
  //     });
  //     if (response.data.success) {
  //       setUnseenCount(response.data.data.unseenCount);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch unseen count:", error.message);
  //   }
  // };

  useEffect(() => {
    if (userInfo?.token) {
      fetchNotifications();
       fetchUnseenCount();
    }
  }, [userInfo]);
 return (
   <UncontrolledDropdown className="user-dropdown">
     <DropdownToggle tag="a" className="dropdown-toggle nk-quick-nav-icon">
       <div className="icon-status icon-status-info text-white">
         <Icon name="bell" />
         {unseenCount > 0 && (
           <span
             className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
             style={{ fontSize: "10px", minWidth: "18px" }}
           >
             {unseenCount}
           </span>
         )}
       </div>
     </DropdownToggle>
     <DropdownMenu end className="dropdown-menu-xl dropdown-menu-s1 glassborderBottom bg-black">
       <div className="dropdown-head glassbg glassborderBottom">
         <span className="sub-title nk-dropdown-title text-white">Notifications</span>
       </div>
       <div className="dropdown-body bg-black">
         <div className="nk-notification">
           {notifications.length > 0 ? (
             notifications.map((item) => (
               <Link to="/notification" >
                 <NotificationItem
                   key={item._id}
                   id={item._id}
                   icon={item.icon || "bell-fill"} // fallback
                   iconStyle={item.iconStyle}
                   text={item.title}
                   time={new Date(item.createdAt).toLocaleString()}
                 />
               </Link>
             ))
           ) : (
             <div className="nk-notification-item">
               <div className="nk-notification-content text-white text-center">No notifications</div>
             </div>
           )}
         </div>
       </div>
       <div className="dropdown-foot center glassborderBottom glassborderTop bg-black">
         <Link to="/notification" style={{ color: "#f4bd0e" }}>
           View All
         </Link>
       </div>
     </DropdownMenu>
   </UncontrolledDropdown>
 );
};

export default Notification;
