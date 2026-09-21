import React, { useState, useEffect } from "react";
import {
  Block,
  BlockBetween,
  BlockContent,
  BlockHead,
  BlockTitle,
  Icon,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableItem,
  DataTableRow,
  PaginationComponent,
  RSelect,
} from "../../../components/Component";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import { Badge, Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from "reactstrap";
import axiosInstance from "../../../utils/AxiosInstance";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";

// Transaction type enum
const TransactionTypeEnum = {
  AMOUNT_ADD_BY_COMPANY: "AMOUNT_ADD_BY_COMPANY",
  AMOUNT_DEDUCT_BY_COMPANY:"AMOUNT_DEDUCT_BY_COMPANY",
  TOKEN_PURCHASE: "TOKEN_PURCHASE",
  TRANSFER_TO_TOKEN_BALANCE: "TRANSFER_TO_TOKEN_BALANCE",
  // Add other types as needed
};

// Status options for filtering (if needed)
const filterStatusOptions = [
  { label: "All", value: "all" },
  { label: "Token Purchase", value: TransactionTypeEnum.TOKEN_PURCHASE },
  { label: "Transfer to Token", value: TransactionTypeEnum.TRANSFER_TO_TOKEN_BALANCE },
];

function FilanTransaction() {
  const { userInfo } = React.useContext(AuthContext);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("dsc");
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [onSearch, setOnSearch] = useState(false);

  // Fetch transaction history
  const fetchTransactionHistory = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/user/token/history?page=${currentPage}&limit=${itemsPerPage}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (response.data.success) {
        setTransactionHistory(response.data.data.transactionHistories);
        setTotalCount(response.data.data.totalCount);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      toast.error("Failed to load transaction history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, [currentPage, itemsPerPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleSearch = () => setOnSearch(!onSearch);

  const handleSearchChange = (e) => setSearchText(e.target.value);

  const handleTypeFilterChange = (selected) => {
    setFilterType(selected?.value || "all");
  };

  const resetFilters = () => {
    setSearchText("");
    setFilterType("all");
    fetchTransactionHistory();
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case TransactionTypeEnum.TOKEN_PURCHASE:
        return { color: "success", label: "Token Purchase" };
      case TransactionTypeEnum.AMOUNT_ADD_BY_COMPANY:
        return { color: "success", label: "Amount add by company" };
      case TransactionTypeEnum.AMOUNT_DEDUCT_BY_COMPANY:
        return { color: "secondary", label: "Amount deduct by company" };
      case TransactionTypeEnum.TRANSFER_TO_TOKEN_BALANCE:
        return { color: "primary", label: "Transfer" };
      default:
        return { color: "secondary", label: type };
    }
  };

  // Filter transactions based on search and filter criteria
  const filteredTransactions = transactionHistory.filter((item) => {
    const matchesSearch =
      searchText === "" ||
      item.details.toLowerCase().includes(searchText.toLowerCase()) ||
      item.amount.toString().includes(searchText);

    const matchesType = filterType === "all" || item.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <>
      <Head title="Filan History" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockContent>
              <BlockTitle className="text-white" page>
                Filan Transaction History
              </BlockTitle>
            </BlockContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <DataTable className="card-stretch listTable">
            <div className="card-inner">
              <div className="card-title-group">
                <div className="card-title">
                  <h5 className="title">All Filan History</h5>
                </div>

                <div className="card-tools me-n1">
                  <ul className="btn-toolbar gx-1">
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                          <div className="dot dot-primary"></div>
                          <Icon name="filter-alt"></Icon>
                        </DropdownToggle>
                        <DropdownMenu end className="filter-wg dropdown-menu-xl">
                          <div className="dropdown-head">
                            <span className="sub-title dropdown-title">Advanced Filter</span>
                          </div>
                          <div className="dropdown-body dropdown-body-rg">
                            <Row className="gx-6 gy-4">
                              <Col size="6" className="col-6">
                                <div className="form-group">
                                  <label className="overline-title overline-title-alt">Transaction Type</label>
                                  <RSelect
                                    options={filterStatusOptions}
                                    placeholder="Any Type"
                                    onChange={handleTypeFilterChange}
                                    value={filterStatusOptions.find((opt) => opt.value === filterType)}
                                  />
                                </div>
                              </Col>
                              <Col size="12">
                                <div className="form-group">
                                  <Button
                                    type="button"
                                    color="primary"
                                    className="btn btn-primary"
                                    onClick={fetchTransactionHistory}
                                    disabled={loading}
                                  >
                                    {loading ? "Loading..." : "Filter"}
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
                            {[10, 15, 20].map((count) => (
                              <li className={itemsPerPage === count ? "active" : ""} key={count}>
                                <DropdownItem
                                  tag="a"
                                  href="#dropdownitem"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    setItemsPerPage(count);
                                  }}
                                >
                                  {count}
                                </DropdownItem>
                              </li>
                            ))}
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                  </ul>
                </div>

                <div className={`card-search search-wrap ${onSearch ? "active" : ""}`}>
                  <div className="search-content">
                    <Button onClick={toggleSearch} className="search-back btn-icon toggle-search">
                      <Icon name="arrow-left"></Icon>
                    </Button>
                    <input
                      type="text"
                      className="border-transparent form-focus-none form-control"
                      placeholder="Search by details or amount"
                      value={searchText}
                      onChange={handleSearchChange}
                    />
                    <Button className="search-submit btn-icon">
                      <Icon name="search"></Icon>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <DataTableBody bodyclass="nk-tb-tnx">
              <DataTableHead>
                <DataTableRow>
                  <span>Type</span>
                </DataTableRow>
                <DataTableRow className="text-end">
                  <span>Amount</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Tokens</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Date</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Details</span>
                </DataTableRow>
              </DataTableHead>

              {loading ? (
                <DataTableItem>
                  <DataTableRow colSpan="5" className="text-center">
                    <span className="text-silent">Loading transactions...</span>
                  </DataTableRow>
                </DataTableItem>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((item) => (
                  <DataTableItem key={item._id}>
                    <DataTableRow>
                      <Badge className="badge-sm badge-dim" color={getTypeBadge(item.type).color}>
                        {getTypeBadge(item.type).label}
                      </Badge>
                    </DataTableRow>
                    <DataTableRow className="text-end text-nowrap">
                      <span className="tb-amount">{item.amount.toFixed(2)} USD</span>
                    </DataTableRow>
                    <DataTableRow>{item.purchasedToken > 0 ? item.purchasedToken.toFixed(3) : "-"}</DataTableRow>
                    <DataTableRow>{formatDate(item.transactionDate)}</DataTableRow>
                    <DataTableRow>
                      <span className="tb-desc">{item.details}</span>
                    </DataTableRow>
                  </DataTableItem>
                ))
              ) : (
                <DataTableItem>
                  <DataTableRow colSpan="5" className="text-center">
                    <span className="text-silent">No transactions found</span>
                  </DataTableRow>
                </DataTableItem>
              )}
            </DataTableBody>

            <div className="card-inner">
              {!loading && filteredTransactions.length > 0 && (
                <PaginationComponent
                  noDown
                  itemPerPage={itemsPerPage}
                  totalItems={totalCount}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              )}
            </div>
          </DataTable>
        </Block>
      </Content>
    </>
  );
}

export default FilanTransaction;
