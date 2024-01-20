import React, { useEffect, useState, } from 'react';
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';
import { useAuth } from '../AuthContext';
import { Input, Menu, MenuList, MenuItem, MenuHandler, Button } from "@material-tailwind/react";

const QRGen = () => {
    const { setNotification, setNotificationInfo, setNotificationStatus, refreshStatusList, refreshLocationList, refreshCategoryList, openSidebar, setOpenSidebar, StatusOptions, LocationOptions, CategoryOptions } = useAuth();
    const [AssetID, setAssetID] = useState();
    const [AssetName, setAssetName] = useState();
    const [AssetDesc, setAssetDesc] = useState();
    const [AssetBrand, setAssetBrand] = useState();
    const [AssetModel, setAssetModel] = useState();
    const [AssetStatus, setAssetStatus] = useState();
    const [AssetLocation, setAssetLocation] = useState();
    const [AssetCategory, setAssetCategory] = useState();
    const [AssetSN, setAssetSN] = useState();
    const [isLoading, setIsLoading] = useState();
    const [tableData, setTableData] = useState([]);
    const [QRCode, setQRCode] = useState();
    const [inputValueStatus, setInputValueStatus] = useState('');
    const [inputValueLocation, setInputValueLocation] = useState('');
    const [inputValueCategory, setInputValueCategory] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const isMobile = windowWidth <= 768;
    const [isDesktopView, setIsDesktopView] = useState(window.innerWidth > 768);
    
    useEffect(() => {
        refreshStatusList();
        refreshLocationList();
        refreshCategoryList();
    },[]);

    const handleGenQR = async () => {
        try {
        setIsLoading(true); 
        const formData = new FormData();

        formData.append('AssetID', AssetID);
        formData.append('AssetName', AssetName);
        formData.append('AssetDesc', AssetDesc);
        formData.append('AssetBrand', AssetBrand);
        formData.append('AssetModel', AssetModel);
        formData.append('AssetStatus', AssetStatus);
        formData.append('AssetLocation', AssetLocation);
        formData.append('AssetCategory', AssetCategory);
        formData.append('AssetSN', AssetSN);

        const response = await fetch("https://asset.lintasmediadanawa.com:8443/api/qrgenerator", {
            method: "POST",
            body: formData,
        });

        if (response.status === 200) {
            const data = await response.json();
            setQRCode(data.qr);
            setNotification(data.message);
            setNotificationStatus(true);
            setNotificationInfo(data.Status);
        } else {
            const data = await response.json();
            setNotification(data.message);
            setNotificationStatus(true);
            setNotificationInfo(data.Status);
        }
        } catch (error) {
        console.error("Error:", error);
        } finally {
        setIsLoading(false);
        }
    };

    useEffect(() => {
        const hasData = AssetID || AssetName || AssetDesc || AssetBrand || AssetModel || AssetStatus || AssetLocation || AssetCategory || AssetSN || QRCode;
    
        if (hasData) {
        setTableData([
            ...tableData,
            {
            AssetID,
            AssetName,
            AssetDesc,
            AssetBrand,
            AssetModel,
            AssetStatus,
            AssetLocation,
            AssetCategory,
            AssetSN,
            QRCode,
            },
        ]);
        setAssetID('');
        setAssetName('');
        setAssetDesc('');
        setAssetBrand('');
        setAssetModel('');
        setAssetStatus('');
        setAssetLocation('');
        setAssetCategory('');
        setAssetSN('');
        setQRCode('');
        }
    }, [QRCode]);
    

    const handleDownload = async (url, name) => {
        try {
        const image = await fetch(url);
        const imageBlob = await image.blob();
        const imageURL = URL.createObjectURL(imageBlob);

        const link = document.createElement('a');
        link.href = imageURL;
        link.download = name + '.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(imageURL);
        } catch (error) {
        console.error('Error downloading image:', error);
        }
    };

    const handleOptionSelectStatus = (option) => {
        setInputValueStatus(option); // Menetapkan nilai pada input
        setAssetStatus(option); 
    };
    const handleOptionSelectLocation = (option) => {
        setInputValueLocation(option);
        setAssetLocation(option); 
    };
    const handleOptionSelectCategory = (option) => {
        setInputValueCategory(option);
        setAssetCategory(option); 
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


    const columns = [
        {
            name: 'QR Code',
            selector: row => row['QRCode'],
            cell: (row) => (
            <div className='flex flex-col items-center justify-center'>
                <img src={row.QRCode} alt="QRCode" style={{ width: '50px', height: '50px' }} />
                <button onClick={() => handleDownload(row.QRCode, row.AssetID)} className='text-blue-300 underline'>
                    Download
                </button>
            </div>
            ),
            export: true,
        },
        {
            name: 'ID Asset',
            selector: row => row['AssetID'],
            export: true
        },
        {
            name: 'Name',
            selector: row => row['AssetName'],
            export: true
        },
        {
            name: 'Description',
            selector: row => row['AssetDesc'],
            export: true
        },
        {
            name: 'Brand',
            selector: row => row['AssetBrand'],
            export: true
        },
        {
            name: 'Model',
            selector: row => row['AssetModel'],
            export: true
        },
        {
            name: 'Status',
            selector: row => row['AssetStatus'],
            export: true
        },
        {
            name: 'Location',
            selector: row => row['AssetLocation'],
            export: true
        },
        {
            name: 'Category',
            selector: row => row['AssetCategory'],
            export: true
        },
        {
            name: 'SN',
            selector: row => row['AssetSN'],
            export: true
        },
    ]

  return (
    <>
        <div className='p-2'>
            <div className='bg-gray-800 rounded-2xl p-4 shadow'>
                <h2 className='text-white'>Welcome, QR Generator Page :)</h2>
            </div>
        </div>

        <div className='p-2'>
            <div className='bg-white rounded-2xl shadow p-4 space-y-4'>
                <div className='flex items-center gap-4'>
                    <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>ID</label>
                    <Input 
                    variant="outline"
                    label="Input Asset ID"
                    value={AssetID}
                    onChange={(e) => setAssetID(e.target.value)}
                    required
                    />
                </div>
                <div className='flex items-center gap-4'>
                    <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Name</label>
                    <Input
                    variant="outline"
                    label="Input Asset Name"
                    value={AssetName}
                    onChange={(e) => setAssetName(e.target.value)} 
                    required 
                    />
                </div>
                <div className='flex items-center gap-4'>
                    <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Description</label>
                    <Input 
                    variant="outline" 
                    label="Input Asset Description"
                    value={AssetDesc}
                    onChange={(e) => setAssetDesc(e.target.value)} 
                    required
                    />
                </div>
                <div className='flex items-center gap-4'>
                    <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Brand</label>
                    <Input 
                    variant="outline" 
                    label="Input Asset Brand" 
                    value={AssetBrand}
                    onChange={(e) => setAssetBrand(e.target.value)} 
                    required
                    />
                </div>
                <div className='flex items-center gap-4'>
                    <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Model</label>
                    <Input 
                    variant="outline" 
                    label="Input Asset Model"
                    value={AssetModel}
                    onChange={(e) => setAssetModel(e.target.value)}  
                    required
                    />
                </div>

                <div className='flex items-center gap-4'>
                    <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Status</label>
                    <div className='flex items-center w-full relative '>
                        <Menu placement="bottom-start">
                            <MenuHandler>
                            <Button
                                ripple={false}
                                variant="text"
                                color="blue-gray"
                                className="border border-blue-gray-200 px-4 rounded-r-none"
                            >
                                Select
                            </Button>
                            </MenuHandler>
                            <MenuList className="max-w-[18rem]">
                            {StatusOptions.map((status) => (
                                <MenuItem key={status.id} value={status.status} onClick={() => handleOptionSelectStatus(status.status)}>
                                {status.status}
                                </MenuItem>
                            ))}
                            </MenuList>
                        </Menu>
                        <Input 
                            className='w-full rounded-l-none'
                            type="text"
                            value={inputValueStatus}
                            onChange={(e) => setInputValueStatus(e.target.value)}
                            disabled
                            required
                            label='Input Asset Status'
                        />
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Location</label>
                    <div className='flex items-center w-full relative'>
                        <Menu placement="bottom-start">
                            <MenuHandler>
                            <Button
                                ripple={false}
                                variant="text"
                                color="blue-gray"
                                className="border border-blue-gray-200 px-4 rounded-r-none"
                            >
                                Select
                            </Button>
                            </MenuHandler>
                            <MenuList className="max-w-[18rem]">
                            {LocationOptions.map((location) => (
                                <MenuItem value={location.location} key={location.id} onClick={() => handleOptionSelectLocation(location.location)}>
                                {location.location}
                                </MenuItem>
                            ))}
                            </MenuList>
                        </Menu>
                        <Input
                            className='w-full rounded-l-none'
                            type="text"
                            value={inputValueLocation}
                            onChange={(e) => setInputValueLocation(e.target.value)}
                            disabled
                            required
                            label='Input Asset Location'
                        />
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Category</label>
                    <div className='flex items-center w-full relative'>
                        <Menu placement="bottom-start">
                            <MenuHandler>
                            <Button
                                ripple={false}
                                variant="text"
                                color="blue-gray"
                                className="border border-blue-gray-200 px-4 rounded-r-none"
                            >
                                Select
                            </Button>
                            </MenuHandler>
                            <MenuList className="max-w-[18rem]">
                            {CategoryOptions.map((category) => (
                                <MenuItem value={category.category} key={category.id} onClick={() => handleOptionSelectCategory(category.category)}>
                                {category.category}
                                </MenuItem>
                            ))}
                            </MenuList>
                        </Menu>
                        <Input
                            className='w-full rounded-l-none'
                            type="text"
                            value={inputValueCategory}
                            onChange={(e) => setInputValueCategory(e.target.value)}
                            disabled
                            required
                            label='Input Asset Category'
                        />
                    </div>
                </div>

                <div className='flex items-center gap-4'>
                    <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Serial Number</label>
                    <Input 
                    variant="outline" 
                    label="Input Asset Serial Number"
                    value={AssetSN}
                    onChange={(e) => setAssetSN(e.target.value)}  
                    required
                    />
                </div>
                <div className='flex justify-end'>
                    <Button type="button" className='' id="edit-button" onClick={handleGenQR} disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate'}</Button>
                </div>
                <div className='p-2'>
                    <div className='bg-white p-2'>
                        <DataTable
                            columns={columns}
                            data={tableData}
                            noHeader
                            defaultSortField='no'
                            defaultSortAsc={false}
                            pagination
                            highlightOnHover
                        />
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

export default QRGen;