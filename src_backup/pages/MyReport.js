import React, { useState, useEffect} from 'react'
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { faCircleInfo, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';
import { useAuth } from '../AuthContext';
Modal.setAppElement('#root');

const MyReport = () => {
     const { token, Role, refreshMyReport, MyReport, setNotification, setNotificationStatus, openSidebar, setOpenSidebar, } = useAuth();
     const [selectedAssetDetails, setSelectedAssetDetails] = useState([]);
     const [dataWithRemainingTime, setDataWithRemainingTime] = useState([]);
     const [selectedMyReportID, setselectedMyReportID] = useState(null);
     const [isLoading, setIsLoading] = useState(false);
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
            await refreshMyReport();
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
        if (MyReport.myreport_list) {
            const currentDate = new Date();
            const dataWithTimeRemaining = MyReport.myreport_list.map((item) => {
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
    }, [MyReport.myreport_list]);

    const [showDelete, setShowDelete] = useState(false);

    // Modal
    const [showModalAsset, setShowModalAsset] = useState(false);
    const showMoreDetailHandler = (row) => {
        setSelectedAssetDetails([row]);
        setShowModalAsset(true);
      };

    const closeModalAssetHandle = () => {
        setShowModalAsset(false);
    };

    const showDeleteHandler = (id) => {
        setselectedMyReportID(id);
        setShowDelete((prev) => !prev);
    };


    // 
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
            setShowDelete(false);
            refreshMyReport();
            setNotification(data.message);
            setNotificationStatus(true);
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

    const morecolumn = [
        {
            name: 'ID Asset',
            selector: (row) => row.asset,
            },
            {
            name: 'Name',
            selector: (row) => row.assetname,
            },
            {
            name: 'Description',
            selector: (row) => row.assetdescription,
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

    const columns = [
        {
            name: 'No',
            selector: (row) => row.no,
            },
            {
            name: 'ID Asset',
            selector: (row) => row.asset,
            },
            {
            name: 'Lease Date',
            selector: (row) => row.leasedate,
            },
            {
            name: 'Return Date',
            selector: (row) => row.returndate,
            },
            {
            name: 'Time Remaining',
            selector: (row) => row.timeRemaining,
            },
            {
            name: 'Submitted #1',
            cell: (row) => (
                <div className='flex flex-col'>
                    <div>
                      {row.admin1status === 'on Request' ? (
                        <p>
                            <span>{row.admin1}'s Approval Pending</span>
                        </p>
                      ) : (
                        <div>
                            <p>
                                <span>{row.admin1} </span>
                                <span> has </span>
                                {row.admin1status === 'Approved' ? (
                                    <span className='text-green-500 font-semibold'>{row.admin1status}</span>
                                ) : (
                                    <span className='text-red-500 font-semibold'>{row.admin1status}</span>
                                )}
                            </p>
                        </div>
                      )}
                    </div>
                </div>
            ),
            },
            {
            name: 'Submitted #2',
            cell: (row) => (
                <div className='flex flex-col'>
                    <div>
                      {row.admin2status === 'on Request' ? (
                        <p>
                            <span>{row.admin2}'s Approval Pending</span>
                        </p>
                      ) : (
                        <div>
                            <p>
                                <span>{row.admin2} </span>
                                <span> has </span>
                                {row.admin2status === 'Approved' ? (
                                    <span className='text-green-500 font-semibold'>{row.admin2status}</span>
                                ) : (
                                    <span className='text-red-500 font-semibold'>{row.admin2status}</span>
                                )}
                            </p>
                        </div>
                      )}
                    </div>
                </div>
            ),
            },
            {
            name: 'Status',
            cell: (row) => (
                <div className='flex flex-col'>
                    <div>
                      {row.statusticket === 'on Request' ? (
                        <p>Approval Pending</p>
                      ) : (
                        <div>
                            <p>
                                {row.statusticket === 'Approved' ? (
                                    <span className='text-green-500 font-semibold'>{row.statusticket}</span>
                                ) : (
                                    <span className='text-red-500 font-semibold'>{row.statusticket}</span>
                                )}
                            </p>
                        </div>
                      )}
                    </div>
                </div>
            ),
            },
            {
                name: 'More Detail',
                cell: (row) => (
                    <div className='text-white flex items-center justify-center cursor-pointer'>
                      <button 
                        className='bg-gray-800 p-1 rounded-lg' 
                        onClick={() => showMoreDetailHandler(row)}
                      >
                        <FontAwesomeIcon icon={faCircleInfo} size='xl'/>
                      </button>
                    </div>
                  ),
                },
            {
            name: 'Action',
            cell: (row) => (
                <div className='text-white'>
                    {row.statusticket === 'Approved' ? (
                        <button 
                            className='bg-red-500 p-2 rounded-lg hover:bg-red-700 m-0.5' 
                            onClick={() => showDeleteHandler(row.idticket)}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    ) : (
                        <button 
                            className='bg-red-500 p-2 rounded-lg hover:bg-red-700 m-0.5' 
                            onClick={() => showDeleteHandler(row.idticket)} disabled
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    )}
                </div>
                ),
            },
    ]
    
    return (
        <>
            <div className='p-2'>
                <div className='bg-black mb-5 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Selamat datang di My Report page :)</h2>
                </div>
            </div>

            {showDelete && (
            <div className='p-2'>
                <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                    <div className='flex flex-col text-center mb-2'>
                    <h1 className="text-2xl font-semibold">Select Action</h1>
                    <p>Apakah anda yakin ingin menghapus Report ini?</p>
                    </div>
                    
                    <div className="flex space-x-4 mt-5">
                    <button 
                    className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" 
                    onClick={showDeleteHandler}
                    >
                        Cancel
                    </button>
                    <button 
                    className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded"
                    onClick={() => handleDelete(token)}
                    disabled={isLoading}
                    >
                        {isLoading ? 'Proses...' : 'Delete'}
                    </button>
                    </div>
                </div>
            </div>
            )}

            <div className='p-2'>
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
            </div>
            
            {isDesktopView && (
                <Modal
                    isOpen={showModalAsset}
                    onRequestClose={closeModalAssetHandle}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                    className={`modal-content bg-transparent p-4 w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2 py-4 bg-white'>
                        <h1>Ini adalah detail lengkap asset</h1>
                            <DataTable
                                columns={morecolumn}
                                data={selectedAssetDetails}
                                highlightOnHover
                            />
                        <button onClick={closeModalAssetHandle} className="main-btn mt-4">
                            Close
                        </button>
                    </div>
                </Modal>
            )}
            {!isDesktopView && (
                <Modal
                    isOpen={showModalAsset}
                    onRequestClose={closeModalAssetHandle}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                    className='modal-content bg-transparent p-4 w-screen'
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2 py-4 bg-white'>
                        <h1>Ini adalah detail lengkap asset</h1>
                            <DataTable
                                columns={morecolumn}
                                data={selectedAssetDetails}
                                highlightOnHover
                            />
                        <button onClick={closeModalAssetHandle} className="main-btn mt-4">
                            Close
                        </button>
                    </div>
                </Modal>
            )}

            <div className='p-2'>
                <DataTableExtensions
                columns={columns}
                data={dataWithRemainingTime}
                fileName='hehe'
                filter
                print={false}
                export={false}
                exportHeaders={false}
                filterPlaceholder='Filter Data'
                
                >
                <DataTable
                    noHeader
                    defaultSortField='no'
                    defaultSortAsc={false}
                    pagination
                    highlightOnHover
                    paginationRowsPerPageOptions={[5, 10, 20, 50]} // Pilihan jumlah baris per halaman
                    paginationPerPage={5} // Jumlah baris per halaman default
                />
                </DataTableExtensions>
            </div>
        </>
    )
}
export default MyReport;