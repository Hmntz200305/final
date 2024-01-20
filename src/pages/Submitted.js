import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';
import { faCheck, faCircleInfo, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../AuthContext';
import { Button, Typography } from '@material-tailwind/react'
import Modal from 'react-modal';
Modal.setAppElement('#root');

const Submitted = () => {
    const { token, Role, SubmitedList, refreshSubmitedList, setNotification, setNotificationStatus, setNotificationInfo, openSidebar, setOpenSidebar } = useAuth();
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

    const openApproveReturn = (idticketadmin, idticket, name) => {
      setSelectedTicketId(idticket);
      setSelectedTicketSenderName(name);
      setSelectedTicketingAdmin(idticketadmin);
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
          setShowApprove(false);
          refreshSubmitedList();
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
          setShowDecline(false);
          refreshSubmitedList();
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
                    <button className='bg-gray-800 p-1 rounded-lg' onClick={() => showMoreDetailLease(row)}>
                      <FontAwesomeIcon icon={faCircleInfo} size='xl'/>
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
                    <button className='bg-green-500 p-2 rounded-lg hover:bg-green-700 m-0.5' onClick={() => openApproveReturn(row.idticketadmin, row.idticket, row.name)}>
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
                    <button className='bg-gray-800 p-1 rounded-lg' onClick={() => showMoreDetailReturn(row)}>
                      <FontAwesomeIcon icon={faCircleInfo} size='xl'/>
                    </button>
                  </div>
                ),
              },
      ]

    return (
        <>
            <div className='p-2'>
                <div className='bg-gray-800 mb-5 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Selamat datang di Submitted page xixixi :)</h2>
                </div>
            </div>
            
            {/* APPROVAL LEASE */}
            {isDesktopView && (
                <Modal
                    isOpen={approveLease}
                    onRequestClose={closeApproveLease}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                    className={`modal-content bg-transparent p-4 w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2'>
                        <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                            <div className='flex flex-col text-center mb-2'>
                                <h1 className="text-2xl font-semibold">Select Action (Approval Lease)</h1>
                                <p>Apakah anda yakin <u>Ingin memberi Approval</u> untuk {selectedTicketSenderName}?</p>
                            </div>
                            <div className="flex space-x-4 mt-5">
                                <Button className=" hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={closeApproveLease}>Close</Button>
                                <Button 
                                  className=" hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" 
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
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                    className='modal-content bg-transparent p-4 w-screen'
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2'>
                        <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                            <div className='flex flex-col text-center mb-2'>
                                <h1 className="text-2xl font-semibold">Select Action (Approval Lease)</h1>
                                <p>Apakah anda yakin <u>Tidak ingin memberi Approval</u> untuk {selectedTicketSenderName}?</p>
                            </div>
                            <div className="flex space-x-4 mt-5">
                                <Button className=" hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={closeApproveLease}>Close</Button>
                                <Button 
                                  className=" hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" 
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
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                    className={`modal-content bg-transparent p-4 w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2'>
                        <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                            <div className='flex flex-col text-center mb-2'>
                                <h1 className="text-2xl font-semibold">Select Action (Decline Lease)</h1>
                                <p>Apakah anda yakin <u>Tidak ingin memberi Approval</u> untuk {selectedTicketSenderName}?</p>
                            </div>
                            <div className="flex space-x-4 mt-5">
                                <Button className=" hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={closeDeclineLease}>Close</Button>
                                <Button 
                                  className=" hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" 
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
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                    className='modal-content bg-transparent p-4 w-screen'
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2'>
                        <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                            <div className='flex flex-col text-center mb-2'>
                                <h1 className="text-2xl font-semibold">Select Action (Decline Lease)</h1>
                                <p>Apakah anda yakin <u>Tidak ingin memberi Approval</u> untuk {selectedTicketSenderName}?</p>
                            </div>
                            <div className="flex space-x-4 mt-5">
                                <Button className=" hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={closeDeclineLease}>Close</Button>
                                <Button 
                                  className=" hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" 
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

            {/* APPROVAL RETURN */}
            {isDesktopView && (
                <Modal
                    isOpen={approveReturn}
                    onRequestClose={closeApproveReturn}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                    className={`modal-content bg-transparent p-4 w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2'>
                        <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                            <div className='flex flex-col text-center mb-2'>
                                <h1 className="text-2xl font-semibold">Select Action (Approval Return)</h1>
                                <p>Apakah anda yakin <u>Ingin memberi Approval</u> untuk {selectedTicketSenderName}?</p>
                            </div>
                            <div className="flex space-x-4 mt-5">
                                <Button className=" hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={closeApproveReturn}>Close</Button>
                                <Button 
                                  className=" hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" 
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
                    isOpen={approveReturn}
                    onRequestClose={closeApproveReturn}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                    className='modal-content bg-transparent p-4 w-screen'
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2'>
                        <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                            <div className='flex flex-col text-center mb-2'>
                                <h1 className="text-2xl font-semibold">Select Action (Approval Return)</h1>
                                <p>Apakah anda yakin <u>Tidak ingin memberi Approval</u> untuk {selectedTicketSenderName}?</p>
                            </div>
                            <div className="flex space-x-4 mt-5">
                                <Button className=" hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={closeApproveReturn}>Close</Button>
                                <Button 
                                  className=" hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" 
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

            {/* DECLINE RETURN */}
            {isDesktopView && (
                <Modal
                    isOpen={declineReturn}
                    onRequestClose={closeDeclineReturn}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                    className={`modal-content bg-transparent p-4 w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2'>
                        <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                            <div className='flex flex-col text-center mb-2'>
                                <h1 className="text-2xl font-semibold">Select Action (Decline Return)</h1>
                                <p>Apakah anda yakin <u>Tidak ingin memberi Approval</u> untuk {selectedTicketSenderName}?</p>
                            </div>
                            <div className="flex space-x-4 mt-5">
                                <Button className=" hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={closeDeclineReturn}>Close</Button>
                                <Button 
                                  className=" hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" 
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
                    isOpen={declineReturn}
                    onRequestClose={closeDeclineReturn}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
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
                                <Button className=" hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={closeDeclineReturn}>Close</Button>
                                <Button 
                                  className=" hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" 
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
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
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
                        <Button onClick={closeMoreDetailLease} className=" mt-4">
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
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
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
                        <Button onClick={closeMoreDetailLease} className=" mt-4">
                            Close
                        </Button>
                    </div>
                </Modal>
            )}

            {/* MORE DETAIL RETURN */}
            {isDesktopView && (
                <Modal
                    isOpen={showMoreAssetReturn}
                    onRequestClose={closeMoreDetailReturn}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
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
                        <Button onClick={closeMoreDetailReturn} className=" mt-4">
                            Close
                        </Button>
                    </div>
                </Modal>
            )}
            {!isDesktopView && (
                <Modal
                    isOpen={showMoreAssetLease}
                    onRequestClose={closeMoreDetailReturn}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
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
                        <Button onClick={closeMoreDetailReturn} className=" mt-4">
                            Close
                        </Button>
                    </div>
                </Modal>
            )}

            <div className='space-y-4'>
              <div className='p-2 bg-white'>
                <Typography variant='h6'>
                  Approval Lease
                </Typography>
                  <DataTable 
                  columns={columnLease}
                  data={SubmitedList}
                  noHeader
                  defaultSortField='no'
                  defaultSortAsc={false}
                  pagination
                  highlightOnHover
                  />
              </div>

              <div className='p-2 bg-white'>
                <Typography variant='h6'>
                  Approval Return
                </Typography>
                  <DataTable 
                  columns={columnReturn}
                  data={SubmitedList}
                  noHeader
                  defaultSortField='no'
                  defaultSortAsc={false}
                  pagination
                  highlightOnHover
                  />
              </div>
            </div>
        </>
    )
}
export default Submitted