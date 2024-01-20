import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../AuthContext';
import foto from '../resources/img/aset2.jpg';
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
        setselectedLoanID(selectedLoanID.filter((loan) => loan.id !== row.id));
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


    const morecolumn = [
      {
          name: 'ID Asset',
          selector: (row) => row.idasset,
          },
          {
          name: 'Name',
          selector: (row) => row.nameasset,
          },
          {
          name: 'Description',
          selector: (row) => row.assetsdesc,
          },
          {
          name: 'Brand',
          selector: (row) => row.assetsbrand,
          },
          {
          name: 'Model',
          selector: (row) => row.assetsmodel,
          },
          {
          name: 'Status',
          selector: (row) => row.assetsstatus,
          },
          {
          name: 'Location',
          selector: (row) => row.assetslocation,
          },
          {
          name: 'Category',
          selector: (row) => row.assetscategory,
          },
          {
          name: 'SN',
          selector: (row) => row.assetssn,
          },
          {
          name: 'Photo',
          cell: (row) => (
              <div>
                <img src={row.assetsphoto} alt="Asset" className='rounded-lg shadow p-0.5 shadow-black' />
              </div>
            ),
          },
  ]

    const moredata = [
      { id: 'Asset 0001', name: 'Laptop', description: 'leptop gemink gada obat', brand: 'Asus', model: 'Vivobook', status: 'Available', location: 'LMD', category: 'Laptop', sn: '123123123123', photo: '', action: '' },
  ]

    const columns = [
        {
            name: 'No',
            selector: (row) => row.row,
            sortable: true,
            export: true,
        },
        {
            name: 'ID Asset',
            selector: (row) => row.idasset,
            export: true,
        },
        {
            name: 'Name',
            selector: (row) => row.nameasset,
            export: true,
        },
        {
            name: 'Lease Date',
            selector: (row) => row.leasedate,
            export: true,
        },
        {
            name: 'Return Date',
            selector: (row) => row.returndate,
            export: true,
        },
        {
            name: 'Time Remaining',
            selector: (row) => row.timeRemaining,
            export: true,
        },
        {
            name: 'Action',
            cell: (row) => (
                <div className='text-white'>
                    <input 
                    type="radio" 
                    name="selected_assets" 
                    value=""
                    onClick={() => {
                        if (selectedLoanID.some((loan) => loan.id === row.id)) {
                            handleRowDeselected(row);
                        } else {
                            handleRowSelected(row);
                        }
                    }} />
                </div>
            ),
        },
        {
            name: 'More Detail',
            cell: (row) => (
                <div className='text-white flex items-center justify-center cursor-pointer'>
                  <button className='bg-gray-800 p-1 rounded-lg' onClick={() => showMoreDetailHandler(row)}>
                    <FontAwesomeIcon icon={faCircleInfo} size='xl'/>
                  </button>
                </div>
              ),
            },
    ];

    return (
        <>
            <div className='p-2'>
                <div className='bg-black mb-5 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Selamat datang di Return page :)</h2>
                </div>
            </div>
            <div className='p-2'>
                <div className='p-2 bg-white'>
                    <div className='p-3 flex gap-1'>
                        <div className='flex gap-1'>
                            <h3>Jumlah Asset yang anda pinjam : </h3>
                            <h3 className='font-semibold bg-[#efefef] rounded'>{DataLoan.loancount}</h3>
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
                <DataTable
                    columns={columns}
                    data={dataWithRemainingTime}
                    noHeader
                    defaultSortField='id'
                    defaultSortAsc={false}
                    pagination
                    highlightOnHover
                />
            </div>
            <div className='flex justify-end p-2'>
                <button
                    className='main-btn'
                    type='submit'
                    onClick={() => handleReturnAsset(token, selectedLoanID)}
                    disabled={isLoading} 
                >
                    {isLoading ? 'Returning...' : 'Return'}
                </button>
            </div>
        </>
    )
};

export default Return;
