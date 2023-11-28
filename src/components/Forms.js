/*global chrome*/
import React, { useRef } from "react";
import { useState, useEffect } from "react";
import requestInstance from "../utils/request";
import { API_ENDPOINT } from "../services/api";
import ProgressBar1 from "./ProgressBar";
import "./Form.css";
import { MdSpaceDashboard } from "react-icons/md";
import { BiLogOutCircle } from "react-icons/bi";
import { BiPlusCircle } from "react-icons/bi";
import { RxCrossCircled } from "react-icons/rx";
import { BsPerson } from "react-icons/bs";
import { TiTick } from "react-icons/ti";
import { FiMail } from "react-icons/fi";
import { BsPhone } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa";
import Navbar from "./navbar/Navbar";
import axios from "axios";
import Loader from "./Loader";
import { useLayoutEffect } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";


const Forms = (props) => {
  const [selectedUserData, setselectedUserData] = useState("");
  const [responseData, setresponseData] = useState();
  const [showDashboardButton, setshowDashboardButton] = useState(true);
  const [userList, setUserList] = useState([]);
  const [showProgressBar, setshowProgressBar] = useState(false);
  const [progressBarCompleted, setprogressBarCompleted] = useState(0);
  const [errMessage, setErrMessage] = useState(false);
  const [creditlimit, setCreditlimit] = useState(false);
  const [errValue, setErrValue] = useState("");
  const [errImg, setErrImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [multipleData, setmultipleData] = useState([]);
  const [email, setEmail] = useState([]);
  const [copied, setCopied] = useState(false);
  const [dash, setDash] = useState(false);
  const [userDash, setUserDash] = useState(false);
  const [bulkloading, setbulkloading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [tooltipText, setTooltipText] = useState('Click to copy');
  const emailRef = useRef(null);
  const target = useRef(null);
  const [websiteData, setWebsiteData] = useState();
  console.log("🚀 ~ file: Forms.js:52 ~ Forms ~ websiteData:", websiteData)

  const baseUrl = window.location.origin;

  const [spin, setSpin] = useState({
    load: 0,
    id: 0,
  });

  //API for data scraping
  const handleGetApi = (obj) => {
    setresponseData("");
    setLoading(true);
    setselectedUserData(obj.linkedin_user_name);
    requestInstance
      .post(API_ENDPOINT.LINKEDIN_SCRAPER_API, obj)
      .then((res) => {
        if (res.status == 200) {
          setshowProgressBar(false);
          setLoading(false);
          setresponseData(res.data);
          setCreditlimit(true);
          setErrMessage(false);
          setErrValue("");
          setUserDash(true);
          if (res?.data?.credit_data?.remaining_credit > 0) {
            setErrMessage(false);
            setErrValue("");
          } else {
            if (res?.data?.data?.first_name) {
              setErrMessage(false);
              setErrValue("");
            } else {
              setLoading(false);
              setresponseData("");
              setErrMessage(true);
              setErrValue(res?.data?.message || "Something went wrong");
            }
          }
          localStorage.setItem(
            "credit_left",
            res.data.credit_data.remaining_credit
          );
          localStorage.setItem(
            "credit_limit",
            res.data.credit_data.credit_limit
          );
          //console.log(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status == 403) {
          setshowProgressBar(false);
          props.setislogedIn(false);
          props.setlogin(true);
          localStorage.clear();
        } else {
          setLoading(false);
          setshowProgressBar(false);
          setErrMessage(true);
          // console.log(err.message)
          setErrValue(
            err?.response?.data?.message ||
              err?.message ||
              "Something went wrong"
          );
        }
      });
  };

  // GET SELECTED USER
  const handleGetSelectedUserData = (e) => {
    e.preventDefault();
    setshowProgressBar(true);

    setprogressBarCompleted(0);
    setprogressBarCompleted(40);
    chrome?.tabs?.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let url = tabs[0]?.url;
      chrome?.tabs?.query(
        { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
        function (tab) {
          setshowDashboardButton(false);
          const obj = {
            linkedin_user_name: tab[0]?.url,
          };

          // chrome.cookies.get(
          //   { url: tab[0]?.url, name: "li_at" },
          //   function (cookies_li_at) {
          //     let li_at_value = cookies_li_at.value;
          //     //console.log(cookies_li_at.value);
          //     localStorage.setItem("li_at", cookies_li_at.value);
          //     chrome.cookies.get(
          //       { url: tab[0]?.url, name: "JSESSIONID" },
          //       function (cookies_JSESSIONID) {
          //         let jsession_value = JSON.stringify(cookies_JSESSIONID.value);
          //         let trimjsession = jsession_value.substring(
          //           3,
          //           jsession_value.length - 3
          //         );
          //         getCookies(li_at_value, trimjsession);

          //         //console.log(trimjsession);
          //         localStorage.setItem(
          //           "id",
          //           JSON.stringify(cookies_JSESSIONID.value)
          //         );
          //       }
          //     );
          //   }
          // );

          handleGetApi(obj);
        }
      );
    });
  };

  const li = localStorage.getItem("li_at");
  const jsession = localStorage.getItem("id");

  // API for cookies
  const getCookies = (li_at_value, trimjsession) => {
    let data = {
      li_at: li_at_value,
      jsessionid: trimjsession,
    };

    requestInstance
      .post(API_ENDPOINT.COOKIES_DATA_API, data)
      .then((res) => {
        //console.log(res);
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  // -----API FOR BULK DATA----

  const BulkData = (bulk) => {
    setshowProgressBar(true);
    setselectedUserData(bulk.url);
    let Bulkapi = `?limit=${limit}&offset=${offset}`;
    requestInstance
      .post(`${API_ENDPOINT.BULK_DATA_API}${Bulkapi}`, bulk)
      .then((res) => {
        //console.log(res);
        setshowProgressBar(false);
        setDash(true);
        //setCreditlimit(true);
        //console.log(res.data.data);
        setmultipleData(res?.data?.results);
        setTotalPages(Math.ceil(res?.data?.count / limit));
      })
      .catch((err) => {
        //console.log(err);
        setshowProgressBar(false);
        setErrMessage(true);
        setErrValue(
          err?.response?.data?.message || err?.message || "Something went wrong"
        );
      });
  };

  function handlePageChange(selectedPage) {
    const newOffset = selectedPage * limit;
    setOffset(newOffset);
    setmultipleData([]);
  }

  // Update State

  const updateData = (data) => {
    let tData = multipleData.map((x) => {
      if (x.id == data.id) {
        let y = { ...x };
        y.active_guess_email = data.active_guess_email;
        y.email = data.email;
        y.designation = data.designation;
        y.company = data.company;
        y.is_available = true;
        //y.image_url = data.image_url;
        // console.log(y);
        return y;
      } else {
        return x;
      }
    });
    setmultipleData(tData);
  };

  // end of update

  // API for selected data in Bulk api
  const handleClickEmail = (data) => {
    setSpin({
      load: 1,
      id: data.id,
    });
    setLoading(true);
    setCreditlimit(false);
    let linkedin_user_name = `https://www.linkedin.com/in/${data.linkedin_user_name}/`;
    requestInstance
      .post(API_ENDPOINT.LINKEDIN_SCRAPER_API, { linkedin_user_name })
      .then((response) => {
        //console.log(response.data);
        setLoading(false);
        setSpin({
          load: 0,
          id: 0,
        });
        setCreditlimit(true);
        setDash(true);
        setEmail(response.data.data);
        updateData(response.data.data);
        localStorage.setItem(
          "credit_left",
          response.data.credit_data.remaining_credit
        );
        localStorage.setItem(
          "credit_limit",
          response.data.credit_data.credit_limit
        );
      })
      .catch((error) => {
       // console.log(error.message);
        toast.error(error?.message);
        setLoading(false);
        setCreditlimit(true);
        setSpin({
          load: 0,
          id: 0,
        });
      });
  };

  const handleGetBulkData = () => {
    // document.getElementById("bulkdata").style.display= "none"
    chrome?.tabs?.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let url = tabs[0]?.url;
      chrome?.tabs?.query(
        { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
        function (tab) {
          const bulk = {
            url: tab[0]?.url,
          };
          const tabURL = tab[0]?.url;
          chrome.cookies.get(
            { url: tab[0]?.url, name: "li_at" },
            function (cookies_li_at) {
              let li_at_value = cookies_li_at.value;
              //console.log(cookies_li_at.value);
              localStorage.setItem("li_at", cookies_li_at.value);
              chrome.cookies.get(
                { url: tab[0]?.url, name: "JSESSIONID" },
                function (cookies_JSESSIONID) {
                  let jsession_value = JSON.stringify(cookies_JSESSIONID.value);
                  let trimjsession = jsession_value.substring(
                    3,
                    jsession_value.length - 3
                  );
                  getCookies(li_at_value, trimjsession);

                  //console.log(trimjsession);
                  localStorage.setItem(
                    "id",
                    JSON.stringify(cookies_JSESSIONID.value)
                  );
                }
              );
            }
          );
          let UrlData = tabURL?.split("/");
          if (UrlData.includes("mynetwork") || UrlData.includes("search")) {
            BulkData(bulk);
            document.getElementById("bulkdata").style.display = "block";
            document.getElementsByClassName("btnget")[0].style.display = "none";
          }
        }
      );
    });
  };

  useEffect(() => {
    handleGetBulkData();
  }, [limit, offset]);

  // Copy Function
  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        if (!copied) {
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 1000);
        }
      })

      .catch((err) => console.error("Failed to copy text: ", err));
  };

  // API for excel sheet
  const API_URL = process.env.REACT_APP_DISCOVEMAIL_API;
  const handleExportToFile = () => {
    setFileLoading(true);
    const token = localStorage.getItem("extension");
    axios({
      url: API_URL+"user/get/excel/data",
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}  `,
      },
    })
    // requestInstance.get(API_ENDPOINT.EXCEL_SHEET)
      .then((response) => {
        const href = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", "Discovemail.csv"); //or any other extension    document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
        setFileLoading(false);
      })
      .catch((err) => {
        setFileLoading(false);
        if (err.response && err.response.status == 403) {
          props.setislogedIn(false);
          props.setlogin(true);
          localStorage.clear();
        }
      });
  };

  // API FOR BULK DATA EXCEL
  const handleBulkExcel = () => {
    setbulkloading(true);
    const token = localStorage.getItem("extension");
    axios({
      url: API_URL+"user/get/excel/data?connection=true",
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}  `,
      },
    })
      .then((response) => {
        const href = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", "Discovemail.csv"); //or any other extension    document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
        setbulkloading(false);
      })
      .catch((err) => {
        setbulkloading(false);
        if (err.response && err.response.status == 403) {
          props.setislogedIn(false);
          props.setlogin(true);
          localStorage.clear();
        }
      });
  };

  const handleViewDashboard = (e) => {
    props.setislogedIn(false);
    props.setdashboardView(true);
  };

  // For logout Button
  const onLogOut = () => {
    props.setislogedIn(false);
    props.setlogin(true);
    localStorage.clear();
  };

  const handleClipboard = () =>{
    const emailText = emailRef.current.innerText;
    navigator.clipboard.writeText(emailText)
      .then(() => {
        console.log('Text copied to clipboard:', emailText);
        setTooltipText('Copied');
        setTimeout(() => {
          setTooltipText('Click to copy');
        }, 1500); // Reset tooltip text after 1.5 seconds
      })
      .catch((error) => {
        console.error('Unable to copy text to clipboard:', error);
        // Handle error or provide feedback to the user
      });
  }

