import React, { useEffect, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable, createMRTColumnHelper } from 'material-react-table';
import { faCircleInfo, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../AuthContext';
import { Button } from '@material-tailwind/react'
import Modal from 'react-modal';
Modal.setAppElement('#root');

const Return = () => {
    const { token, Role, refreshDataLoan, DataLoan, setNotification, setNotificationStatus, setNotificationInfo, openSidebar, setOpenSidebar, } = useAuth();
    const [dataWithRemainingTime, setDataWithRemainingTime] = useState([]);
    const [selectedLoanID, setselectedLoanID] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAssetDetails, setSelectedAssetDetails] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const isMobile = windowWidth <= 768;
    const [isDesktopView, setIsDesktopView] = useState(window.innerWidth > 768);


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
                await refreshDataLoan();
            }
        };

        refreshData();

        window.addEventListener("beforeunload", refreshData);

        return () => {
            window.removeEventListener("beforeunload", refreshData);
        };
        // eslint-disable-next-line
    }, [Role]);

    useEffect(() => {
        if (DataLoan.data) {
            const currentDate = new Date();
            const dataWithTimeRemaining = DataLoan.data.map((item) => {
                const returnDate = new Date(item.returndate);
                const timeDiff = returnDate - currentDate;
                const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                return {
                    ...item,
                    timeRemaining: `${daysRemaining} Hari (otomatis)`,
                };
            });
            setDataWithRemainingTime(dataWithTimeRemaining);
        }
    }, [DataLoan.data]);

    const handleRowSelected = (row) => {
        setselectedLoanID([]);
        setselectedLoanID([row.id]);
        console.log(selectedLoanID);
        
    };

    const handleRowDeselected = (row) => {
        setselectedLoanID(selectedLoanID.filter((loan) => loan.id !== row.original.id));
        console.log(selectedLoanID);
      };

      const handleReturnAsset = async (token, selectedLoanID) => {
        try {
          setIsLoading(true); // Atur status loading menjadi true
      
          const response = await fetch(`https://asset.lintasmediadanawa.com:8443/api/returnsloan/${selectedLoanID}`, {
            method: "POST",
            headers: {
              Authorization: token,
            },
          });
      
          if (response.status === 200) {
            const data = await response.json();
            setNotification(data.message);
            setNotificationStatus(true);
            setNotificationInfo(data.Status);
            await refreshDataLoan();
            setIsLoading(false); // Atur status loading menjadi false
          } else {
            setNotification('Failed return');
            setNotificationStatus(true);
            setNotificationInfo("error");
            setIsLoading(false); // Atur status loading menjadi false
          }
        } catch (error) {
          console.error("Error:", error);
          setIsLoading(false); // Atur status loading menjadi false
        }
      };
      

    // Modal
    const [showModalAsset, setShowModalAsset] = useState(false);

    const showMoreDetailHandler = (row) => {
        setSelectedAssetDetails([row]);
        setShowModalAsset(true);
      };

    const closeModalAssetHandle = () => {
      setShowModalAsset(false);
    };

    const columnHelper = createMRTColumnHelper();
    const columnsReturn = [
        columnHelper.accessor('row', {
        header: 'No',
        size: 150,
        }),
        columnHelper.accessor('idasset', {
        header: 'ID Asset',
        size: 150,
        }),
        columnHelper.accessor('nameasset', {
        header: 'Name',
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
        size: 150,
        }),
        columnHelper.accessor('action', {
            header: 'Action',
            size: 100,
            enableSorting: false,
            enableColumnFilter: false,
            Cell: ({ row }) => (
                <div className='text-white'>
                    <input 
                    type="radio" 
                    name="selected_assets" 
                    value=""
                    onClick={() => {
                        if (selectedLoanID.some((loan) => loan.id === row.original.id)) {
                            handleRowDeselected(row.original);
                        } else {
                            handleRowSelected(row.original);
                        }
                    }} />
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
                    <button className='bg-gray-800 py-[1px] px-3 rounded-xl' onClick={() => showMoreDetailHandler(row.original)}>
                        <FontAwesomeIcon icon={faEllipsis} size='xl'/>
                    </button>
                </div>
            ),
        })
    ];

    const tableReturnAsset = useMaterialReactTable({
        columns: columnsReturn,
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
        columnHelper.accessor('idasset', {
            header: 'ID Asset',
            size: 150,
        }),
        columnHelper.accessor('nameasset', {
            header: 'Name',
            size: 150,
        }),
        columnHelper.accessor('assetsdesc', {
            header: 'Description',
            size: 250,
        }),
        columnHelper.accessor('assetsbrand', {
            header: 'Brand',
            size: 150,
        }),
        columnHelper.accessor('assetsmodel', {
            header: 'Model',
            size: 150,
        }),
        columnHelper.accessor('assetsstatus', {
            header: 'Status',
            size: 150,
        }),
        columnHelper.accessor('assetslocation', {
            header: 'Location',
            size: 150,
        }),
        columnHelper.accessor('assetscategory', {
            header: 'Category',
            size: 150,
        }),
        columnHelper.accessor('assetssn', {
            header: 'Serial Number',
            size: 150,
        }),
        columnHelper.accessor('image_path', {
            header: 'Photo',
            size: 100,
            Cell: ({ row }) => (
                <div className='cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105'>
                    <img src={row.original.assetsphoto} alt="Asset" className='rounded-lg shadow p-0.5 shadow-black' />
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
                <div className='bg-gray-800 mb-5 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Welcome, Return page :)</h2>
                </div>
                <div className='p-2 bg-white'>
                    <div className='p-3 flex gap-1'>
                        <div className='flex gap-1'>
                            <h3>Jumlah Asset yang anda pinjam : </h3>
                            <h3 className='font-semibold bg-[#efefef] rounded'>{DataLoan.loancount}</h3>
                        </div>   
                    </div>
                </div>
                <div className='mt-1'>
                    <MaterialReactTable 
                        table={tableReturnAsset}
                    />
                </div>
                <div className='flex justify-end'>
                    <Button
                        className='bg-gray-800'
                        type='submit'
                        onClick={() => handleReturnAsset(token, selectedLoanID)}
                        disabled={isLoading} 
                    >
                        {isLoading ? 'Returning...' : 'Return'}
                    </Button>
                </div>
            </div>

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
                        <h1>The following is a complete of Asset detail.</h1>
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
                        <h1>The following is a complete of Asset detail.</h1>
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
};

export default Return;
