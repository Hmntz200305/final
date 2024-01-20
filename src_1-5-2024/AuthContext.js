import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [DataListAsset, setDataListAsset] = useState([]);
  const [DataListAssetExcept, setDataListAssetExcept] = useState([]);
  const [StatusOptions, setStatusOptions] = useState([]);
  const [LocationOptions ,setLocationOptions] = useState([]);
  const [CategoryOptions, setCategoryOptions] = useState([]);
  const [ManageUserData, setManageUserData] = useState([]);
  const [Role, setRole] = useState([]);
  const [AdminList, setAdminList] = useState([]);
  const [SubmitedList, setSubmitedList] = useState([]);
  const [DashboardInfo, setDashboardInfo] = useState([]);
  const [onRequest, setOnRequest] = useState([]);
  const [inLoans, setInLoans] = useState([]);
  const [CountinLoans, setCountinLoans] = useState([]);
  const [DataLoan, setDataLoan] = useState([]);
  const [Roles, setRoles] = useState([]);
  const [HistoryTicket, setHistoryTicket] = useState([]);
  const [HistoryLoanData, setHistoryLoanData] = useState([]);
  const [MyReport, setMyReport] = useState([]);
  const [Notification, setNotification] = useState([]);
  const [NotificationStatus, setNotificationStatus] = useState(false);
  const [NotificationInfo, setNotificationInfo] = useState([]);
  const [LoginNotificationStatus, setLoginNotificationStatus] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // Cek apakah ada token yang tersimpan di localStorage
      const storedToken = localStorage.getItem("token");
      const storedEmail = localStorage.getItem("email");
  
      if (storedToken && storedEmail ) {
        setToken(storedToken); // Set token dari localStorage
        setEmail(storedEmail); // Set email dari localStorage
        setLoggedIn(true);
        try {
          const response = await fetch("https://asset.lintasmediadanawa.com:8443/api/authentication", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: storedToken,
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            setRole(data.role);
            setCountinLoans(data.data);
            setRoles(data.roles);
            setUsername(data.username);
          } else {
            console.error("Error:", response.status, response.statusText);
          }
        } catch (error) {
          console.error("Error:", error);
        } 
      }
    }
  
    fetchData();
    // eslint-disable-next-line
  }, [Role]);

  const login = (data) => {
    setToken(data.token);
    setEmail(data.email);
    setRole(data.role);
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);
    setLoggedIn(true);
  };

  const logout = () => {
    setToken("");
    setEmail("");
    setUsername("");
    setRole("");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    setLoggedIn(false);
  };

  const refreshAssetData = () => {
    fetch('https://asset.lintasmediadanawa.com:8443/api/getdata-listasset')
      .then((response) => response.json())
      .then((data) => {
        setDataListAsset(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const refreshAssetDataExcept = () => {
    fetch('https://asset.lintasmediadanawa.com:8443/api/getdata-listassetexcept')
      .then((response) => response.json())
      .then((data) => {
        setDataListAssetExcept(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const refreshStatusList = () => {
    fetch('https://asset.lintasmediadanawa.com:8443/api/getdata-statuslist')
      .then((response) => response.json())
      .then((data) => {
        setStatusOptions(data);
      })
      .catch((error) => {
        console.error('Error fetching status data:', error);
      });
  }

  const refreshLocationList = () => {
    fetch('https://asset.lintasmediadanawa.com:8443/api/getdata-locationlist')
      .then((response) => response.json())
      .then((data) => {
        setLocationOptions(data);
      })
      .catch((error) => {
        console.error('Error fetching status data:', error);
      });
  }

  const refreshCategoryList = () => {
    fetch('https://asset.lintasmediadanawa.com:8443/api/getdata-categorylist')
      .then((response) => response.json())
      .then((data) => {
        setCategoryOptions(data);
      })
      .catch((error) => {
        console.error('Error fetching status data:', error);
      });
  }

  const refreshManageUser = () => {
    fetch('https://asset.lintasmediadanawa.com:8443/api/manageuser')
      .then((response) => response.json())
      .then((data) => {
        setManageUserData(data);
      })
      .catch((error) => {
        console.error('Error fetching status data:', error);
      });
  }

  const refreshAdminList = () => {
    fetch('https://asset.lintasmediadanawa.com:8443/api/adminlist')
      .then((response) => response.json())
      .then((data) => {
        setAdminList(data);
      })
      .catch((error) => {
        console.error('Error fetching status data:', error);
      });
  }

  const refreshSubmitedList = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    };
    
    fetch('https://asset.lintasmediadanawa.com:8443/api/leasesubmited', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setSubmitedList(data);
      })
      .catch((error) => {
        console.error('Error fetching status data:', error);
      });
  }

  const refreshDashboardInfo = () => {
    fetch('https://asset.lintasmediadanawa.com:8443/api/DashboardInfo')
      .then((response) => response.json())
      .then((data) => {
        setDashboardInfo(data);
        setOnRequest(data['on request']);
        setInLoans(data['in loans']);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const refreshDataLoan = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    };
    
    fetch('https://asset.lintasmediadanawa.com:8443/api/dataloan', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setDataLoan(data);
      })
      .catch((error) => {
        console.error('Error fetching status data:', error);
      });
  }

  const refreshHistoryTicket = () => {
    fetch('https://asset.lintasmediadanawa.com:8443/api/historyticket')
      .then((response) => response.json())
      .then((data) => {
        setHistoryTicket(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const refreshHistoryLoanData = () => {
    fetch('https://asset.lintasmediadanawa.com:8443/api/historyloandata')
      .then((response) => response.json())
      .then((data) => {
        setHistoryLoanData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const refreshMyReport = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    };
    
    fetch('https://asset.lintasmediadanawa.com:8443/api/myreport', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setMyReport(data);
      })
      .catch((error) => {
        console.error('Error fetching status data:', error);
      });
  };

  const [openSidebar, setOpenSidebar] = useState(true);
  const [isDesktopView, setIsDesktopView] = useState(window.innerWidth > 768);
  
  return (
    <AuthContext.Provider value={{ token, email, username, loggedIn, login, logout, refreshAssetData, DataListAsset, refreshStatusList, StatusOptions, refreshLocationList, LocationOptions, refreshCategoryList, CategoryOptions, refreshManageUser, ManageUserData, Role, DataListAssetExcept, refreshAssetDataExcept, AdminList, refreshAdminList, SubmitedList, refreshSubmitedList, refreshDashboardInfo, DashboardInfo, onRequest, inLoans, CountinLoans, refreshDataLoan, DataLoan, Roles, refreshHistoryTicket, HistoryTicket, refreshHistoryLoanData, HistoryLoanData, refreshMyReport, MyReport, setNotification, Notification, setNotificationStatus, NotificationStatus, NotificationInfo, setNotificationInfo, openSidebar, setOpenSidebar, setLoginNotificationStatus, LoginNotificationStatus, }}>
      {children}
    </AuthContext.Provider>
  );
};
