import React, { useContext, useEffect, useState } from 'react'
import Head from '../../../layout/head/Head'
import Content from '../../../layout/content/Content'
import { BlockBetween, BlockDes, BlockHead, BlockHeadContent, BlockTitle, DataTableBody, DataTableHead, DataTableItem, DataTableRow, Icon, PreviewAltCard, PreviewCard, UserAvatar } from '../../../components/Component'
import { Col, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, Row, TabContent, Table, TabPane, UncontrolledDropdown } from 'reactstrap'
import { findUpper } from '../../../utils/Utils'
import { AuthContext } from '../../../context/AuthContext'
import axiosInstance from '../../../utils/AxiosInstance'
import classnames from "classnames";
import DataTable from 'react-data-table-component'

// function RefferBonus() {
//   const { userInfo } = useContext(AuthContext); // Get userInfo from AuthContext
//   const [referredUsers, setReferredUsers] = useState([]); // State to store referred users list
//   const [activeTab, setActiveTab] = useState("1");

//   const toggle = (tab) => {
//     if (activeTab !== tab) setActiveTab(tab);
//   };
  
//   // Fetch referral user list from API
//   const fetchReferredUsers = async () => {
//     try {
//       const response = await axiosInstance.get("/user/referral/user-list", {
//         headers: {
//           Authorization: `Bearer ${userInfo.token}`, // Pass token in the request headers
//         },
//       });

//       // Update state with the referred user list
//       if (response.data && response.data.success) {
//         setReferredUsers(response.data.data.referredUserList);
//       }
//     } catch (error) {
//       console.error("Error fetching referred users:", error);
//     }
//   };

//   // Call API on component mount
//   useEffect(() => {
//     fetchReferredUsers();
//   }, []);
//   return (
//     <>
//       <Head title="Refferal bonus"></Head>

//       <Content>
//         <BlockHead size="sm">
//           <BlockBetween>
//             <BlockHeadContent>
//               <BlockTitle className="text-white" page>Referred List</BlockTitle>
//               {/* <BlockDes className="text-soft">
//                 <p>Review your current bonuses.</p>
//               </BlockDes> */}
//             </BlockHeadContent>
//           </BlockBetween>
//         </BlockHead>

//         <PreviewCard>
//             <Nav tabs className="mt-n3">
//               <NavItem>
//                 <NavLink
//                   tag="a"
//                   href="#tab"
//                   className={classnames({ active: activeTab === "1" })}
//                   onClick={(ev) => {
//                     ev.preventDefault();
//                     toggle("1");
//                   }}
//                 >
//                   Level 1
//                 </NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink
//                   tag="a"
//                   href="#tab"
//                   className={classnames({ active: activeTab === "2" })}
//                   onClick={(ev) => {
//                     ev.preventDefault();
//                     toggle("2");
//                   }}
//                 >
//                   Level 2
//                 </NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink
//                   tag="a"
//                   href="#tab"
//                   className={classnames({ active: activeTab === "3" })}
//                   onClick={(ev) => {
//                     ev.preventDefault();
//                     toggle("3");
//                   }}
//                 >
//                   Level 3
//                 </NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink
//                   tag="a"
//                   href="#tab"
//                   className={classnames({ active: activeTab === "4" })}
//                   onClick={(ev) => {
//                     ev.preventDefault();
//                     toggle("4");
//                   }}
//                 >
//                   Level 4
//                 </NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink
//                   tag="a"
//                   href="#tab"
//                   className={classnames({ active: activeTab === "5" })}
//                   onClick={(ev) => {
//                     ev.preventDefault();
//                     toggle("5");
//                   }}
//                 >
//                   Level 5
//                 </NavLink>
//               </NavItem>
//             </Nav>
//             <TabContent activeTab={activeTab}>
//               <TabPane tabId="1">
//               <Row>
//           {referredUsers.length > 0 ? (
//             referredUsers.map((user) => (
//               <Col key={user._id} md="6" lg="4" className="mb-4">
//                 <PreviewAltCard>
//                   <div className="team">
//                     <div className="user-card user-card-s2">
//                       <UserAvatar
//                         theme="primary"
//                         className="lg"
//                         text={user.firstName.charAt(0) + user.lastName.charAt(0)}
//                       >
//                         <div className="status dot dot-lg dot-success"></div>
//                       </UserAvatar>
//                       <div className="user-info">
//                         <h6 className="text-white">{`${user.firstName} ${user.lastName}`}</h6>
//                       </div>
//                     </div>
//                     <ul className="team-info">
//                       <li className="h4">
//                         <span className="text-white">Joined Date</span>
//                         <span className="text-white">{new Date(user.createdAt).toLocaleDateString()}</span>
//                       </li>
//                       <li className="h4">
//                         <span className="text-white">Contact</span>
//                         <span className="text-white">{`${user.countryCode} ${user.phone}`}</span>
//                       </li>
//                       <li className="h4">
//                         <span className="text-white">Email</span>
//                         <span className="text-white">{user.email}</span>
//                       </li>
//                       <li className="h4">
//                         <span className="text-white">ID</span>
//                         <span className="text-white">{user.ID}</span>
//                       </li>
//                       {/* <li className="h4">
//                         <span>KYC Status</span>
//                         <span>{user.kycStatus === "4" ? "Verified" : "Not Verified"}</span>
//                       </li> */}
//                     </ul>
//                   </div>
//                 </PreviewAltCard>
//               </Col>
//             ))
//           ) : (
//             <p className='text-white'>No referred users found.</p>
//           )}
//         </Row>
//               </TabPane>
//               <TabPane tabId="2">
//                 <p>
//                   Culpa dolor voluptate do laboris laboris irure reprehenderit id incididunt duis pariatur mollit aute
//                   magna pariatur consectetur. Eu veniam duis non ut dolor deserunt commodo et minim in quis laboris
//                   ipsum velit id veniam. Quis ut consectetur adipisicing officia excepteur non sit. Ut et elit aliquip
//                   labore Lorem enim eu. Ullamco mollit occaecat dolore ipsum id officia mollit qui esse anim eiusmod do
//                   sint minim consectetur qui.
//                 </p>
//               </TabPane>
//               <TabPane tabId="3">
//                 <p>
//                   Fugiat id quis dolor culpa eiusmod anim velit excepteur proident dolor aute qui magna. Ad proident
//                   laboris ullamco esse anim Lorem Lorem veniam quis Lorem irure occaecat velit nostrud magna nulla.
//                   Velit et et proident Lorem do ea tempor officia dolor. Reprehenderit Lorem aliquip labore est magna
//                   commodo est ea veniam consectetur.
//                 </p>
//               </TabPane>
//               <TabPane tabId="4">
//                 <p>
//                   Eu dolore ea ullamco dolore Lorem id cupidatat excepteur reprehenderit consectetur elit id dolor
//                   proident in cupidatat officia. Voluptate excepteur commodo labore nisi cillum duis aliqua do. Aliqua
//                   amet qui mollit consectetur nulla mollit velit aliqua veniam nisi id do Lorem deserunt amet. Culpa
//                   ullamco sit adipisicing labore officia magna elit nisi in aute tempor commodo eiusmod.
//                 </p>
//               </TabPane>
//               <TabPane tabId="5">
//                 <p>
//                   Eu dolore ea ullamco dolore Lorem id cupidatat excepteur reprehenderit consectetur elit id dolor
//                   proident in cupidatat officia. Voluptate excepteur commodo labore nisi cillum duis aliqua do. Aliqua
//                   amet qui mollit consectetur nulla mollit velit aliqua veniam nisi id do Lorem deserunt amet. Culpa
//                   ullamco sit adipisicing labore officia magna elit nisi in aute tempor commodo eiusmod.
//                 </p>
//               </TabPane>
//             </TabContent>
//           </PreviewCard>
//       </Content>
//     </>
//   );
// }