//   useEffect(() => {
//     const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
//     tooltipTriggerList?.map((tooltipTriggerEl) => {
//       return new window.bootstrap.Tooltip(tooltipTriggerEl);
//     });
// }, []);


const getWebsiteData = () =>{
  const formData = new FormData();
  formData.append("url", baseUrl);
  // formData.append("url", 'https://www.heromotocorp.com/en-in/exchange.html');

  // {"url": baseUrl}
 
  requestInstance
    .post(API_ENDPOINT.WEBSITE_POST_API, formData)
    .then((res) => {
      setLoading(true)
      setWebsiteData(res?.data?.data);
      toast.success(res?.data?.message);
      setLoading(false);
    })
    .catch((err) => {
      toast.error(err);
      setLoading(false);
    });
}



useEffect(() => {
  getWebsiteData();
}, [])

useEffect(() => {
  if (baseUrl !== window.location.origin) {
    getWebsiteData();
  }
}, [baseUrl]);



  //Storing data
  const data = localStorage.getItem("email");
  const cred_left = localStorage.getItem("credit_left");
  const cred_total = localStorage.getItem("credit_limit");

  return (
    <div className="d-flex justify-content-center flex-column border border-danger">
      <Navbar />

      <div class="container-fluid p-0">
        <div>

          <div class="d-flex my-3 text-center">
            <div class="col-12 px-3">
              <div className="d-flex justify-content-between">
                <h6>{websiteData?.count} results for {websiteData?.url?.match(/(?:https?:\/\/)?(?:www\.)?([^\/]+)\/.*/)[1]}</h6>
                {websiteData?.email_pattern?.domain?.pattern ? <small>Email pattern : {websiteData?.email_pattern?.domain?.pattern}</small> : null}
              </div>
              <div class="borderBottomDashed"></div>
              <div className="d-flex justify-content-between mt-3">
                <div>
                  {websiteData?.emails_from_url ?  <div class="dropdown">
                    <button class="btn btn-danger btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Company Emails
                    </button>
                    <ul class="dropdown-menu">
                      {websiteData?.emails_from_url?.split(',').map((val)=>(
                        <>
                         <small class="dropdown-item fw-bold">
                         <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip id="tooltip">{copied ? 'Copied' : 'Copy'}</Tooltip>}
                            >
                          <p ref={target}
                            onClick={()=>handleCopy(val)}
                            data-toggle="tooltip"
                            data-trigger="manual"
                            data-placement="top"
                            className="text-secondary cursor-pointer ellipsis m-0"
                            > {val}</p>
                          </OverlayTrigger>
                         
                          </small>
                         <div className="borderBottom"></div>
                        </>
                      ))}
                    </ul>
                  </div> : null}
                 
                </div>
                <div>
                  {websiteData?.phone_numbers_from_url ?  <div class="dropdown">
                    <button class="btn btn-danger btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Company Phone Number
                    </button>
                    <ul class="dropdown-menu">
                      {websiteData?.phone_numbers_from_url?.split(',').map((val)=>(
                        <>
                         <small class="dropdown-item fw-bold">
                         <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip id="tooltip">{copied ? 'Copied' : 'Copy'}</Tooltip>}
                            >
                          <p ref={target}
                            onClick={()=>handleCopy(val)}
                            data-toggle="tooltip"
                            data-trigger="manual"
                            data-placement="top"
                            className="text-secondary cursor-pointer ellipsis m-0"
                            > {val}</p>
                          </OverlayTrigger>
                         </small>
                         <div className="borderBottom"></div>
                        </>
                      ))}
                    </ul>
                  </div> : null}
                </div>
                <div>
                  <a href={websiteData?.instagram_url} target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-instagram mx-2 cursor-pointer" viewBox="0 0 16 16">
                      <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                    </svg>
                  </a>

                  <a href={websiteData?.facebook_url} target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-facebook mx-2 cursor-pointer" viewBox="0 0 16 16">
                      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                    </svg>
                  </a>

                  <a href={websiteData?.linkedin_url} target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-linkedin mx-2 cursor-pointer" viewBox="0 0 16 16">
                      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                    </svg>
                  </a>

                  <a href={websiteData?.twitter_url} target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-twitter-x mx-2 cursor-pointer" viewBox="0 0 16 16">
                      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
                    </svg>
                  </a>

                  <a href={websiteData?.youtube_url} target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-youtube mx-2 cursor-pointer" viewBox="0 0 16 16">
                      <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408z"/>
                    </svg>
                  </a>

                  <a href={websiteData?.github_url} target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-github mx-2 cursor-pointer" viewBox="0 0 16 16">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                  </svg>
                  </a>
                  
                </div>
              </div>
            </div>
          </div>
          <div className="borderBottomDashed"></div>


          <div className="scrollable-div">
             {websiteData?.data?.map((val)=>(
              <>
                 <div class="d-flex my-3 px-3">
                 <div class="col-4">
                   <h6 className="ellipsis">{val?.first_name} {val?.last_name}</h6>
 
                   <OverlayTrigger
                       placement="top"
                       overlay={<Tooltip id="tooltip">{copied ? 'Copied' : 'Copy'}</Tooltip>}
                     >
                   <p ref={target}
                     onClick={()=>handleCopy(val?.email)}
                     data-toggle="tooltip"
                     data-trigger="manual"
                     data-placement="top"
                     className="text-secondary cursor-pointer ellipsis m-0"
                    >{val?.email}</p>
                   </OverlayTrigger>
 
                 </div>
                 <div class="col-4 text-center">
                   <small className="badge badge-pill themeBadgeColor text-white">{val?.designation}</small>
                  {val?.linkedin_url ? <div>
                    <a href={val?.linkedin_url}>
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-linkedin mx-2 cursor-pointer" viewBox="0 0 16 16">
                       <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                     </svg>
                    </a>
                   </div>:null}
                 </div>
                 {val?.phone_number ? <div class="col-4 text-center">
                   <small className="text-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone-fill mx-2" viewBox="0 0 16 16">
                     <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                   </svg>{val?.phone_number}</small>
                 </div> : <p className="text-secondary">Unavailable Contact</p>}
               </div>
               <div className="borderBottom"></div>
              </>
             ))}

        
          </div>
        </div>
      </div>





      <div>
        {/* <button
          className="btnget w-100"
          type="submit"
          onClick={(e) => {
            handleGetSelectedUserData(e);
          }}
          disabled={loading}
        >
          Get User Details
        </button> */}

        {showProgressBar ? (
          <ProgressBar1 bgcolor={"#6a1b9a"} completed={progressBarCompleted} />
        ) : null}
        {errMessage && (
          <div className="d-flex flex-column align-items-center text-center">
            <div className="fw-semibold"> {errValue}</div>
            <img className="errorMsg" src="pic/empty.png" />
          </div>
        )}

        {/* {showDashboardButton && (
        <button
          className="btn mt-3 btn-secondary"
          type="submit"
          onClick={(e) => {
            handleViewDashboard(e);
          }}
        >
          View Dashboard
        </button>
      )} */}

        {/* {responseData?.status && (
          <div className="border border-dark border-1 my-2 rounded-2 ">
            <div className="d-flex">
              <div className="mx-2">
                <img
                  className="bulk_img p-1"
                  src={responseData?.data?.image_url || "pic/blankperson.png"}
                ></img>{" "}
              </div>
              <div className="">
                <h5 className="fs-6 fw-semibold mb-0 ">
                  {responseData?.data?.first_name}{" "}
                  {responseData?.data?.last_name}
                </h5>
                <p className="fw-normal mb-0 ">
                  {responseData?.data?.designation || (
                    <span>
                      <RxCrossCircled className="text-danger" />
                      {" Not Found"}
                    </span>
                  )}
                </p>
                <p className="fw-normal mb-0 ">
                  {responseData?.data?.company || (
                    <span>
                      <RxCrossCircled className="text-danger" />
                      {" Not Found"}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div id="bulk_email">
              <p className="mb-0 Form_mail">
                <span>
                  {(responseData?.data?.active_guess_email && (
                    <span>
                      {responseData?.data?.active_guess_email
                        .split("\n")
                        .map((twoemail, id) => (
                          <div className="d-flex justify-content-between mx-1">
                            <div>
                              <p key={id} className="mb-0">
                                <FiMail className="mx-1" /> {twoemail}
                              </p>
                            </div>
                            <div>
                              {
                                <span className="text-success mx-2">
                                  <TiTick />
                                </span>
                              }

                              {["bottom"].map((placement) => (
                                <OverlayTrigger
                                  key={placement}
                                  placement={placement}
                                  overlay={
                                    <Tooltip id={`tooltip-${placement}`}>
                                      {copied ? "Copied!" : "Copy"}
                                    </Tooltip>
                                  }
                                >
                                  <span
                                    onClick={() => handleCopy(twoemail)}
                                    role="button"
                                  >
                                    <FaRegCopy />
                                  </span>
                                </OverlayTrigger>
                              ))}
                            </div>
                          </div>
                        ))}
                    </span>
                  )) || (
                    <span className="mx-2">
                      <span>
                        {" "}
                        <FiMail />
                      </span>
                      <RxCrossCircled className="text-danger ms-2" />
                      {" Not Found"}
                    </span>
                  )}
                </span>
              </p>
            </div>
            <div className="data_text pb-1 form_phone">
              <span className="fw-bold mx-2">
                {" "}
                <BsPhone />
              </span>
              {(responseData?.data?.phone_number && (
                <span>
                  {responseData?.data?.phone_number}{" "}
                  {["bottom"].map((placement) => (
                    <OverlayTrigger
                      key={placement}
                      placement={placement}
                      overlay={
                        <Tooltip id={`tooltip-${placement}`}>
                          {copied ? "Copied!" : "Copy"}
                        </Tooltip>
                      }
                    >
                      <span
                        onClick={() =>
                          handleCopy(responseData?.data?.phone_number)
                        }
                        role="button"
                        className="form_mobile"
                      >
                        <FaRegCopy />
                      </span>
                    </OverlayTrigger>
                  ))}{" "}
                </span>
              )) || (
                <span>
                  <RxCrossCircled className="text-danger" />
                  {" Not Found"}
                </span>
              )}
            </div>
          </div>
        )} */}
      </div>

      {/* --- Bulk data--- */}

      {/* <div id="bulkdata" className="">
        <div className="bulkdata_data">
          {multipleData &&
            multipleData?.map((ele, i) => (
              <div className="border border-dark border-1 m-1 mx-2 rounded-2 ">
                <div className="d-flex justify-content-between " key={i}>
                  <div className="d-flex">
                    <div className="mx-2">
                      <img
                        className="bulk_img p-1"
                        src={ele?.image_url || "pic/blankperson.png"}
                      ></img>{" "}
                    </div>
                    <div className="">
                      <h5 className="fs-6 fw-semibold bulk_name text-truncate lh-base mb-0">
                        {ele.first_name} {ele.last_name}
                      </h5>
                      <p className="fw-normal bulk_name mb-0 text-truncate">
                        {ele.designation ? (
                          ele.designation.replace(/<p>|<\/p>/g, "")
                        ) : (
                          <span>
                            <RxCrossCircled className="text-danger" />
                            {" Not Found"}
                          </span>
                        )}
                      </p>
                      {ele?.is_available ? (
                        <p className="fw-normal bulk_name mb-0 text-truncate">
                          {ele.company || (
                            <span>
                              <RxCrossCircled className="text-danger" />
                              {" Not Found"}
                            </span>
                          )}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  {ele?.is_available ? null : (
                    <div>
                      {["bottom"].map((placement) => (
                        <OverlayTrigger
                          key={placement}
                          placement={placement}
                          overlay={
                            <Tooltip id={`tooltip-${placement}`}>
                              Fetch Details
                            </Tooltip>
                          }
                        >
                          <button
                            onClick={() => handleClickEmail(ele)}
                            className=" alert"
                            disabled={loading}
                          >
                           
                            {spin.load == 1 && spin.id == ele.id ? (
                              <Loader />
                            ) : (
                              <BiPlusCircle className="text-primary" />
                            )}
                          </button>
                        </OverlayTrigger>
                      ))}
                    </div>
                  )}
                </div>
                {ele?.is_available ? (
                  <div id="bulk_email">
                    <p className="mb-0 bulk_mailid">
                      <span>
                        {(ele?.active_guess_email && (
                          <span>
                            {ele.active_guess_email
                              .split("\n")
                              .map((mails, id) => (
                                <div className="d-flex justify-content-between mx-1">
                                  <div>
                                    <p key={id} className="mb-0">
                                      <FiMail className="mx-1" /> {mails}
                                    </p>
                                  </div>
                                  <div>
                                    {
                                      <span className="text-success mx-2">
                                        <TiTick />
                                      </span>
                                    }

                                    {["bottom"].map((placement) => (
                                      <OverlayTrigger
                                        key={placement}
                                        placement={placement}
                                        overlay={
                                          <Tooltip id={`tooltip-${placement}`}>
                                            {copied ? "Copied!" : "Copy"}
                                          </Tooltip>
                                        }
                                      >
                                        <span
                                          onClick={() => handleCopy(mails)}
                                          role="button"
                                        >
                                          <FaRegCopy />
                                        </span>
                                      </OverlayTrigger>
                                    ))}
                                  </div>
                                </div>
                              ))}
                          </span>
                        )) || (
                          <span className="mx-2">
                            <span>
                              {" "}
                              <FiMail />
                            </span>
                            <RxCrossCircled className="text-danger ms-2" />
                            {" Not Found"}
                          </span>
                        )}
                      </span>
                    </p>
                    <div className="data_text pb-1 form_phone">
                      <span className="fw-bold mx-2">
                        {" "}
                        <BsPhone />
                      </span>
                      {(ele?.phone_number && (
                        <span>
                          {ele?.phone_number}{" "}
                          {["bottom"].map((placement) => (
                            <OverlayTrigger
                              key={placement}
                              placement={placement}
                              overlay={
                                <Tooltip id={`tooltip-${placement}`}>
                                  {copied ? "Copied!" : "Copy"}
                                </Tooltip>
                              }
                            >
                              <span
                                onClick={() => handleCopy(ele?.phone_number)}
                                role="button"
                                className="bulk_mobile"
                              >
                                <FaRegCopy />
                              </span>
                            </OverlayTrigger>
                          ))}{" "}
                        </span>
                      )) || (
                        <span>
                          <RxCrossCircled className="text-danger" />
                          {" Not Found"}
                        </span>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          {dash ? (
            <div className="d-flex justify-content-center">
              <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                breakLabel="..."
                nextLabel=" >"
                previousLabel="<"
                onPageChange={({ selected }) => handlePageChange(selected)}
                containerClassName={"pagination"}
                activeClassName={"active"}
              />
            </div>
          ) : null}
          {dash ? (
            <button
              onClick={handleBulkExcel}
              className="btn btn-warning mt-3 w-100"
            >
              {bulkloading ? <>Downloading...</> : <>Export to Spread Sheet</>}
            </button>
          ) : null}
        </div>
      </div> */}






      {/* Footer */}
      <div className="footer sticky-bottom py-3">
        <div>
          {userDash ? (
            <button
              onClick={handleExportToFile}
              className="btn btn-warning w-100"
            >
              {fileLoading ? <>Downloading...</> : <>Export to Spread Sheet</>}
            </button>
          ) : null}
          {creditlimit ? (
            <div className="progresscredit my-2 " role="progressbar">
              <div
                className="progress-bar rounded-1 bg-info"
                style={{ width: "100%" }}
              >
                credits {cred_left} out of {cred_total}
              </div>
            </div>
          ) : null}
          <div className="d-flex align-items-center justify-content-around">
            <div>
              <a
                href="http://www.discovemail.com/dashboard"
                target="_blank"
                className="btn themeBadgeColor  btn-sm dashboard"
              >
                <MdSpaceDashboard /> Go to Dashboard
              </a>
            </div>
            <div>
              <a
                onClick={onLogOut}
                className="btn themeBadgeColor  btn-sm dashboard"
              >
                <BiLogOutCircle /> Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forms;
