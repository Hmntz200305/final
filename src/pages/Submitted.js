import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';
import { faCheck, faCircleInfo, faEllipsis, faXmark, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../AuthContext';
import { Button, Typography, Tabs, TabsHeader, TabsBody, Tab, TabPanel, Badge } from '@material-tailwind/react'
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Submitted = () => {

    const LeaseContent = () => {

      return (
        <>
          <div className='p-2 bg-white z-0 static'>
            <DataTable 
              className='static z-0'
              columns={columnLease}
              data={SubmitedList.ticket_list}
              noHeader
              defaultSortField='no'
              defaultSortAsc={false}
              pagination
              highlightOnHover
            />
          </div>
        </>
      )
    }

    const ReturnContent = () => {

      return (
        <>
          <div className='p-2 bg-white z-0 static'>
            <DataTable 
              className='z-0 static'
              columns={columnReturn}
              data={ReturnSubmitedList.ticket_list}
              noHeader
              defaultSortField='no'
              defaultSortAsc={false}
              pagination
              highlightOnHover
            />
          </div>
        </>
      )
    }

    const { token, Role, SubmitedList, refreshSubmitedList, setNotification, setNotificationStatus, setNotificationInfo, openSidebar, setOpenSidebar, refreshReturnSubmitedList, ReturnSubmitedList } = useAuth();
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [selectedTicketSenderName, setSelectedTicketSenderName] = useState(null);
    const [SelectedTicketingAdmin, setSelectedTicketingAdmin] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAssetDetails, setSelectedAssetDetails] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const isMobile = windowWidth <= 768;
    const [isDesktopView, setIsDesktopView] = useState(window.innerWidth > 768);
    const [showMoreAssetLease, setShowMoreAssetLease] = useState(false);
    const [showMoreAssetReturn, setShowMoreAssetReturn] = useState(false);
    const [approveLease, setApproveLease] = useState(false);
    const [declineLease, setDeclineLease] = useState(false);
    const [approveReturn, setApproveReturn] = useState(false);
    const [declineReturn, setDeclineReturn] = useState(false);

    const openApproveLease = (idticketadmin, idticket, name) => {
      setSelectedTicketId(idticket);
      setSelectedTicketSenderName(name);
      setSelectedTicketingAdmin(idticketadmin);
      setApproveLease(true);
    }
    const closeApproveLease = () => {
      setApproveLease(false)
    }

    const openDeclineLease = (idticket, name) => {
      setSelectedTicketId(idticket);
      setSelectedTicketSenderName(name);
      setDeclineLease(true);
    }
    const closeDeclineLease = () => {
      setDeclineLease(false);
    }

    const openApproveReturn = (idticket, name) => {
      setSelectedTicketId(idticket);
      setSelectedTicketSenderName(name);
      setApproveReturn(true);
    }
    const closeApproveReturn = () => {
      setApproveReturn(false)
    }

    const openDeclineReturn = (idticket, name) => {
      setSelectedTicketId(idticket);
      setSelectedTicketSenderName(name);
      setDeclineReturn(true);
    }
    const closeDeclineReturn = () => {
      setDeclineReturn(false);
    }
    

    const showMoreDetailLease = (row) => {
      setSelectedAssetDetails([row]);
      setShowMoreAssetLease(true);
    };
    const closeMoreDetailLease = () => {
      setShowMoreAssetLease(false);
    };

    const showMoreDetailReturn = (row) => {
      setSelectedAssetDetails([row]);
      setShowMoreAssetReturn(true);
    };
    const closeMoreDetailReturn = () => {
      setShowMoreAssetReturn(false);
    };

    const handleResizeMobile = () => {
        setIsDesktopView(window.innerWidth > 768);
    }; 
    
    const handleResizeApp = () => {
      if (window.innerWidth <= 768) {
        setOpenSidebar(false);
      } else {
        setOpenSidebar(true);
      }
    };
    
    useEffect(() => {
        window.addEventListener('resize', handleResizeMobile);
  
        return () => {
        window.removeEventListener('resize', handleResizeMobile);
        };
    }, []);
  
    useEffect(() => {
      window.addEventListener('resize', handleResizeApp);
      return () => {
        window.removeEventListener('resize', handleResizeApp);
      };
    }, []);

    useEffect(() => {
        const refreshData = async () => {
          if (Role === 1 || Role === 2) {
            await refreshSubmitedList();
            await refreshReturnSubmitedList();
          }
        };
    refreshData();
    
    window.addEventListener("beforeunload", refreshData);
    return () => {
      window.removeEventListener("beforeunload", refreshData);
    };
    }, [Role]);

    const handleApprove = async (token) => {
      try {
        setIsLoading(true);
        const formData = new FormData();
  
        formData.append('SelectedTicketingAdmin', SelectedTicketingAdmin);
  
        const response = await fetch(
          `https://asset.lintasmediadanawa.com:8443/api/ticketapprove/${selectedTicketId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: token,
            },
            body: formData,
          }
        );
  
        if (response.status === 200) {
          const data = await response.json();
          setNotification(data.message);
          setNotificationStatus(true);
          setNotificationInfo(data.Status);
          setApproveLease(false);
          refreshSubmitedList();
          refreshReturnSubmitedList();
          setSelectedTicketId(null);
          setSelectedTicketingAdmin(null);
          setSelectedTicketSenderName(null);
        } else {
          setNotification('Failed to approve');
          setNotificationInfo("error");
          setNotificationStatus(true);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleDecline = async (token) => {
      try {
        setIsLoading(true);
  
        const response = await fetch(
          `https://asset.lintasmediadanawa.com:8443/api/ticketdecline/${selectedTicketId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: token,
            },
          }
        );
  
        if (response.status === 200) {
          const data = await response.json();
          setNotification(data.message);
          setNotificationStatus(true);
          setNotificationInfo(data.Status);
          setDeclineLease(false);
          refreshSubmitedList();
          refreshReturnSubmitedList();
          setSelectedTicketId(null);
          setSelectedTicketingAdmin(null);
          setSelectedTicketSenderName(null);
        } else {
          setNotification('Failed');
          setNotificationInfo("error");
          setNotificationStatus(true);
        }
      } catch (error) {  
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleApproveReturn = async (token) => {
      try {
        setIsLoading(true);
  
        const response = await fetch(
          `https://asset.lintasmediadanawa.com:8443/api/returnapprove/${selectedTicketId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: token,
            },
          }
        );
  
        if (response.status === 200) {
          const data = await response.json();
          setNotification(data.message);
          setNotificationStatus(true);
          setNotificationInfo(data.Status);
          setApproveReturn(false);
          refreshSubmitedList();
          refreshReturnSubmitedList();
          setSelectedTicketId(null);
          setSelectedTicketingAdmin(null);
          setSelectedTicketSenderName(null);
        } else {
          setNotification('Failed');
          setNotificationInfo("error");
          setNotificationStatus(true);
        }
      } catch (error) {  
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleDeclineReturn = async (token) => {
      try {
        setIsLoading(true);
  
        const response = await fetch(
          `https://asset.lintasmediadanawa.com:8443/api/returndecline/${selectedTicketId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: token,
            },
          }
        );
  
        if (response.status === 200) {
          const data = await response.json();
          setNotification(data.message);
          setNotificationStatus(true);
          setNotificationInfo(data.Status);
          setDeclineReturn(false);
          refreshSubmitedList();
          refreshReturnSubmitedList();
          setSelectedTicketId(null);
          setSelectedTicketingAdmin(null);
          setSelectedTicketSenderName(null);
        } else {
          setNotification('Failed');
          setNotificationInfo("error");
          setNotificationStatus(true);
        }
      } catch (error) {  
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const moreLease = [
      {
          name: 'ID Asset',
          selector: (row) => row.assets,
          },
          {
          name: 'Name',
          selector: (row) => row.assetname,
          },
          {
          name: 'Description',
          selector: (row) => row.assetdesc,
          },
          {
          name: 'Brand',
          selector: (row) => row.assetbrand,
          },
          {
          name: 'Model',
          selector: (row) => row.assetmodel,
          },
          {
          name: 'Status',
          selector: (row) => row.assetstatus,
          },
          {
          name: 'Location',
          selector: (row) => row.location,
          },
          {
          name: 'Category',
          selector: (row) => row.assetcategory,
          },
          {
          name: 'SN',
          selector: (row) => row.assetsn,
          },
          {
          name: 'Photo',
          cell: (row) => (
              <div>
                <img src={row.assetphoto} alt="Asset" className='rounded-lg shadow p-0.5 shadow-black' />
              </div>
            ),
          },
  ]

    const columnLease = [
        {
            name: 'No Ticket',
            selector: (row) => row.idticket,
            },
            {
            name: 'ID Asset',
            selector: (row) => row.assets,
            },
            {
            name: 'Pengaju',
            selector: (row) => row.name,
            },
            {
            name: 'CheckOut Date',
            selector: (row) => row.leasedate,
            },
            {
            name: 'CheckIn Date',
            selector: (row) => row.returndate,
            },
            {
            name: 'Lokasi',
            selector: (row) => row.location,
            },
            {
            name: 'Email',
            selector: (row) => row.email,
            },
            {
            name: 'Note',
            selector: (row) => row.note,
            },
            {
            name: 'Action',
            cell: (row) => (
                <div className='text-white'>
                    <button className='bg-green-500 p-2 rounded-lg hover:bg-green-700 m-0.5' onClick={() => openApproveLease(row.idticketadmin, row.idticket, row.name)}>
                        <FontAwesomeIcon icon={faCheck} />
                    </button>
                    <button className='bg-red-500 p-2 rounded-lg hover:bg-red-700 m-0.5' onClick={() => openDeclineLease(row.idticket, row.name)}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
                )
            },
            {
              name: 'More Detail',
              cell: (row) => (
                  <div className='text-white flex items-center justify-center cursor-pointer'>
                    <button className='bg-gray-800 py-1 px-4 rounded rounded-full' onClick={() => showMoreDetailLease(row)}>
                      <FontAwesomeIcon icon={faEllipsis} size='xl'/>
                    </button>
                  </div>
                ),
              },
    ]

    const moreReturn = [
      {
          name: 'ID Asset',
          selector: (row) => row.assets,
          },
          {
          name: 'Name',
          selector: (row) => row.assetname,
          },
          {
          name: 'Description',
          selector: (row) => row.assetdesc,
          },
          {
          name: 'Brand',
          selector: (row) => row.assetbrand,
          },
          {
          name: 'Model',
          selector: (row) => row.assetmodel,
          },
          {
          name: 'Status',
          selector: (row) => row.assetstatus,
          },
          {
          name: 'Location',
          selector: (row) => row.assetlocation,
          },
          {
          name: 'Category',
          selector: (row) => row.assetcategory,
          },
          {
          name: 'SN',
          selector: (row) => row.assetsn,
          },
          {
          name: 'Photo',
          cell: (row) => (
              <div>
                <img src={row.assetphoto} alt="Asset" className='rounded-lg shadow p-0.5 shadow-black' />
              </div>
            ),
          },
    ]

    const columnReturn = [
        {
            name: 'No Ticket',
            selector: (row) => row.idticket,
            },
            {
            name: 'ID Asset',
            selector: (row) => row.assets,
            },
            {
            name: 'Pengaju',
            selector: (row) => row.name,
            },
            {
            name: 'CheckOut Date',
            selector: (row) => row.leasedate,
            },
            {
            name: 'CheckIn Date',
            selector: (row) => row.returndate,
            },
            {
            name: 'Lokasi',
            selector: (row) => row.assetlocation,
            },
            {
            name: 'Email',
            selector: (row) => row.email,
            },
            {
            name: 'Action',
            cell: (row) => (
                <div className='text-white'>
                    <button className='bg-green-500 p-2 rounded-lg hover:bg-green-700 m-0.5' onClick={() => openApproveReturn(row.idticket, row.name)}>
                        <FontAwesomeIcon icon={faCheck} />
                    </button>
                    <button className='bg-red-500 p-2 rounded-lg hover:bg-red-700 m-0.5' onClick={() => openDeclineReturn(row.idticket, row.name)}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
                )
            },
            {
              name: 'More Detail',
              cell: (row) => (
                  <div className='text-white flex items-center justify-center cursor-pointer'>
                    <button className='bg-gray-800 py-1 px-4 rounded rounded-full' onClick={() => showMoreDetailReturn(row)}>
                      <FontAwesomeIcon icon={faEllipsis} size='xl'/>
                    </button>
                  </div>
                ),
              },
      ]

      const [activeTab, setActiveTab] = useState("lease");
      const data = [
      {
          label: "Lease",
          value: "lease",
          content: <LeaseContent />,
      },
      {
          label: "Return",
          value: "return",
          content: <ReturnContent />,
      },
    ];

    return (
        <>
            <div className='p-2'>
                <div className='bg-gray-800 mb-5 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Selamat datang di Submitted page :)</h2>
                </div>
            </div>

            <div className='p-2'>
              <div className='bg-white rounded'>
                  <div className='flex justify-center'>
                      <h1 className="text-2xl font-semibold mt-6">Select Action</h1>
                  </div>
                  <Tabs value={activeTab} className='p-2'>
                      <TabsHeader className="rounded-none p-0 border-b border-blue-gray-50 mt-4 bg-white"
                          indicatorProps={{
                              className: "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
                          }}
                      >
                          {data.map(({ label, value }) => (
                        <Tab
                          key={value}
                          value={value}
                          onClick={() => setActiveTab(value)}
                          className={activeTab === value ? "text-gray-800" : "hover:text-gray-500"}
                        >
                          {ReturnSubmitedList.total_records ? (
                            <Badge>
                              {label}
                            </Badge>
                          ) : (
                            label
                          )}
                        </Tab>
                      ))}
                      </TabsHeader>
                      <TabsBody>
                          {data.map(({ value, content }) => (
                              <TabPanel key={value} value={value}>
                                {content}
                              </TabPanel>
                          ))}
                      </TabsBody>
                  </Tabs>
              </div>
            </div>
            
            {/* APPROVAL LEASE */}
            {isDesktopView && (
                <Modal
                    isOpen={approveLease}
                    onRequestClose={closeApproveLease}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[1000]"
                    className={`modal-content bg-transparent p-4 w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2'>
                        <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                            <div className='flex flex-col text-center mb-2'>
                                <h1 className="text-2xl font-semibold">Select Action</h1>
                                <p>Apakah anda yakin <u>Ingin memberi Approval</u> untuk {selectedTicketSenderName}?</p>
                            </div>
                            <div className="flex space-x-4 mt-5">
                                <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded" onClick={closeApproveLease}>Close</Button>
                                <Button 
                                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded" 
                                  onClick={() => handleApprove(token)}
                                  disabled={isLoading}
                                >
                                    {isLoading ? 'Proses...' : 'Approve'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
            {!isDesktopView && (
                <Modal
                    isOpen={approveLease}
                    onRequestClose={closeApproveLease}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[1000]"
                    className='modal-content bg-transparent p-4 w-screen'
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2'>
                        <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                            <div className='flex flex-col text-center mb-2'>
                                <h1 className="text-2xl font-semibold">Select Action</h1>
                                <p>Apakah anda yakin <u>Tidak ingin memberi Approval</u> untuk {selectedTicketSenderName}?</p>
                            </div>
                            <div className="flex space-x-4 mt-5">
                                <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded" onClick={closeApproveLease}>Close</Button>
                                <Button 
                                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded" 
                                  onClick={() => handleDecline(token)}
                                  disabled={isLoading}
                                >
                                    {isLoading ? 'Proses...' : 'Decline'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* DECLINE LEASE */}
            {isDesktopView && (
                <Modal
                    isOpen={declineLease}
                    onRequestClose={closeDeclineLease}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[1000]"
                    className={`modal-content bg-transparent p-4 z-[8888] w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2'>
                        <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                            <div className='flex flex-col text-center mb-2'>
                                <h1 className="text-2xl font-semibold">Select Action</h1>
                                <p>Apakah anda yakin <u>Tidak ingin memberi Approval</u> untuk {selectedTicketSenderName}?</p>
                            </div>
                            <div className="flex space-x-4 mt-5">
                                <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded" onClick={closeDeclineLease}>Close</Button>
                                <Button 
                                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded" 
                                  onClick={() => handleDecline(token)}
                                  disabled={isLoading}
                                >
                                    {isLoading ? 'Proses...' : 'Decline'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
            {!isDesktopView && (
                <Modal
                    isOpen={declineLease}
                    onRequestClose={closeDeclineLease}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[1000]"
                    className='modal-content bg-transparent p-4 w-screen'
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2'>
                        <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                            <div className='flex flex-col text-center mb-2'>
                                <h1 className="text-2xl font-semibold">Select Action</h1>
                                <p>Apakah anda yakin <u>Tidak ingin memberi Approval</u> untuk {selectedTicketSenderName}?</p>
                            </div>
                            <div className="flex space-x-4 mt-5">
                                <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded" onClick={closeDeclineLease}>Close</Button>
                                <Button 
                                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded" 
                                  onClick={() => handleDecline(token)}
                                  disabled={isLoading}
                                >
                                    {isLoading ? 'Proses...' : 'Decline'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* MORE DETAIL LEASE */}
            {isDesktopView && (
                <Modal
                    isOpen={showMoreAssetLease}
                    onRequestClose={closeMoreDetailLease}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[1000]"
                    className={`modal-content bg-transparent p-4 w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2 py-4 bg-white'>
                        <h1>Ini adalah detail lengkap asset Approval Lease</h1>
                            <DataTable
                                columns={moreLease}
                                data={selectedAssetDetails}
                                highlightOnHover
                            />
                        <Button onClick={closeMoreDetailLease} className="bg-red-500 hover:bg-red-600 mt-4">
                            Close
                        </Button>
                    </div>
                </Modal>
            )}
            {!isDesktopView && (
                <Modal
                    isOpen={showMoreAssetLease}
                    onRequestClose={closeMoreDetailLease}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[1000]"
                    className='modal-content bg-transparent p-4 w-screen'
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2 py-4 bg-white'>
                        <h1>Ini adalah detail lengkap asset Approval Lease</h1>
                            <DataTable
                                columns={moreLease}
                                data={selectedAssetDetails}
                                highlightOnHover
                            />
                        <Button onClick={closeMoreDetailLease} className="bg-red-500 hover:bg-red-600 mt-4">
                            Close
                        </Button>
                    </div>
                </Modal>
            )}

            {/* APPROVAL RETURN */}
            {isDesktopView && (
                <Modal
                    isOpen={approveReturn}
                    onRequestClose={closeApproveReturn}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed inset-0 bg-gray-500hamam bg-opacity-75 flex items-center justify-center z-[1000]"
                    className={`modal-content bg-transparent p-4 w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2'>
                        <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                            <div className='flex flex-col text-center mb-2'>
                                <h1 className="text-2xl font-semibold">Select Action</h1>
                                <p>Apakah anda yakin <u>Ingin memberi Approval</u> untuk {selectedTicketSenderName}?</p>
                            </div>
                            <div className="flex space-x-4 mt-5">
                                <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded" onClick={closeApproveReturn}>Close</Button>
                                <Button 
                                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded" 
                                  onClick={() => handleApproveReturn(token)}
                                  disabled={isLoading}
                                >
                                    {isLoading ? 'Proses...' : 'Approve'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
            {!isDesktopView && (
                <Modal
                    isOpen={approveReturn}
                    onRequestClose={closeApproveReturn}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[1000]"
                    className='modal-content bg-transparent p-4 w-screen'
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2'>
                        <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                            <div className='flex flex-col text-center mb-2'>
                                <h1 className="text-2xl font-semibold">Select Action</h1>
                                <p>Apakah anda yakin <u>Tidak ingin memberi Approval</u> untuk {selectedTicketSenderName}?</p>
                            </div>
                            <div className="flex space-x-4 mt-5">
                                <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded" onClick={closeApproveReturn}>Close</Button>
                                <Button 
                                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded" 
                                  onClick={() => handleApproveReturn(token)}
                                  disabled={isLoading}
                                >
                                    {isLoading ? 'Proses...' : 'Decline'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* DECLINE RETURN */}
            {isDesktopView && (
                <Modal
                    isOpen={declineReturn}
                    onRequestClose={closeDeclineReturn}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[1000]"
                    className={`modal-content bg-transparent p-4 w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2'>
                        <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                            <div className='flex flex-col text-center mb-2'>
                                <h1 className="text-2xl font-semibold">Select Action</h1>
                                <p>Apakah anda yakin <u>Tidak ingin memberi Approval</u> untuk {selectedTicketSenderName}?</p>
                            </div>
                            <div className="flex space-x-4 mt-5">
                                <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded" onClick={closeDeclineReturn}>Close</Button>
                                <Button 
                                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded" 
                                  onClick={() => handleDeclineReturn(token)}
                                  disabled={isLoading}
                                >
                                    {isLoading ? 'Proses...' : 'Decline'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
            {!isDesktopView && (
                <Modal
                    isOpen={declineReturn}
                    onRequestClose={closeDeclineReturn}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[1000]"
                    className='modal-content bg-transparent p-4 w-screen'
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2'>
                        <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                            <div className='flex flex-col text-center mb-2'>
                                <h1 className="text-2xl font-semibold">Select Action (Decline Return)</h1>
                                <p>Apakah anda yakin <u>Tidak ingin memberi Approval</u> untuk {selectedTicketSenderName}?</p>
                            </div>
                            <div className="flex space-x-4 mt-5">
                                <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded" onClick={closeDeclineReturn}>Close</Button>
                                <Button 
                                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded" 
                                  onClick={() => handleDeclineReturn(token)}
                                  disabled={isLoading}
                                >
                                    {isLoading ? 'Proses...' : 'Decline'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* MORE DETAIL RETURN */}
            {isDesktopView && (
                <Modal
                    isOpen={showMoreAssetReturn}
                    onRequestClose={closeMoreDetailReturn}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[1000]"
                    className={`modal-content bg-transparent p-4 w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2 py-4 bg-white'>
                        <h1>Ini adalah detail lengkap asset Approval Return</h1>
                            <DataTable
                                columns={moreReturn}
                                data={selectedAssetDetails}
                                highlightOnHover
                            />
                        <Button onClick={closeMoreDetailReturn} className="bg-red-500 hover:bg-red-600 mt-4">
                            Close
                        </Button>
                    </div>
                </Modal>
            )}
            {!isDesktopView && (
                <Modal
                    isOpen={showMoreAssetReturn}
                    onRequestClose={closeMoreDetailReturn}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[1000]"
                    className='modal-content bg-transparent p-4 w-screen'
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2 py-4 bg-white'>
                        <h1>Ini adalah detail lengkap asset Approval Return</h1>
                            <DataTable
                                columns={moreReturn}
                                data={selectedAssetDetails}
                                highlightOnHover
                            />
                        <Button onClick={closeMoreDetailReturn} className="bg-red-500 hover:bg-red-600 mt-4">
                            Close
                        </Button>
                    </div>
                </Modal>
            )}
        </>
    )
}
export default Submitted