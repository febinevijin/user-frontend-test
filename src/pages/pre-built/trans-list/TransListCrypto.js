import React, { useState, useEffect, useContext } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  ModalBody,
  Modal,
  DropdownItem,
  Form,
  Badge,
} from "reactstrap";
import {
  Button,
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  TooltipComponent,
  Row,
  Col,
  OverlineTitle,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
  RSelect,
} from "../../../components/Component";
import { cryptoActivityOptions, filterCoin, filterPaymentmethod, filterStatusOptions, orderData } from "./TransData";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import axiosInstance from "../../../utils/AxiosInstance";

const TransListCrypto = () => {
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [modal, setModal] = useState({
    add: false,
  });
  // const [modalDetail, setModalDetail] = useState(false);
  const [data, setData] = useState(orderData);
  const [detail, setDetail] = useState({});
  const [formData, setFormData] = useState({
    orderType: "Deposit",
    amountBTC: "",
    amountUSD: "",
    balanceBTC: "",
    balanceUSD: "",
    status: "Pending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("");

  // Sorting data
  const sortFunc = (params) => {
    let defaultData = data;
    if (params === "asc") {
      let sortedData = defaultData.sort((a, b) => a.ref.localeCompare(b.ref));
      setData([...sortedData]);
    } else if (params === "dsc") {
      let sortedData = defaultData.sort((a, b) => b.ref.localeCompare(a.ref));
      setData([...sortedData]);
    }
  };

  // Changing state value when searching name
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = orderData.filter((item) => {
        return item.ref.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...orderData]);
    }
  }, [onSearchText]);

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to reset the form
  const resetForm = () => {
    setFormData({
      orderType: "Buy",
      amountBTC: "",
      amountUSD: "",
      balanceBTC: "",
      balanceUSD: "",
      status: "Pending",
    });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ add: false });
    resetForm();
  };

  // submit function to add a new item
  const onFormSubmit = (submitData) => {
    const { amountBTC, amountUSD, balanceUSD, balanceBTC } = submitData;
    let submittedData = {
      id: data.length + 1,
      ref: "YWLX52JG73",
      date: "18/10/2019 12:04 PM",
      desc: formData.orderType === "Profit" ? "Credited " + formData.orderType : formData.orderType + " Funds",
      orderType: formData.orderType,
      amountBTC: amountBTC,
      amountUSD: amountUSD,
      balanceBTC: balanceBTC,
      balanceUSD: balanceUSD,
      status: formData.status,
    };
    setData([submittedData, ...data]);
    resetForm();
    setModal({ add: false });
  };

  useEffect(() => {
    reset(formData);
  }, [formData]);

  // function to change to approve property for an item
  const onApproveClick = (id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].status = "Completed";
    setData([...newData]);
  };

  // function to change to reject property for an item
  const onRejectClick = (id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].status = "Rejected";
    setData([...newData]);
  };

  // function to load detail data
  // const loadDetail = (id) => {
  //   let index = data.findIndex((item) => item.id === id);
  //   setDetail(data[index]);
  // };

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);

  // function to toggle details modal
  // const toggleModalDetail = () => setModalDetail(!modalDetail);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // backend developer code
  // ********************************
  // Transaction Status Enum
  const TransactionHistoryStatusEnum = {
    PENDING: "0",
    COMPLETED: "1",
    REJECTED: "2",
  };

  const [transactions, setTransactions] = useState([]);
  const { userInfo } = useContext(AuthContext); // Get adminInfo from context
  const [loading, setLoading] = useState(true);
  const [modalDetail, setModalDetail] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null); // For storing the selected transaction details
  const [total, setTotal] = useState();
   const [statusFilter, setStatusFilter] = useState(""); // State for status filter
   const [typeFilter, setTypeFilter] = useState(""); // State for type filter

   const handleStatusFilterChange = (selectedOption) => {
     setStatusFilter(selectedOption.value);
   };
   const handleTypeFilterChange = (selectedOption) => {
     setTypeFilter(selectedOption.value);
   };
  // Fetch transaction list
     const fetchTransactions = async () => {
       try {
         const response = await axiosInstance.get(
           `/user/transaction/list?limit=${itemPerPage}&page=${currentPage}&type=${typeFilter}&status=${statusFilter}`,
           {
             headers: {
               Authorization: `Bearer ${userInfo.token}`, // Bearer token from context
             },
           }
         );
         setTransactions(response.data.data.transactionHistories); // Assuming the response data contains the transaction list
         setTotal(Number(response.data.data.totalCount));
         setLoading(false);
       } catch (error) {
         console.error("Error fetching transactions:", error);
         setLoading(false);
       }
     };
  useEffect(() => {
 

    fetchTransactions();
  }, [userInfo.token, currentPage, itemPerPage]);

  const loadDetail = (transaction) => {
    setSelectedTransaction(transaction); // Set the selected transaction details
    toggleModalDetail(); // Open modal
  };

  const toggleModalDetail = () => {
    setModalDetail(!modalDetail); // Toggle modal visibility
  };

  if (loading) {
    return <p>Loading...</p>; // Handle loading state
  }

   const resetFilters = () => {
     setStatusFilter("");
     setTypeFilter("");
     fetchTransactions(); // Re-fetch data with reset filters
   };

  // ********************************

  return (
    <>
      <Head title="Trasaction History"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle className="text-white" page>Transaction History</BlockTitle>
              {/* <BlockDes className="text-soft">
                <p>You have total 12,835 list.</p>
              </BlockDes> */}
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner">
              <div className="card-title-group">
                <div className="card-title">
                  <h5 className="title">All Transaction History</h5>
                </div>
                <div className="card-tools me-n1">
                  <ul className="btn-toolbar gx-1">
                    {/* <li>
                      <Button
                        href="#search"
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle();
                        }}
                        className="btn-icon search-toggle toggle-search"
                      >
                        <Icon name="search"></Icon>
                      </Button>
                    </li> */}
                    <li className="btn-toolbar-sep"></li>
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                          <div className="dot dot-primary"></div>
                          <Icon name="filter-alt"></Icon>
                        </DropdownToggle>
                        <DropdownMenu end className="filter-wg dropdown-menu-xl">
                          <div className="dropdown-head">
                            <span className="sub-title dropdown-title">Advanced Filter</span>
                            <div className="dropdown">
                              <Button size="sm" className="btn-icon">
                                <Icon name="more-h"></Icon>
                              </Button>
                            </div>
                          </div>
                          <div className="dropdown-body dropdown-body-rg">
                            <Row className="gx-6 gy-4">
                              <Col size="6">
                                <div className="form-group">
                                  <label className="overline-title overline-title-alt">Type</label>
                                  <RSelect
                                    options={cryptoActivityOptions}
                                    placeholder="Any Activity"
                                    onChange={handleTypeFilterChange}
                                  />
                                </div>
                              </Col>
                              <Col size="6">
                                <div className="form-group">
                                  <label className="overline-title overline-title-alt">Status</label>
                                  <RSelect
                                    options={filterStatusOptions}
                                    placeholder="Any Status"
                                    onChange={handleStatusFilterChange}
                                  />
                                </div>
                              </Col>
                              {/* <Col size="6">
                                <div className="form-group">
                                  <label className="overline-title overline-title-alt">Pay Currency</label>
                                  <RSelect options={filterCoin} placeholder="Any coin" />
                                </div>
                              </Col>
                              <Col size="6">
                                <div className="form-group">
                                  <label className="overline-title overline-title-alt">Method</label>
                                  <RSelect options={filterPaymentmethod} placeholder="Any Method" />
                                </div>
                              </Col> */}

                              {/* <Col size="6">
                                <div className="form-group">
                                  <div className="custom-control custom-control-sm custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="includeDel" />
                                    <label className="custom-control-label" htmlFor="includeDel">
                                      {" "}
                                      Including Deleted
                                    </label>
                                  </div>
                                </div>
                              </Col> */}

                              <Col size="12">
                                <div className="form-group">
                                  <Button type="button" className="btn btn-primary" onClick={fetchTransactions}>
                                    Filter
                                  </Button>
                                </div>
                              </Col>
                            </Row>
                          </div>
                          <div className="dropdown-foot between">
                            <a
                              href="#reset"
                              onClick={(ev) => {
                                ev.preventDefault();
                                resetFilters();
                              }}
                              className="clickable"
                            >
                              Reset Filter
                            </a>
                            {/* <a
                              href="#save"
                              onClick={(ev) => {
                                ev.preventDefault();
                                
                              }}
                            >
                              Save Filter
                            </a> */}
                          </div>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                          <Icon name="setting"></Icon>
                        </DropdownToggle>
                        <DropdownMenu end className="dropdown-menu-xs">
                          <ul className="link-check">
                            <li>
                              <span>Show</span>
                            </li>
                            <li className={itemPerPage === 10 ? "active" : ""}>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setItemPerPage(10);
                                }}
                              >
                                10
                              </DropdownItem>
                            </li>
                            <li className={itemPerPage === 15 ? "active" : ""}>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setItemPerPage(15);
                                }}
                              >
                                15
                              </DropdownItem>
                            </li>
                          </ul>
                          <ul className="link-check">
                            <li>
                              <span>Order</span>
                            </li>
                            <li className={sort === "dsc" ? "active" : ""}>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setSortState("dsc");
                                  sortFunc("dsc");
                                }}
                              >
                                DESC
                              </DropdownItem>
                            </li>
                            <li className={sort === "asc" ? "active" : ""}>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setSortState("asc");
                                  sortFunc("asc");
                                }}
                              >
                                ASC
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                  </ul>
                </div>
                <div className={`card-search search-wrap ${!onSearch && "active"}`}>
                  <div className="search-content">
                    <Button
                      onClick={() => {
                        setSearchText("");
                        toggle();
                      }}
                      className="search-back btn-icon toggle-search"
                    >
                      <Icon name="arrow-left"></Icon>
                    </Button>
                    <input
                      type="text"
                      className="border-transparent form-focus-none form-control"
                      placeholder="Search by Order Id"
                      value={onSearchText}
                      onChange={(e) => onFilterChange(e)}
                    />
                    <Button className="search-submit btn-icon">
                      <Icon name="search"></Icon>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DataTableBody bodyclass="nk-tb-tnx">
              {/* DataTableHead with updated fields */}
              <DataTableHead>
                {/* <DataTableRow>
                  <span className="sub-text">User</span>
                </DataTableRow> */}
                <DataTableRow>
                  <span>Type</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Details</span>
                </DataTableRow>
                <DataTableRow className="text-end">
                  <span>Amount</span>
                </DataTableRow>
                <DataTableRow className="text-end">
                  <span>Balance</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Order ID</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Transaction Date</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Status</span>
                </DataTableRow>
                {/* <DataTableRow>
                  <span>Action</span>
                </DataTableRow> */}
              </DataTableHead>

              {/* Map through transactions */}
              {transactions.length > 0 ? (
                transactions.map((item) => (
                  <DataTableItem key={item._id}>
                    {/* <DataTableRow>
                      <Link to={`${process.env.PUBLIC_URL}/user-profile/${item.userId._id}`}>
                        <div className="user-card">
                          <div className="user-info">
                            <span className="tb-lead">{`${item.userId.firstName} ${item.userId.lastName}`}</span>
                            <span>{item.userId.email}</span>
                            <br />
                            <span>{item.userId.ID}</span>
                          </div>
                        </div>
                      </Link>
                    </DataTableRow> */}
                    <DataTableRow>
                      <span>{item.type.replace(/_/g, " ")}</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>{item.details}</span>
                    </DataTableRow>
                    <DataTableRow className="text-nowrap">
                      <span className="tb-amount">{item.amount.toFixed(2)} USD</span>
                    </DataTableRow>
                    <DataTableRow className="text-nowrap">
                      <span className="tb-amount">{item.balanceAfter.toFixed(2)} USD</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>{item.orderId || "N/A"}</span> {/* Replace 'planId' with 'orderId' if applicable */}
                    </DataTableRow>
                    <DataTableRow>
                      <span className="text-nowrap">{new Date(item.transactionDate).toLocaleString()}</span>
                    </DataTableRow>
                    <DataTableRow>
                      <Badge
                        className="badge-sm badge-dim"
                        color={
                          item.status === TransactionHistoryStatusEnum.COMPLETED
                            ? "success"
                            : item.status === TransactionHistoryStatusEnum.PENDING
                            ? "info"
                            : "danger"
                        }
                      >
                        {item.status === TransactionHistoryStatusEnum.COMPLETED
                          ? "Completed"
                          : item.status === TransactionHistoryStatusEnum.PENDING
                          ? "Pending"
                          : "Rejected"}
                      </Badge>
                    </DataTableRow>

                    {/* Action buttons with details icon */}
                    {/* <DataTableRow>
                      <ul>
                        <li
                          onClick={() => {
                            loadDetail(item);
                          }}
                        >
                          <TooltipComponent
                            tag="a"
                            containerClassName="bg-white btn btn-sm btn-outline-light btn-icon btn-tooltip"
                            id={`id-${item._id}-details`} // Prefix the ID with 'id-' to make it a valid CSS selector
                            icon="eye"
                            direction="top"
                            text="Details"
                          />
                        </li>
                      </ul>
                    </DataTableRow> */}
                  </DataTableItem>
                ))
              ) : (
                <p className="text-white">No transactions found</p>
              )}
            </DataTableBody>
            <div className="card-inner">
              {currentItems.length > 0 ? (
                <PaginationComponent
                  noDown
                  itemPerPage={itemPerPage}
                  totalItems={total}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              ) : (
                <div className="text-center">
                  <span className="text-silent text-white">No data found</span>
                </div>
              )}
            </div>
          </DataTable>
        </Block>

        {/* <Modal isOpen={modal.add} toggle={() => setModal({ add: false })} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a
              href="#close"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Add Transaction</h5>
              <Form className="mt-4" onSubmit={handleSubmit(onFormSubmit)} noValidate>
                <Row className="g-gs">
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Order Type</label>
                      <div className="form-control-wrap">
                        <RSelect
                          options={cryptoActivityOptions}
                          value={{
                            value: formData.orderType,
                            label: formData.orderType,
                          }}
                          onChange={(e) => setFormData({ ...formData, orderType: e.value })}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <div className="form-control-wrap">
                        <RSelect
                          options={filterStatusOptions}
                          value={{
                            value: formData.status,
                            label: formData.status,
                          }}
                          onChange={(e) => setFormData({ ...formData, status: e.value })}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
                <OverlineTitle className="pt-4"> Amount </OverlineTitle>
                <hr className="hr mt-2 border-light" />
                <Row className="g-gs">
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">BTC</label>
                      <input
                        type="number"
                        {...register("amountBTC", { required: "This field is required" })}
                        value={formData.amountBTC}
                        onChange={(e) => setFormData({ ...formData, amountBTC: e.target.value })}
                        className="form-control"
                      />
                      {errors.amountBTC && <span className="invalid">{errors.amountBTC.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">USD</label>
                      <input
                        type="number"
                        {...register("amountUSD", { required: "This field is required" })}
                        value={formData.amountUSD}
                        onChange={(e) => setFormData({ ...formData, amountUSD: e.target.value })}
                        className="form-control"
                      />
                      {errors.amountUSD && <span className="invalid">{errors.amountUSD.message}</span>}
                    </div>
                  </Col>
                </Row>
                <OverlineTitle className="pt-4"> Balance </OverlineTitle>
                <hr className="hr mt-2 border-light" />
                <Row className="gy-4">
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">BTC</label>
                      <input
                        type="number"
                        {...register("balanceBTC", { required: "This field is required" })}
                        value={formData.balanceBTC}
                        onChange={(e) => setFormData({ ...formData, balanceBTC: e.target.value })}
                        className="form-control"
                      />
                      {errors.balanceBTC && <span className="invalid">{errors.balanceBTC.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">USD</label>
                      <input
                        type="number"
                        {...register("balanceUSD", { required: "This field is required" })}
                        value={formData.balanceUSD}
                        onChange={(e) => setFormData({ ...formData, balanceUSD: e.target.value })}
                        className="form-control"
                      />
                      {errors.balanceUSD && <span className="invalid">{errors.balanceUSD.message}</span>}
                    </div>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button type="submit" color="primary" size="md">
                          Add Transaction
                        </Button>
                      </li>
                      <li>
                        <a
                          href="#cancel"
                          onClick={(ev) => {
                            ev.preventDefault();
                            onFormCancel();
                          }}
                          className="link link-light"
                        >
                          Cancel
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </Form>
            </div>
          </ModalBody>
        </Modal> */}

        {/* <Modal isOpen={modalDetail} toggle={() => toggleModalDetail()} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                toggleModalDetail();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="nk-modal-head mb-3">
              <h4 className="nk-modal-title title">
                Transaction <small className="text-primary">{detail.transactionId}</small>
              </h4>
            </div>
            <div className="nk-tnx-details">
              <BlockBetween className="flex-wrap g-3">
                <div className="nk-tnx-type">
                  <div
                    className={`nk-tnx-type-icon bg-${
                      detail.status === "Completed"
                        ? "success"
                        : detail.status === "Upcoming"
                        ? "warning"
                        : detail.status === "Pending"
                        ? "info"
                        : "danger"
                    } text-white`}
                  >
                    <Icon name="arrow-up-right"></Icon>
                  </div>
                  <div className="nk-tnx-type-text">
                    <h5 className="title">+ {detail.amountBTC} BTC</h5>
                    <span className="sub-text mt-n1">{detail.date}</span>
                  </div>
                </div>
                <ul className="align-center flex-wrap gx-3">
                  <li>
                    <Badge
                      color={
                        detail.status === "Completed"
                          ? "success"
                          : detail.status === "Upcoming"
                          ? "warning"
                          : detail.status === "Pending"
                          ? "info"
                          : "danger"
                      }
                      size="sm"
                    >
                      {detail.status}
                    </Badge>
                  </li>
                </ul>
              </BlockBetween>
              <div className="nk-modal-head mt-4 mb-3">
                <h5 className="title">Transaction Info</h5>
              </div>
              <Row className="gy-3">
                <Col lg={6}>
                  <span className="sub-text">Order ID</span>
                  <span className="caption-text">{detail.ref}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Reference ID</span>
                  <span className="caption-text text-break">{detail.referenceId}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Transaction Fee</span>
                  <span className="caption-text">{detail.transactionFee} BTC</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Amount</span>
                  <span className="caption-text">{detail.amountBTC} BTC</span>
                </Col>
              </Row>
              <div className="nk-modal-head mt-4 mb-3">
                <h5 className="title">Transaction Details</h5>
              </div>
              <Row className="gy-3">
                <Col lg={6}>
                  <span className="sub-text">Transaction Type</span>
                  <span className="caption-text">{detail.orderType}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Payment Gateway</span>
                  <span className="caption-text align-center">
                    CoinPayments{" "}
                    <Badge color="primary" className="ms-2 text-white">
                      Online Gateway
                    </Badge>
                  </span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Payment From</span>
                  <span className="caption-text text-break">{detail.paymentForm}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Payment To</span>
                  <span className="caption-text text-break">{detail.paymentTo}</span>
                </Col>
                <Col lg={12}>
                  <span className="sub-text">Transaction Hash</span>
                  <span className="caption-text text-break">{detail.transactionHash}</span>
                </Col>
                <Col lg={12}>
                  <span className="sub-text">Details</span>
                  <span className="caption-text">{detail.orderType} funds</span>
                </Col>
              </Row>
            </div>
          </ModalBody>
        </Modal> */}
        {/* Modal to display transaction details */}
        {selectedTransaction && (
          <Modal isOpen={modalDetail} toggle={toggleModalDetail} className="modal-dialog-centered" size="lg">
            <ModalBody>
              <a
                href="#cancel"
                onClick={(ev) => {
                  ev.preventDefault();
                  toggleModalDetail();
                }}
                className="close"
              >
                <Icon name="cross-sm"></Icon>
              </a>
              <div className="nk-modal-head mb-4">
                <h4 className="nk-modal-title title">
                  Transaction <small className="text-primary ms-2">{selectedTransaction._id}</small>
                </h4>
              </div>
              <div className="nk-tnx-details">
                <BlockBetween className="flex-wrap g-3">
                  <div className="nk-tnx-type">
                    <div
                      className={`nk-tnx-type-icon bg-${
                        selectedTransaction.status === TransactionHistoryStatusEnum.COMPLETED
                          ? "success"
                          : selectedTransaction.status === TransactionHistoryStatusEnum.PENDING
                          ? "info"
                          : "danger"
                      } text-white`}
                    >
                      <Icon name="arrow-up-right"></Icon>
                    </div>
                    <div className="nk-tnx-type-text">
                      <h5 className="title">+ {selectedTransaction.amount} USD</h5>
                      <span className="sub-text mt-n1">
                        {new Date(selectedTransaction.transactionDate).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <ul className="align-center flex-wrap gx-3">
                    <li>
                      <Badge
                        color={
                          selectedTransaction.status === TransactionHistoryStatusEnum.COMPLETED
                            ? "success"
                            : selectedTransaction.status === TransactionHistoryStatusEnum.PENDING
                            ? "info"
                            : "danger"
                        }
                        size="sm"
                      >
                        {selectedTransaction.status === TransactionHistoryStatusEnum.COMPLETED
                          ? "Completed"
                          : selectedTransaction.status === TransactionHistoryStatusEnum.PENDING
                          ? "Pending"
                          : "Rejected"}
                      </Badge>
                    </li>
                  </ul>
                </BlockBetween>
                <div className="nk-modal-head mt-5 mb-3">
                  <h5 className="title">Transaction Info</h5>
                </div>
                <Row className="gy-3">
                  <Col lg={6}>
                    <span className="sub-text">Order ID</span>
                    <span className="caption-text">{selectedTransaction.planId || "N/A"}</span>
                  </Col>
                  <Col lg={6}>
                    <span className="sub-text">Details</span>
                    <span className="caption-text">{selectedTransaction.details}</span>
                  </Col>
                </Row>
              </div>
            </ModalBody>
          </Modal>
        )}
      </Content>
    </>
  );
};

export default TransListCrypto;
