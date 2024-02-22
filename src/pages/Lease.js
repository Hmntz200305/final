import React, { useEffect, useState} from 'react'
import { useMaterialReactTable, createMRTColumnHelper, MaterialReactTable } from 'material-react-table';
import { useAuth } from '../AuthContext';
import { Input, Menu, MenuList, MenuItem, MenuHandler, Button } from "@material-tailwind/react";

const Lease = () => {
    const { token, DataListAssetExcept, refreshAssetDataExcept, LocationOptions, refreshLocationList, refreshAdminList, AdminList, username, setNotification, setNotificationStatus, setNotificationInfo,  ListCategory, refreshListCategory, ListStatus, refreshListStatus, ListLocation, refreshListLocation } = useAuth();
    const [showTable, setShowTable] = useState(true);
    const [showFormulir, setShowFormulir] = useState(false);
    const [Name, setName] = useState('');
    const [Location, setLocation] = useState('');
    const [CheckoutDate, setCheckoutDate] = useState('');
    const [CheckinDate, setCheckinDate] = useState('');
    const [Email, setEmail] = useState(localStorage.getItem('email') || '');
    const [Note, setNote] = useState('');
    const [selectedAssets, setSelectedAssets] = useState([]);
    const [selectedAssetsID, setSelectedAssetsID] = useState([]);
    const [selectedAdmin1, setSelectedAdmin1] = useState(''); // State untuk Admin 1
    const [selectedAdmin2, setSelectedAdmin2] = useState(''); // State untuk Admin 2
    const [isLoading, setIsLoading] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const isMobile = windowWidth <= 994;
    const [inputValueLocation, setInputValueLocation] = useState('');
    const [inputValueAdmin1, setInputValueAdmin1] = useState('');
    const [inputValueAdmin2, setInputValueAdmin2] = useState('');

    const handleOptionSelectLocation = (option) => {
        setInputValueLocation(option);
        setLocation(option);
    };

    const handleOptionSelectAdmin1 = (option, option2) => {
        setInputValueAdmin1(option);
        setSelectedAdmin1(option2);
    };

    const handleOptionSelectAdmin2 = (option, option2) => {
        setInputValueAdmin2(option);
        setSelectedAdmin2(option2);
    };

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, []);
    
    useEffect(() => {
        refreshAssetDataExcept();
        refreshLocationList();
        refreshAdminList();
        refreshListCategory();
        refreshListStatus();
        refreshListLocation();
    }, []);

    useEffect(() => {
        if (username) {
          setName(username);
        }
      }, [username]);

    const handleRowSelected = (row) => {
        setSelectedAssets([]);
        setSelectedAssetsID([]);
        setSelectedAssets([row]);
        setSelectedAssetsID([row.no]);  
    };

    const handleRowDeselected = (row) => {
        setSelectedAssets(selectedAssets.filter((asset) => asset.id !== row.id));
    };
    
    const handleLeaseAsset = async (token) => {
        try {
          setIsLoading(true);
          const formData = new FormData();
  
          formData.append('AssetID', selectedAssetsID)
          formData.append('Name', Name);
          formData.append('CheckoutDate', CheckoutDate);
          formData.append('CheckinDate', CheckinDate);
          formData.append('Location', Location);
          formData.append('Email', Email);
          formData.append('Note', Note);
          formData.append('Admin1', selectedAdmin1)
          formData.append('Admin2', selectedAdmin2)
  
          const response = await fetch("https://asset.lintasmediadanawa.com:8443/api/leaseticket", {
            method: "POST",
            headers: {
              Authorization: token,
            },
            body: formData,
          });
  
          if (response.status === 200) {
            const data = await response.json();
            setNotification(data.message);
            setNotificationStatus(true);
            setNotificationInfo(data.Status);
            showTableHandler();
            refreshAssetDataExcept();
            setSelectedAssets([]);
            setSelectedAssetsID([]);
            setCheckoutDate('');
            setCheckinDate('');
            setLocation('');
            setNote('');
          } else {
            setNotification('Diharapkan mengisi semua Form');
            setNotificationStatus(true);
            setNotificationInfo("warning");
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
      };
      
    const showTableHandler = () => {
        setSelectedAssets([]);
        setShowTable((prev) => !prev);
        setShowFormulir(false);
        setSelectedAssets([]);
    };
    const showFormulirHandler = () => {
        setShowTable(false);
        setShowFormulir((prev) => !prev);

    };

    const columnHelper = createMRTColumnHelper();

    const columnAsset = [
    columnHelper.accessor('no', {
      header: 'No',
      size: 150,
    }),
    columnHelper.accessor('id', {
      header: 'ID Asset',
      size: 150,
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      size: 150,
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      size: 250,
    }),
    columnHelper.accessor('brand', {
      header: 'Brand',
      size: 150,
    }),
    columnHelper.accessor('model', {
      header: 'Model',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      size: 150,
      filterVariant: 'select',
      filterSelectOptions: ListStatus,
    }),
    columnHelper.accessor('location', {
      header: 'Location',
      size: 150,
      filterVariant: 'select',
      filterSelectOptions: ListLocation,
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      size: 150,
      filterVariant: 'select',
      filterSelectOptions: ListCategory,
    }),
    columnHelper.accessor('sn', {
      header: 'Serial Number',
      size: 150,
    }),
    columnHelper.accessor('image_path', {
      header: 'Photo',
      size: 100,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <img src={row.original.image_path} alt="Asset" className='rounded-lg shadow p-0.5 shadow-black' />
      ),
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
                    onClick={() => {
                        if (selectedAssets.some((asset) => asset.id === row.original.id)) {
                            handleRowDeselected(row.original);
                            console.log(row.original);
                        } else {
                            handleRowSelected(row.original);
                        }
                    }}
                />
            </div>
        ),
    })
  ];

  const tableLeaseAsset = useMaterialReactTable({
    columns: columnAsset,
    data: DataListAssetExcept || [],
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

    
    const columnForm = [
        columnHelper.accessor('no', {
          header: 'No',
          size: 150,
        }),
        columnHelper.accessor('id', {
          header: 'ID Asset',
          size: 150,
        }),
        columnHelper.accessor('name', {
          header: 'Name',
          size: 150,
        }),
        columnHelper.accessor('description', {
          header: 'Description',
          size: 250,
        }),
        columnHelper.accessor('brand', {
          header: 'Brand',
          size: 150,
        }),
        columnHelper.accessor('model', {
          header: 'Model',
        }),
        columnHelper.accessor('status', {
          header: 'Status',
          size: 150,
          filterVariant: 'select',
          filterSelectOptions: ListStatus,
        }),
        columnHelper.accessor('location', {
          header: 'Location',
          size: 150,
          filterVariant: 'select',
          filterSelectOptions: ListLocation,
        }),
        columnHelper.accessor('category', {
          header: 'Category',
          size: 150,
          filterVariant: 'select',
          filterSelectOptions: ListCategory,
        }),
        columnHelper.accessor('sn', {
          header: 'Serial Number',
          size: 150,
        }),
        columnHelper.accessor('image_path', {
          header: 'Photo',
          size: 100,
          enableSorting: false,
          enableColumnFilter: false,
          Cell: ({ row }) => (
            <div>
                <img src={row.original.image_path} alt="Asset" className='rounded-lg shadow p-0.5 shadow-black' />
            </div>
          ),
        }),
      ];
    
    const tableFormAsset = useMaterialReactTable({
        columns: columnForm,
        data: selectedAssets || [],
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
                    <h2 className='text-white'>Welcome, Lease page:)</h2>
                </div>
                {showTable && (
                    <div>
                        <MaterialReactTable
                            table={tableLeaseAsset}
                        />
                        <div className='flex justify-end mt-5'>
                            <Button className='bg-gray-800' id='lanjut' onClick={showFormulirHandler} disabled={selectedAssets.length === 0}>Check Out</Button>
                        </div>
                    </div>
                )}
                {showFormulir && (
                    <div className='bg-white p-5 rounded-xl'>
                        <div className='flex items-center justify-between'>
                            <h2 className=''>The following are the details of the asset you intend to lease</h2>
                            <Button className='bg-gray-800' onClick={showTableHandler}>Back</Button>
                        </div>
                        <MaterialReactTable
                            table={tableFormAsset}
                        />
                        <div className='bg-white'>
                            <h2 className='border-t-[1px] border-black pt-4 mt-8 mb-4'>
                                To proceed with the Lease transaction, please fill out the form below:
                            </h2>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div className='space-y-4'>
                                    <div className='flex items-center space-x-2'>
                                        <label className={`w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Name</label>
                                        <Input 
                                            variant='outline' 
                                            label='Input Your Name' 
                                            type='text'
                                            value={Name}
                                            onChange={(e) => setName(e.target.value)}
                                            className='cursor-not-allowed'
                                            required
                                            disabled
                                        />
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <label className={`w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Location</label>
                                        <div className='flex items-center w-full relative'>
                                            <Menu>
                                                <MenuHandler>
                                                    <Button
                                                    ripple={false}
                                                    variant='text'
                                                    color='blue-gray'
                                                    className="border border-blue-gray-200 px-4 rounded-r-none"
                                                    >
                                                        Select
                                                    </Button>
                                                </MenuHandler>
                                                <MenuList className='max-w-[18rem]'>
                                                {LocationOptions.map((location) => (
                                                    <MenuItem key={location.id} value={location.location} onClick={() => handleOptionSelectLocation(location.location)}>
                                                        {location.location}
                                                    </MenuItem>
                                                    ))}
                                                </MenuList>
                                            </Menu>
                                            <Input 
                                                variant='outline' 
                                                label='Select Location' 
                                                className='w-full rounded-l-none'
                                                type='text'
                                                value={inputValueLocation}
                                                onChange={(e) => setInputValueLocation(e.target.value)}
                                                required
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <label className={`w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Lease Date</label>
                                        <Input 
                                            variant='outline' 
                                            label='Input Lease Date' 
                                            type='date'
                                            onChange={(e) => setCheckoutDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <label className={`w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Return Date</label>
                                        <Input 
                                            variant='outline' 
                                            label='Input Return Date' 
                                            type='date'
                                            onChange={(e) => setCheckinDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='space-y-4'>
                                    <div className='flex items-center space-x-2'>
                                        <label className={`w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Email</label>
                                        <Input 
                                            variant='outline' 
                                            label='Input Your Email' 
                                            type='email'
                                            className='cursor-not-allowed'
                                            value={Email}
                                            onChange={(e) => setEmail(e.target.value)} 
                                            required
                                            disabled 
                                        />
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <label className={`w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Note</label>
                                        <Input 
                                            variant='outline' 
                                            label='Input Note' 
                                            type='text' 
                                            onChange={(e) => setNote(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <label className={`w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Admin 1</label>
                                        <div className='flex items-center w-full relative'>
                                            <Menu>
                                                <MenuHandler>
                                                    <Button
                                                    ripple={false}
                                                    variant='text'
                                                    color='blue-gray'
                                                    className="border border-blue-gray-200 px-4 rounded-r-none"
                                                    >
                                                        Select
                                                    </Button>
                                                </MenuHandler>
                                                <MenuList className='max-w-[18rem]'>
                                                {AdminList.map((admin) => (
                                                    <MenuItem key={admin.email} value={admin.email} disabled={admin.email === selectedAdmin2} onClick={() => handleOptionSelectAdmin1(admin.username, admin.email)}>
                                                        {admin.username}
                                                    </MenuItem>
                                                    ))}
                                                </MenuList>
                                            </Menu>
                                            <Input 
                                                variant='outline' 
                                                label='Select Approver 1' 
                                                className='w-full rounded-l-none'
                                                type='text'
                                                value={inputValueAdmin1}
                                                onChange={(e) => setInputValueAdmin1(e.target.value)}
                                                required
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <label className={`w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Admin 2</label>
                                        <div className='flex items-center w-full relative'>
                                            <Menu>
                                                <MenuHandler>
                                                    <Button
                                                    ripple={false}
                                                    variant='text'
                                                    color='blue-gray'
                                                    className="border border-blue-gray-200 px-4 rounded-r-none"
                                                    >
                                                        Select
                                                    </Button>
                                                </MenuHandler>
                                                <MenuList className='max-w-[18rem]'>
                                                {AdminList.map((admin) => (
                                                    <MenuItem key={admin.email} value={admin.email} disabled={admin.email === selectedAdmin1} onClick={() => handleOptionSelectAdmin2(admin.username, admin.email)}>
                                                        {admin.username}
                                                    </MenuItem>
                                                    ))}
                                                </MenuList>
                                            </Menu>
                                            <Input 
                                                variant='outline' 
                                                label='Select Approver 2' 
                                                className='w-full rounded-l-none'
                                                type='text'
                                                value={inputValueAdmin2}
                                                onChange={(e) => setInputValueAdmin2(e.target.value)}
                                                required
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-end mt-4'>
                                <Button
                                    className='bg-gray-800'
                                    type='submit'
                                    onClick={() => handleLeaseAsset(token)}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Submitting...' : 'Submit'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
export default Lease