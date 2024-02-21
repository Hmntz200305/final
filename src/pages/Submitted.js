import React, { useEffect, useState } from 'react'
import { MaterialReactTable, useMaterialReactTable, createMRTColumnHelper } from 'material-react-table';
import { faCheck, faCircleInfo, faEllipsis, faXmark, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../AuthContext';
import { Button, Typography, Tabs, TabsHeader, TabsBody, Tab, TabPanel, Badge } from '@material-tailwind/react'
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Submitted = () => {

    const LeaseContent = () => {

      const columnLease = [
        columnHelper.accessor('idticket', {
          header: 'No Ticket',
          size: 150,
        }),
        columnHelper.accessor('assets', {
          header: 'ID Asset',
          size: 150,
        }),
        columnHelper.accessor('name', {
          header: 'Pengaju',
          size: 150,
        }),
        columnHelper.accessor('leasedate', {
          header: 'Lease Date',
          size: 150,
        }),
        columnHelper.accessor('returndate', {
          header: 'Return Date',
        }),
        columnHelper.accessor('location', {
          header: 'Location',
          size: 150,
          filterVariant: 'select',
          filterSelectOptions: ListLocation,
        }),
        columnHelper.accessor('email', {
          header: 'Email',
          size: 150,
        }),
        columnHelper.accessor('note', {
          header: 'Note',
          size: 150,
        }),
        columnHelper.accessor('action', {
          header: 'Action',
          size: 100,
          enableSorting: false,
          enableColumnFilter: false,
          Cell: ({ row }) => (
            <div className='text-white'>
                <button className='bg-green-500 p-2 rounded-lg hover:bg-green-700 m-0.5' onClick={() => openApproveLease(row.original.idticketadmin, row.original.idticket, row.original.name)}>
                    <FontAwesomeIcon icon={faCheck} />
                </button>
                <button className='bg-red-500 p-2 rounded-lg hover:bg-red-700 m-0.5' onClick={() => openDeclineLease(row.original.idticket, row.original.name)}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>
          ),
        }),
        columnHelper.accessor('more', {
          header: 'More Detail',
          size: 100,
          enableSorting: false,
          enableColumnFilter: false,
          Cell: ({ row }) => (
            <div className='text-white flex items-center justify-center cursor-pointer'>
              <button className='bg-gray-800 py-[1px] px-3 rounded-xl' onClick={() => showMoreDetailLease(row.original)}>
                <FontAwesomeIcon icon={faEllipsis} size='xl'/>
              </button>
            </div>
          ),
        })
      ];

      const tableLease = useMaterialReactTable({
        columns: columnLease,
        data: SubmitedList.ticket_list || [],
        enableFullScreenToggle: false,
        positionToolbarAlertBanner: 'none',
        displayColumnDefOptions: {
            'mrt-row-select': {
                size: 20,
                grow: false,
            },
            'mrt-row-numbers': {
                size: 20,
                grow: true,
            },
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
              borderRadius: '0',
              border: '1px solid #ffffff',
            },
        },
        muiTableBodyProps: {
            sx: {
              '& tr:nth-of-type(odd) > td': {
                backgroundColor: '#f5f5f5',
              },
            },
        },
        muiTopToolbarProps: {
            sx: {
              backgroundColor: '#1f2937',
            },
        },
        muiBottomToolbarProps: {
            sx: {
                backgroundColor: '#1f2937',
            },
        },
        muiTableHeadCellProps: {
            sx: {
              fontWeight: 'bold',
              fontSize: '14px',
            },
        },
        muiSearchTextFieldProps: {
          size: 'small',
          variant: 'outlined',
        },
        paginationDisplayMode: 'pages',
        muiPaginationProps: {
            color: 'standard',
            rowsPerPageOptions: [2, 5, 10, 20, 50, 100],
            pageSize: 5,
            shape: 'rounded',
            variant: 'outlined',
        },
      });

      return (
        <>
          <div className='p-2 bg-white z-0 static'>
            <MaterialReactTable
              table={tableLease}
            />
          </div>
        </>
      )
    }

    const ReturnContent = () => {

      const columnReturn = [
        columnHelper.accessor('idticket', {
          header: 'No Ticket',
          size: 150,
        }),
        columnHelper.accessor('assets', {
          header: 'ID Asset',
          size: 150,
        }),
        columnHelper.accessor('name', {
          header: 'Pengaju',
          size: 150,
        }),
        columnHelper.accessor('leasedate', {
          header: 'Lease Date',
          size: 150,
        }),
        columnHelper.accessor('returndate', {
          header: 'Return Date',
        }),
        columnHelper.accessor('assetlocation', {
          header: 'Location',
          size: 150,
          filterVariant: 'select',
          filterSelectOptions: ListLocation,
        }),
        columnHelper.accessor('email', {
          header: 'Email',
          size: 150,
        }),
        columnHelper.accessor('action', {
          header: 'Action',
          size: 100,
          enableSorting: false,
          enableColumnFilter: false,
          Cell: ({ row }) => (
            <div className='text-white'>
                <button className='bg-green-500 p-2 rounded-lg hover:bg-green-700 m-0.5' onClick={() => openApproveReturn(row.original.idticket, row.original.name)}>
                    <FontAwesomeIcon icon={faCheck} />
                </button>
                <button className='bg-red-500 p-2 rounded-lg hover:bg-red-700 m-0.5' onClick={() => openDeclineReturn(row.original.idticket, row.original.name)}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>
          ),
        }),
        columnHelper.accessor('more', {
          header: 'More Detail',
          size: 100,
          enableSorting: false,
          enableColumnFilter: false,
          Cell: ({ row }) => (
            <div className='text-white flex items-center justify-center cursor-pointer'>
              <button className='bg-gray-800 py-[1px] px-3 rounded-xl' onClick={() => showMoreDetailLease(row.original)}>
                <FontAwesomeIcon icon={faEllipsis} size='xl'/>
              </button>
            </div>
          ),
        })
      ];

      const tableReturn = useMaterialReactTable({
        columns: columnReturn,
        data: ReturnSubmitedList.ticket_list || [],
        enableFullScreenToggle: false,
        positionToolbarAlertBanner: 'none',
        displayColumnDefOptions: {
            'mrt-row-select': {
                size: 20,
                grow: false,
            },
            'mrt-row-numbers': {
                size: 20,
                grow: true,
            },
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
              borderRadius: '0',
              border: '1px solid #ffffff',
            },
        },
        muiTableBodyProps: {
            sx: {
              '& tr:nth-of-type(odd) > td': {
                backgroundColor: '#f5f5f5',
              },
            },
        },
        muiTopToolbarProps: {
            sx: {
              backgroundColor: '#1f2937',
            },
        },
        muiBottomToolbarProps: {
            sx: {
                backgroundColor: '#1f2937',
            },
        },
        muiTableHeadCellProps: {
            sx: {
              fontWeight: 'bold',
              fontSize: '14px',
            },
        },
        muiSearchTextFieldProps: {
          size: 'small',
          variant: 'outlined',
        },
        paginationDisplayMode: 'pages',
        muiPaginationProps: {
            color: 'standard',
            rowsPerPageOptions: [2, 5, 10, 20, 50, 100],
            pageSize: 5,
            shape: 'rounded',
            variant: 'outlined',
        },
      });

      return (
        <>
          <div className='p-2 bg-white z-0 static'>
            <MaterialReactTable
              table={tableReturn}
            />
          </div>
        </>
      )
    }

    const { token, Role, SubmitedList, refreshSubmitedList, setNotification, setNotificationStatus, setNotificationInfo, openSidebar, setOpenSidebar, refreshReturnSubmitedList, ReturnSubmitedList, ListLocation, refreshListLocation } = useAuth();
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
    const columnHelper = createMRTColumnHelper();

    useEffect(() => {
      refreshListLocation();
    }, []);

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
    
    const columnMoreLease = [
        columnHelper.accessor('assets', {
            header: 'ID Asset',
            size: 150,
        }),
        columnHelper.accessor('assetname', {
            header: 'Name',
            size: 150,
        }),
        columnHelper.accessor('assetdesc', {
            header: 'Description',
            size: 250,
        }),
        columnHelper.accessor('assetbrand', {
            header: 'Brand',
            size: 150,
        }),
        columnHelper.accessor('assetmodel', {
            header: 'Model',
            size: 150,
        }),
        columnHelper.accessor('assetstatus', {
            header: 'Status',
            size: 150,
        }),
        columnHelper.accessor('location', {
            header: 'Location',
            size: 150,
        }),
        columnHelper.accessor('assetcategory', {
            header: 'Category',
            size: 150,
        }),
        columnHelper.accessor('assetsn', {
            header: 'Serial Number',
            size: 150,
        }),
        columnHelper.accessor('image_path', {
            header: 'Photo',
            size: 100,
            Cell: ({ row }) => (
              <div>
                <img src={row.original.assetphoto} alt="Asset" className='rounded-lg shadow p-0.5 shadow-black' />
              </div>
            ),
        }),
        ];

    const tableMoreLease = useMaterialReactTable({
        columns: columnMoreLease,
        data: selectedAssetDetails || [],
        enableTopToolbar: false,
        enableBottomToolbar: false,
        enableColumnActions: false,
        enableSorting: false,
        displayColumnDefOptions: {
            'mrt-row-select': {
                size: 20,
                grow: false,
            },
            'mrt-row-numbers': {
                size: 20,
                grow: true,
            },
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
                border: '1px solid #ffffff',
            },
        },
        muiTableBodyProps: {
            sx: {
                '& tr:nth-of-type(odd) > td': {
                backgroundColor: '#f5f5f5',
                },
            },
        },
    });

    const columnMoreReturn = [
        columnHelper.accessor('assets', {
            header: 'ID Asset',
            size: 150,
        }),
        columnHelper.accessor('assetname', {
            header: 'Name',
            size: 150,
        }),
        columnHelper.accessor('assetdesc', {
            header: 'Description',
            size: 250,
        }),
        columnHelper.accessor('assetbrand', {
            header: 'Brand',
            size: 150,
        }),
        columnHelper.accessor('assetmodel', {
            header: 'Model',
            size: 150,
        }),
        columnHelper.accessor('assetstatus', {
            header: 'Status',
            size: 150,
        }),
        columnHelper.accessor('assetlocation', {
            header: 'Location',
            size: 150,
        }),
        columnHelper.accessor('assetcategory', {
            header: 'Category',
            size: 150,
        }),
        columnHelper.accessor('assetsn', {
            header: 'Serial Number',
            size: 150,
        }),
        columnHelper.accessor('image_path', {
            header: 'Photo',
            size: 100,
            Cell: ({ row }) => (
              <div>
                <img src={row.original.assetphoto} alt="Asset" className='rounded-lg shadow p-0.5 shadow-black' />
              </div>
            ),
        }),
        ];

      const tableMoreReturn = useMaterialReactTable({
          columns: columnMoreReturn,
          data: selectedAssetDetails || [],
          enableTopToolbar: false,
          enableBottomToolbar: false,
          enableColumnActions: false,
          enableSorting: false,
          displayColumnDefOptions: {
              'mrt-row-select': {
                  size: 20,
                  grow: false,
              },
              'mrt-row-numbers': {
                  size: 20,
                  grow: true,
              },
          },
          muiTablePaperProps: {
              elevation: 0,
              sx: {
                  borderRadius: '0',
                  border: '1px solid #ffffff',
              },
          },
          muiTableBodyProps: {
              sx: {
                  '& tr:nth-of-type(odd) > td': {
                  backgroundColor: '#f5f5f5',
                  },
              },
          },
      });

      const [activeTab, setActiveTab] = useState("lease");
      const data = [
      {
          label: SubmitedList.total_records ? (
            <div className='flex gap-2 items-center justify-center'>
                <div>
                    <p>
                        Lease
                    </p>
                </div>
                <div className='flex items-center mb-4'>
                    <Badge />
                </div>
            </div>
          ) : (
            <>Lease</>
          ),
          value: "lease",
          content: <LeaseContent />,
      },
      {
          label: ReturnSubmitedList.total_records ? (
            <div className='flex gap-2 items-center justify-center'>
                <div>
                    <p>
                        Return
                    </p>
                </div>
                <div className='flex items-center mb-4'>
                    <Badge />
                </div>
            </div>
          ) : (
            <>Return</>
          ),
          value: "return",
          content: <ReturnContent />,
      },
    ];

    return (
        <>
            <div className='p-2'>
                <div className='bg-gray-800 mb-8 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Welcome, Submitted page :)</h2>
                </div>
            </div>

            <div className='p-2'>
              <div className='bg-white rounded'>
                  <div className='flex justify-center'>
                      <h1 className="text-2xl font-semibold mt-6">Select Menu</h1>
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
                          {label}
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
            
            <>
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
                                  <p>Are you sure<u> want to Approve the Lease request</u> for {selectedTicketSenderName}?</p>
                              </div>
                              <div className="flex space-x-4 mt-5">
                                  <Button className="border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-200 shadow-none" onClick={closeApproveLease}>Close</Button>
                                  <Button 
                                    className="bg-green-500 hover:bg-green-600 shadow-none" 
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
                                  <p>Are you sure<u> want to Approve the Lease request</u> for {selectedTicketSenderName}?</p>
                              </div>
                              <div className="flex space-x-4 mt-5">
                                  <Button className="border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-200 shadow-none" onClick={closeApproveLease}>Close</Button>
                                  <Button 
                                    className="bg-green-500 hover:bg-green-600 shadow-none" 
                                    onClick={() => handleApprove(token)}
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
                                  <p>Are you sure <u> don't want to Approve the Lease request</u> for {selectedTicketSenderName}?</p>
                              </div>
                              <div className="flex space-x-4 mt-5">
                                  <Button className="border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-200 shadow-none" onClick={closeDeclineLease}>Close</Button>
                                  <Button 
                                    className="bg-red-500 hover:bg-red-600 shadow-none" 
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
                                  <p>Are you sure <u> don't want to Approve the Lease request</u> for {selectedTicketSenderName}?</p>
                              </div>
                              <div className="flex space-x-4 mt-5">
                                  <Button className="border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-200 shadow-none" onClick={closeDeclineLease}>Close</Button>
                                  <Button 
                                    className="bg-red-500 hover:bg-red-600 shadow-none" 
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
                          <h1>The following is a complete of Asset detail</h1>
                              <MaterialReactTable
                                table={tableMoreLease}
                              />
                          <Button onClick={closeMoreDetailLease} className="bg-gray-800 hover:bg-gray-900 mt-4">
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
                          <h1>The following is a complete of Asset detail</h1>
                              <MaterialReactTable
                                table={tableMoreLease}
                              />
                          <Button onClick={closeMoreDetailLease} className="bg-gray-800 hover:bg-red-900 mt-4">
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
                      overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[1000]"
                      className={`modal-content bg-transparent p-4 w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
                      shouldCloseOnOverlayClick={false}
                      >
                      <div className='p-2'>
                          <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                              <div className='flex flex-col text-center mb-2'>
                                  <h1 className="text-2xl font-semibold">Select Action</h1>
                                  <p>Are you sure<u> want to Approve the Lease request</u> for {selectedTicketSenderName}?</p>
                              </div>
                              <div className="flex space-x-4 mt-5">
                                  <Button className="border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-200 shadow-none" onClick={closeApproveReturn}>Close</Button>
                                  <Button 
                                    className="bg-green-500 hover:bg-green-600 shadow-none" 
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
                                  <p>Are you sure<u> want to Approve the Lease request</u> for {selectedTicketSenderName}?</p>
                              </div>
                              <div className="flex space-x-4 mt-5">
                                  <Button className="border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-200 shadow-none" onClick={closeApproveReturn}>Close</Button>
                                  <Button 
                                    className="bg-green-500 hover:bg-green-600 shadow-none" 
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
                                  <p>Are you sure <u> don't want to Approve the Lease request</u> for {selectedTicketSenderName}?</p>
                              </div>
                              <div className="flex space-x-4 mt-5">
                                  <Button className="border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-200 shadow-none" onClick={closeDeclineReturn}>Close</Button>
                                  <Button 
                                    className="bg-red-500 hover:bg-red-600 shadow-none" 
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
                                  <h1 className="text-2xl font-semibold">Select Action</h1>
                                  <p>Are you sure <u> don't want to Approve the Lease request</u> for {selectedTicketSenderName}?</p>
                              </div>
                              <div className="flex space-x-4 mt-5">
                                  <Button className="border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-200 shadow-none" onClick={closeDeclineReturn}>Close</Button>
                                  <Button 
                                    className="bg-red-500 hover:bg-red-600 shadow-none" 
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
                          <h1>The following is a complete of Asset detail</h1>
                              <MaterialReactTable
                                    table={tableMoreReturn}
                              />
                          <Button onClick={closeMoreDetailReturn} className="bg-gray-800 hover:bg-red-900 mt-4">
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
                          <h1>The following is a complete of Asset detail</h1>
                              <MaterialReactTable
                                    table={tableMoreReturn}
                              />
                          <Button onClick={closeMoreDetailReturn} className="bg-gray-800 hover:bg-gray-900 mt-4">
                              Close
                          </Button>
                      </div>
                  </Modal>
              )}
            </>
        </>
    )
}
export default Submitted