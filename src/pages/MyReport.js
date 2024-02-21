import React, { useState, useEffect} from 'react'
import { MaterialReactTable, useMaterialReactTable, createMRTColumnHelper } from 'material-react-table';
import { faEllipsis, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@material-tailwind/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';
import { useAuth } from '../AuthContext';
Modal.setAppElement('#root');

const MyReport = () => {
     const { token, Role, refreshMyReport, MyReport, setNotification, setNotificationStatus, NotificationInfo, setNotificationInfo, openSidebar, setOpenSidebar, } = useAuth();
     const [selectedAssetDetails, setSelectedAssetDetails] = useState([]);
     const [dataWithRemainingTime, setDataWithRemainingTime] = useState([]);
     const [selectedMyReportID, setselectedMyReportID] = useState(null);
     const [isLoading, setIsLoading] = useState(false);
     const [windowWidth, setWindowWidth] = useState(window.innerWidth);
     const isMobile = windowWidth <= 768;
     const [isDesktopView, setIsDesktopView] = useState(window.innerWidth > 768);
     const columnHelper = createMRTColumnHelper();

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
        if (Role === 0 || Role === 1 || Role === 2) {
            await refreshMyReport();
        }
    };
    refreshData();

    window.addEventListener("beforeunload", refreshData);
        return () => {
            window.removeEventListener("beforeunload", refreshData);
        };
    }, [Role]);
    
    useEffect(() => {
        if (MyReport.myreport_list) {
            const currentDate = new Date();
            const dataWithTimeRemaining = MyReport.myreport_list.map((item) => {
                const returnDate = new Date(item.returndate);
                const timeDiff = returnDate - currentDate;
                const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                return {
                    ...item,
                    timeRemaining: `${daysRemaining} Days`,
                };
            });
            setDataWithRemainingTime(dataWithTimeRemaining);
        }
    }, [MyReport.myreport_list]);

    const [deleteModal, setDeleteModal] = useState(false);

    // Modal
    const [showModalAsset, setShowModalAsset] = useState(false);
    const showMoreDetailHandler = (row) => {
        setSelectedAssetDetails([row]);
        setShowModalAsset(true);
      };

    const closeModalAssetHandle = () => {
        setShowModalAsset(false);
    };

    const deleteModalHandler = (id) => {
        setselectedMyReportID(id);
        setDeleteModal((prev) => !prev);
        console.log('delete modal')
    };

    const handleDelete = async (token) => {
        try {
          setIsLoading(true);
    
          const response = await fetch(
            `https://asset.lintasmediadanawa.com:8443/api/myreportdelete/${selectedMyReportID}`,
            {
              method: 'PUT',
              headers: {
                Authorization: token,
              },
            }
          );
    
          if (response.status === 200) {
            const data = await response.json();
            setDeleteModal((prev) => !prev);
            refreshMyReport();
            setNotification(data.message);
            setNotificationStatus(true);
            setNotificationInfo(data.Status);
            setSelectedAssetDetails(null);
            setselectedMyReportID(null);
          } else {
            console.error('Failed to Delete');
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setIsLoading(false);
        }
      };

    const columnReport = [
        columnHelper.accessor('no', {
          header: 'No',
          size: 50,
        }),
        columnHelper.accessor('asset', {
          header: 'ID Asset',
          size: 150,
        }),
        columnHelper.accessor('leasedate', {
          header: 'Lease Date',
          size: 150,
        }),
        columnHelper.accessor('returndate', {
          header: 'Return Date',
          size: 150,
        }),
        columnHelper.accessor('timeRemaining', {
          header: 'Time Remaining',
        }),
        columnHelper.accessor('submitted1', {
          header: 'Submitted #1',
          size: 150,
          enableSorting: false,
          enableColumnFilter: false,
          Cell: ({ row }) => (
            <div className='flex flex-col'>
                <div>
                    {row.original.admin1status === 'on Request' ? (
                    <p>
                        <span>{row.original.admin1}'s Approval Pending</span>
                    </p>
                    ) : (
                    <div>
                        <p>
                            <span>{row.original.admin1} </span>
                            <span> has </span>
                            {row.original.admin1status === 'Approved' ? (
                                <span className='text-green-500 font-semibold'>{row.original.admin1status}</span>
                            ) : (
                                <span className='text-red-500 font-semibold'>{row.original.admin1status}</span>
                            )}
                        </p>
                    </div>
                    )}
                </div>
            </div>
          ),
        }),
        columnHelper.accessor('submitted2', {
          header: 'Submitted #2',
          size: 150,
          enableSorting: false,
          enableColumnFilter: false,
          Cell: ({ row }) => (
            <div className='flex flex-col'>
                <div>
                    {row.original.admin1status === 'on Request' ? (
                    <p>
                        <span>{row.original.admin1}'s Approval Pending</span>
                    </p>
                    ) : (
                    <div>
                        <p>
                            <span>{row.original.admin2} </span>
                            <span> has </span>
                            {row.original.admin1status === 'Approved' ? (
                                <span className='text-green-500 font-semibold'>{row.original.admin2status}</span>
                            ) : (
                                <span className='text-red-500 font-semibold'>{row.original.admin2status}</span>
                            )}
                        </p>
                    </div>
                    )}
                </div>
            </div>
          ),
        }),
        columnHelper.accessor('status', {
          header: 'Status',
          size: 150,
          Cell: ({ row }) => (
            <div className='flex flex-col'>
                <div>
                    {row.original.statusticket === 'on Request' ? (
                    <p>Approval Pending</p>
                    ) : (
                    <div>
                        <p>
                            {row.original.statusticket === 'Approved' ? (
                                <span className='text-green-500 font-semibold'>{row.original.statusticket}</span>
                            ) : (
                                <span className='text-red-500 font-semibold'>{row.original.statusticket}</span>
                            )}
                        </p>
                    </div>
                    )}
                </div>
            </div>
          ),
        }),
        columnHelper.accessor('more', {
          header: 'More Detail',
          size: 50,
          enableSorting: false,
          enableColumnFilter: false,
          Cell: ({ row }) => (
            <div className='text-white flex items-center justify-center cursor-pointer'>
                <button 
                className='bg-gray-800 py-[1px] px-3 rounded-xl' 
                onClick={() => showMoreDetailHandler(row.original)}
                >
                <FontAwesomeIcon icon={faEllipsis} size='xl'/>
                </button>
            </div>
          ),
        }),
        columnHelper.accessor('action', {
          header: 'Action',
          size: 50,
          enableSorting: false,
          enableColumnFilter: false,
          Cell: ({ row }) => (
            <div className='text-white'>
                {row.original.statusticket === 'Approved' || row.original.statusticket === 'Decline' ? (
                    <button 
                        className='bg-red-500 p-2 rounded-lg hover:bg-red-700 m-0.5' 
                        onClick={() => deleteModalHandler(row.original.idticket)}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                ) : (
                    <button 
                        className='bg-red-500 p-2 rounded-lg hover:bg-red-700 m-0.5' 
                        onClick={() => deleteModalHandler(row.original.idticket)}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                )}
            </div>
          ),
        }),
      ];

    const tableReport = useMaterialReactTable({
        columns: columnReport,
        data: dataWithRemainingTime || [],
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

    const columnMore = [
        columnHelper.accessor('asset', {
            header: 'ID Asset',
            size: 150,
        }),
        columnHelper.accessor('assetname', {
            header: 'Name',
            size: 150,
        }),
        columnHelper.accessor('assetdescription', {
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

    const tableMore = useMaterialReactTable({
        columns: columnMore,
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
    
    return (
        <>
            <div className='p-2'>
                <div className='bg-gray-800 mb-8 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Welcome, My Report page :)</h2>
                </div>
                <div className='p-2 bg-white'>
                    <div className='p-3 flex gap-1'>
                        <div className='flex gap-1'>
                            <h3>Jumlah Asset yang sedang anda pinjam : </h3>
                            <h3 className='font-semibold bg-[#efefef] rounded'> {MyReport.onloan}</h3>
                        </div>   
                    </div>
                    <div className='p-3 flex gap-1'>
                        <div className='flex gap-1'>
                            <h3>Jumlah Asset yang sedang anda ajukan : </h3>
                            <h3 className='font-semibold bg-[#efefef] rounded'> {MyReport.onrequest}</h3>
                        </div>   
                    </div>
                </div>
                <div className='mt-1'>
                    <MaterialReactTable
                        table={tableReport}
                    />
                </div>
            </div>

            
            {isDesktopView && (
                <Modal
                    isOpen={deleteModal}
                    onRequestClose={deleteModalHandler}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed z-10 inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                    className={`modal-content bg-transparent p-4 w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2'>
                        <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                            <div className='flex flex-col text-center mb-2'>
                            <h1 className="text-2xl font-semibold">Select Action</h1>
                            <p>Are you sure you want to delete this Report?</p>
                            </div>
                            
                            <div className="flex space-x-4 mt-5">
                            <Button 
                            className="border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-200 shadow-none" 
                            onClick={deleteModalHandler}
                            >
                                Cancel
                            </Button>
                            <Button 
                            className="bg-red-500 hover:bg-red-600 shadow-none"
                            onClick={() => handleDelete(token)}
                            disabled={isLoading}
                            >
                                {isLoading ? 'Proses...' : 'Delete'}
                            </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
            {!isDesktopView && (
                <Modal
                    isOpen={showModalAsset}
                    onRequestClose={closeModalAssetHandle}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed z-10 inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                    className='modal-content bg-transparent p-4 w-screen'
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2'>
                        <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                            <div className='flex flex-col text-center mb-2'>
                            <h1 className="text-2xl font-semibold">Select Action</h1>
                            <p>Are you sure you want to delete this Report?</p>
                            </div>
                            
                            <div className="flex space-x-4 mt-5">
                            <Button 
                            className="border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-200 shadow-none" 
                            onClick={deleteModalHandler}
                            >
                                Cancel
                            </Button>
                            <Button 
                            className="bg-red-500 hover:bg-red-600 shadow-none"
                            onClick={() => handleDelete(token)}
                            disabled={isLoading}
                            >
                                {isLoading ? 'Proses...' : 'Delete'}
                            </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {isDesktopView && (
                <Modal
                    isOpen={showModalAsset}
                    onRequestClose={closeModalAssetHandle}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed z-10 inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                    className={`modal-content bg-transparent p-4 w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2 py-4 bg-white'>
                        <h1>The following is a complete asset detail</h1>
                            <MaterialReactTable
                                table={tableMore}
                            />
                        <Button onClick={closeModalAssetHandle} className="bg-gray-800 mt-4">
                            Close
                        </Button>
                    </div>
                </Modal>
            )}
            {!isDesktopView && (
                <Modal
                    isOpen={showModalAsset}
                    onRequestClose={closeModalAssetHandle}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed z-10 inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                    className='modal-content bg-transparent p-4 w-screen'
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2 py-4 bg-white'>
                        <h1>The following is a complete asset detail</h1>
                            <MaterialReactTable
                                table={tableMore}
                            />
                        <Button onClick={closeModalAssetHandle} className="bg-gray-800 mt-4">
                            Close
                        </Button>
                    </div>
                </Modal>
            )}
        </>
    )
}
export default MyReport;