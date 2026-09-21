import React, { useEffect, useState, useContext } from "react";
import { Block, BlockBetween, BlockContent, BlockHead, BlockTitle, Button, Icon, PreviewCard } from "../../../components/Component";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import { AuthContext } from "../../../context/AuthContext"; // adjust path as per your app
import { Modal, ModalBody, Pagination } from "reactstrap"; // optional for UI
import axiosInstance from "../../../utils/AxiosInstance";
import { NotificationContext } from "../../../context/NotificationContext";

function Announcement() {
  const { userInfo } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const [announcementModal, setAnnouncementModal] = useState(false);
  const { fetchUnseenCount } = useContext(NotificationContext);


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

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

  const handleSeeMore = async (item) => {
    if (!item.seen) {
      try {
        await axiosInstance.put(
          `/notification/user/${item._id}/seen`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userInfo?.token}`,
            },
          }
        );

        setNotifications((prev) => prev.map((n) => (n._id === item._id ? { ...n, seen: true } : n)));

        // 👉 Call global function to refresh unseen count
        fetchUnseenCount();
      } catch (error) {
        console.error("Error marking notification as seen:", error.message);
      }
    }

    setSelectedNotification(item);
    setAnnouncementModal(true);
  };

  return (
    <>
      <Head title="Notification" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween className="g-3">
            <BlockContent>
              <BlockTitle className="text-white">Notifications</BlockTitle>
            </BlockContent>
          </BlockBetween>
        </BlockHead>

        <Block size="lg">
          {notifications.map((item) => (
            <PreviewCard className="col-md-12" key={item._id}>
              <p className="text-end text-white mt-0">{new Date(item.createdAt).toLocaleDateString()}</p>

              {item.seen && <p className="text-success fw-bold mb-1">Seen</p>}

              <p className="text-white mt-0" dangerouslySetInnerHTML={{ __html: item.title }} />
              <Button className="p-0" style={{ color: "#f4bd0e" }} onClick={() => handleSeeMore(item)}>
                See more
              </Button>
            </PreviewCard>
          ))}

          {/* Pagination */}
          {total > limit && (
            <div className="mt-3 d-flex justify-content-center">
              <Pagination aria-label="Page navigation example">
                {[...Array(Math.ceil(total / limit)).keys()].map((i) => (
                  <li
                    className={`page-item ${page === i + 1 ? "active" : ""}`}
                    key={i}
                    onClick={() => setPage(i + 1)}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="page-link">{i + 1}</span>
                  </li>
                ))}
              </Pagination>
            </div>
          )}
        </Block>

        {/* Modal */}
        <Modal
          isOpen={announcementModal}
          className="modal-dialog-centered"
          size="lg"
          toggle={() => setAnnouncementModal(false)}
        >
          <a
            href="#dropdownitem"
            onClick={(ev) => {
              ev.preventDefault();
              setAnnouncementModal(false);
              setSelectedNotification(null);
            }}
            className="close"
          >
            <Icon name="cross-sm"></Icon>
          </a>
          <ModalBody>
            <div className="p-2">
              <h5 className="title text-white">{selectedNotification?.title}</h5>
              <div className="tab-content mt-5">
                <p
                  className="text-white mt-0"
                  dangerouslySetInnerHTML={{ __html: selectedNotification?.description }}
                />
              </div>
            </div>
          </ModalBody>
        </Modal>
      </Content>
    </>
  );
}

export default Announcement;

