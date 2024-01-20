import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Button, Select, Option, Menu, MenuList, MenuItem, MenuHandler, Input,  } from "@material-tailwind/react";
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';
import { useAuth } from '../AuthContext';

const ScanLease = () => {
  const { token, DataListAssetExcept, refreshAssetDataExcept, LocationOptions, refreshLocationList, refreshAdminList, AdminList, username, setNotification, setNotificationStatus, setNotificationInfo, openSidebar, setOpenSidebar } = useAuth();
  const videoRef = useRef(null);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scannedData, setScannedData] = useState([]);
  const [facingMode, setFacingMode] = useState('environment');
  const [cameraList, setCameraList] = useState([]);
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 768;
  const [isDesktopView, setIsDesktopView] = useState(window.innerWidth > 768);
  const [inputValueLocation, setInputValueLocation] = useState('');
  const [inputValueAdmin1, setInputValueAdmin1] = useState('');
  const [inputValueAdmin2, setInputValueAdmin2] = useState('');
  const [ShowTable, setShowTable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleResizeMobile = () => {
      setIsDesktopView(window.innerWidth > 768);
  }; 
 
  const handleResizeApp = () => {
    if (window.innerWidth <= 870) {
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
    // Mengecek apakah sudah ada data pengguna
    if (username) {
      setName(username);
    }
  }, [username]);

  useEffect(() => {
    refreshAssetDataExcept();
    refreshLocationList();
    refreshAdminList();
    // eslint-disable-next-line
  }, []);

  let qrScanner;

  useEffect(() => {
    const videoElem = videoRef.current;

    qrScanner = new QrScanner(
      videoElem,
      async (result) => {
        try {
          const parsedResult = JSON.parse(result.data);
    
          const isValidQR = (qrData) => {
            return (
              qrData &&
              qrData.AssetID &&
              qrData.AssetName &&
              qrData.AssetDesc &&
              qrData.AssetBrand &&
              qrData.AssetModel &&
              qrData.AssetStatus &&
              qrData.AssetLocation &&
              qrData.AssetCategory &&
              qrData.AssetSN
            );
          };
    
          if (isValidQR(parsedResult)) {
            setScannedData([parsedResult]);
            qrScanner.stop();
            qrScanner.destroy();
            setIsScannerActive(false);
            const dataToSend = parsedResult;
            if (dataToSend) {
              try {
                const response = await fetch("https://asset.lintasmediadanawa.com:8443/api/qrscannercheck", {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(dataToSend),
                });
                if (response.ok) {
                  const data = await response.json();
                  setNotification(data.message);
                  setNotificationStatus(true);
                  setNotificationInfo(data.Status);
                  setScannedData([data.DataAsset]);
                } else {
                  const data = await response.json();
                  setNotification(data.message);
                  setNotificationStatus(true);
                  setNotificationInfo(data.Status);
                }
              } catch (error) {
                console.error('Error handling response from API:', error);
                setNotification('Error handling response from API');
                setNotificationInfo('error');
              } 
            }
            setShowTable(true);
            setSelectedAssetsID(parsedResult.AssetID);
          } else {
            setNotification('Invalid QR Code data');
            setNotificationStatus(true);
            setNotificationInfo('error');
          }
        } catch (error) {
          setNotification('Error parsing QR Code data');
          setNotificationStatus(true);
          setNotificationInfo('error');
        }
      },
      {
        highlightScanRegion: isScannerActive,
        highlightCodeOutline: isScannerActive,
      },
    );

    let cameraSwitchPromise = Promise.resolve();

    if (isScannerActive) {
      const currentFacingMode = qrScanner._activeCamera?.cameraLabel || '';
      if (currentFacingMode.toLowerCase() !== facingMode.toLowerCase()) {
        cameraSwitchPromise = new Promise(resolve => {
          qrScanner.stop();
          setTimeout(() => {
            resolve();
          }, 500);
        });
      }

      cameraSwitchPromise.then(() => {
        qrScanner.setCamera(facingMode).then(() => {
          qrScanner.start();
        });
      });
    }

    return () => {
      qrScanner.stop();
      qrScanner.destroy();
    };
  }, [isScannerActive, facingMode]);

  useEffect(() => {
    QrScanner.listCameras().then(cameras => {
      setCameraList(cameras);
    });
  }, []);

  const handleToggleScanner = () => {
    setIsScannerActive(prevState => !prevState);
    setScannedData(null);
    setShowTable(false);
  };

  const Columns = [
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
  ];

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

      const response = await fetch("https://asset.lintasmediadanawa.com:8443/api/leaseticketscanner", {
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
        // showTableHandler();
        refreshAssetDataExcept();
        setSelectedAssets([]);
        setSelectedAssetsID([]);
        setCheckoutDate('');
        setCheckinDate('');
        setLocation('');
        setNote('');
        setShowTable(false);
      } else {
        const data = await response.json();
        setNotification(data.message);
        setNotificationStatus(true);
        setNotificationInfo(data.Status);
      
        if (data.message === 'Asset sedang tidak tersedia saat ini') {
          setShowTable(false);
        }
      }
      
    } catch (error) {
      console.error("Error:", error);
    } finally {
        setIsLoading(false); // Atur status loading menjadi false
    }
  };

  return (
    <>
        <div className="p-2">
          <div className='bg-gray-800 mb-5 rounded-2xl p-4 shadow'>
              <h2 className='text-white'>Welcome, Scan Lease page :)</h2>
          </div>
        </div>
        <div className='p-2'>
        {isScannerActive ? (
          <Button onClick={handleToggleScanner}>Stop Scan</Button>
        ) : (
          <Button onClick={handleToggleScanner}>{ShowTable ? 'Start Scan Again' : 'Start Scan'}</Button>
        )}
        </div>
        <div className={`${ShowTable ? 'hidden' : 'p-2 flex flex-col items-center justify-center'}`}>
            <Select variant='outlined' label='Select Camera' onChange={(value) => setFacingMode(value)}>
                <Option value={"user"}>Front Camera (User)</Option>
                <Option value={"environment"}>Back Camera (Environment)</Option>
                {cameraList.map(camera => (
                  <Option key={camera.id} value={camera.id}>{camera.label}</Option>
                ))}
            </Select>
            <video ref={videoRef} autoPlay playsInline muted></video>
        </div>
        {ShowTable && (
          <>
            <div>
              <div className='bg-white p-5 rounded-xl'>
                  <div className='flex items-center justify-between'>
                      <h2 className=''>Berikut ini adalah Asset yang anda pinjam :</h2>
                  </div>
                  <DataTable className='bg-[#efefef] mt-5 border-black'
                      columns={Columns}
                      data={scannedData || []}
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
                              className=''
                              type='submit'
                              onClick={() => handleLeaseAsset(token)}
                              disabled={isLoading}
                          >
                              {isLoading ? 'Submitting...' : 'Submit'}
                          </Button>
                      </div>
                  </div>
              </div>
          </div>
          </>
        )}
    </>
  );
};

export default ScanLease;
