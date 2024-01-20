import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Button, Select, Option } from '@material-tailwind/react';
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';
import { useAuth } from '../AuthContext';

const ScanCheck = () => {
  const { setNotification, setNotificationStatus, setNotificationInfo } = useAuth();
  const videoRef = useRef(null);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scannedData, setScannedData] = useState([]);
  const [facingMode, setFacingMode] = useState('environment');
  const [cameraList, setCameraList] = useState([]); // Menambah state untuk menyimpan daftar kamera
  const [ShowTable, setShowTable] = useState(false);
  const [APIScannedData, setAPIScannedData] = useState([]);
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
            setShowTable(true);
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
                  setAPIScannedData([data.DataAsset]);
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

  return (
    <>
        <div className="p-2">
          <div className='bg-gray-800 mb-5 rounded-2xl p-4 shadow'>
              <h2 className='text-white'>Welcome, Scan Check page :)</h2>
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
            <div className='text-center'>
              <DataTable
                columns={Columns}
                data={APIScannedData || []}
                noHeader
                defaultSortField='no'
                defaultSortAsc={false}
                pagination
                highlightOnHover
              />
          </div>
          </>
        )}
    </>
  );
};

export default ScanCheck;
