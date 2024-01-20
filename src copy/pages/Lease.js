import React, { useEffect, useState} from 'react'
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { useAuth } from '../AuthContext';
import { Input, Menu, MenuList, MenuItem, MenuHandler, Button } from "@material-tailwind/react";

const Lease = () => {
    const { token, DataListAssetExcept, refreshAssetDataExcept, LocationOptions, refreshLocationList, refreshAdminList, AdminList, username, setNotification, setNotificationStatus, setNotificationInfo } = useAuth();
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
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        // Mengecek apakah sudah ada data pengguna
        if (username) {
          setName(username);
        }
      }, [username]);

    const handleRowSelected = (row) => {
        // Membersihkan semua aset yang ada dari `selectedAssets`
        setSelectedAssets([]);
        setSelectedAssetsID([]);
    
        // Menambahkan aset yang baru ke dalam `selectedAssets`
        setSelectedAssets([row]);
        setSelectedAssetsID([row.no]);  
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
            setIsLoading(false); // Atur status loading menjadi false
        }
      };
    

    const handleRowDeselected = (row) => {
      setSelectedAssets(selectedAssets.filter((asset) => asset.id !== row.id));
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



    const columns = [
        {
            name: 'No',
            selector: row => row['no'],
            sortable: true,
            export: true
            },
            {
            name: 'ID Asset',
            selector: row => row['id'],
            export: true
            },
            {
            name: 'Name',
            selector: row => row['name'],
            export: true
            },
            {
            name: 'Description',
            selector: row => row['description'],
            export: true
            },
            {
            name: 'Brand',
            selector: row => row['brand'],
            export: true
            },
            {
            name: 'Model',
            selector: row => row['model'],
            export: true
            },
            {
            name: 'Status',
            selector: row => row['status'],
            export: true
            },
            {
            name: 'Location',
            selector: row => row['location'],
            export: true
            },
            {
            name: 'Category',
            selector: row => row['category'],
            export: true
            },
            {
            name: 'SN',
            selector: row => row['sn'],
            export: true
            },
            {
            name: 'Photo',
            cell: (row) => (
                <div>
                  <img src={row.image_path} alt="Asset" className='rounded-lg shadow p-0.5 shadow-black' />
                </div>
              ),
            export: true
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
                        if (selectedAssets.some((asset) => asset.id === row.id)) {
                            handleRowDeselected(row);
                        } else {
                            handleRowSelected(row);
                        }
                    }}
                    />
                </div>
            ),
            allowOverflow: true,
            button: true,
            width: '100px',
            omit: showFormulir,
            },
    ]

    return (
        <>
            <div className='p-2'>
                <div className='bg-black mb-5 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Selamat datang di Lease page :)</h2>
                </div>
            </div>

            {showTable && (
            <div className='p-2'>
                <div className='bg-white p-2'>
                    <DataTableExtensions
                    columns={columns}
                    data={DataListAssetExcept}
                    filter
                    print={false}
                    export={false}
                    filterPlaceholder='Filter Data'
                    >
                    <DataTable
                        noHeader
                        defaultSortField='no'
                        defaultSortAsc={false}
                        pagination
                        highlightOnHover
                        onRowSelected={handleRowSelected}
                        onRowDeselected={handleRowDeselected}
                    />
                    </DataTableExtensions>
                    <div className='flex justify-end mt-5'>
                        <button className='main-btn' id='lanjut' onClick={showFormulirHandler} disabled={selectedAssets.length === 0}>Check Out</button>
                    </div>
                </div>
            </div>
            )}

            {showFormulir && (
            <div className='p-2' id='formulir'>
                <div className='bg-white p-5 rounded-xl'>
                    <div className='flex items-center justify-between'>
                        <h2 className=''>Berikut ini adalah Asset yang anda pinjam</h2>
                        <button className='main-btn' onClick={showTableHandler}>Back</button>
                    </div>
                    <DataTable className='bg-[#efefef] mt-5 border-black'
                        columns={columns}
                        data={selectedAssets}
                    />

                    <div className='bg-white'>
                        <h2 className='border-t-[1px] border-black pt-4 mt-8'>
                            Untuk melanjutkan tranasaksi peminjaman, silahkan isi formulir dibawah ini:
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
                                            label='Select Admin 1' 
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
                                            label='Select Admin 2' 
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
                            <button
                                className='main-btn'
                                type='submit'
                                onClick={() => handleLeaseAsset(token)}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>


                </div>
            </div>
            )}
            

        </>
    )
}
export default Lease