function RefferBonus() {
  const { userInfo } = useContext(AuthContext); // Get userInfo from AuthContext
  const [referredUsers, setReferredUsers] = useState([]); // State to store referred users list
  const [activeTab, setActiveTab] = useState("1");
  const [loading, setLoading] = useState(false); // State to track loading status

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  // Fetch referral user list from API
  const fetchReferredUsers = async () => {
    setLoading(true); // Start loader
    try {
      const response = await axiosInstance.get(`/user/referral/list?level=${activeTab - 1}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`, // Pass token in the request headers
        },
      });

      // Update state with the referred user list
      if (response.data && response.data.success) {
        setReferredUsers(response.data.data.referralHistories);
      }
    } catch (error) {
      console.error("Error fetching referred users:", error);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  // Call API on component mount and tab change
  useEffect(() => {
    fetchReferredUsers();
  }, [activeTab]);

  return (
    <>
      <Head title="Refferal bonus"></Head>

      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle className="text-white" page>
                Referred List
              </BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <PreviewCard>
          <Nav tabs className="mt-n3">
            {[...Array(5)].map((_, index) => (
              <NavItem key={index}>
                <NavLink
                  tag="a"
                  href="#tab"
                  className={classnames({ active: activeTab === (index + 1).toString() })}
                  onClick={(ev) => {
                    ev.preventDefault();
                    toggle((index + 1).toString());
                  }}
                >
                  Level {index + 1}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId={activeTab}>
              {loading ? (
                <p className="text-white">Loading...</p>
              ) : (
                <Row className="tableOverflow p-3">
                  {referredUsers.length > 0 ? (
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th className="bg-transparent text-white p-2">ID</th>
                          <th className="bg-transparent text-white p-2">Name</th>
                          <th className="bg-transparent text-white p-2">Email</th>
                          <th className="bg-transparent text-white p-2">Referral Amount</th>
                          <th className="bg-transparent text-white p-2">First Deposit Fund</th>
                          <th className="bg-transparent text-white p-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {referredUsers.map((user) => (
                          <tr className="bg-transparent" key={user._id}>
                            <td className="bg-transparent text-white p-2">{user.referralUserId.ID}</td>
                            <td className="bg-transparent text-white p-2 text-nowrap">
                              {user.referralUserId.firstName} <br />
                              {user.referralUserId.lastName}
                            </td>
                            <td className="bg-transparent text-white p-2">{user.referralUserId.email}</td>
                            <td className="bg-transparent text-white p-2">{user.referralAmount.toFixed(2)}</td>
                            <td className="bg-transparent text-white p-2">{user.referralUserFirstFund}</td>
                            <td className="bg-transparent text-white p-2">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-white">No referred users found.</p>
                  )}
                </Row>
              )}
            </TabPane>
          </TabContent>
        </PreviewCard>
      </Content>
    </>
  );
}



export default RefferBonus