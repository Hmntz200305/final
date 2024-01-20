import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Button, Select, Option } from '@material-tailwind/react';
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';

const ScanAdd = () => {
  const videoRef = useRef(null);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [cameraList, setCameraList] = useState([]); // Menambah state untuk menyimpan daftar kamera
  let qrScanner;

  useEffect(() => {
    const videoElem = videoRef.current;

    qrScanner = new QrScanner(
      videoElem,
      result => {
        console.log('decoded qr code:', result);
        setScannedData(result?.data);
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

  const fakeData = [
    {
      AssetID: '1',
      AssetName: 'Laptop',
      AssetDesc: 'High-performance laptop',
      AssetBrand: 'Brand A',
      AssetModel: 'Model X',
      AssetStatus: 'Active',
      AssetLocation: 'Office 1',
      AssetCategory: 'Electronics',
      AssetSN: 'SN123456',
    },
    {
      AssetID: '2',
      AssetName: 'Printer',
      AssetDesc: 'Color printer',
      AssetBrand: 'Brand B',
      AssetModel: 'Model Y',
      AssetStatus: 'Inactive',
      AssetLocation: 'Office 2',
      AssetCategory: 'Office Equipment',
      AssetSN: 'SN789012',
    },
  ];

  return (
    <>
        <div className="p-2">
          <div className='dashboard-icon bg-gray-800 mb-5 rounded-2xl p-4 shadow'>
              <h2 className='text-white'>Welcome, Scan Lease page :)</h2>
          </div>
        </div>
        <div className='p-2'>
            <Button onClick={handleToggleScanner}>
                {isScannerActive ? 'Stop Scan' : 'Start Scan'}
            </Button>
        </div>
        <div className='p-2 flex flex-col items-center justify-center'>
            <Select variant='outlined' label='Select Camera' onChange={(value) => setFacingMode(value)}>
                <Option value={"user"}>Front Camera (User)</Option>
                <Option value={"environment"}>Back Camera (Environment)</Option>
                {cameraList.map(camera => (
                  <Option key={camera.id} value={camera.id}>{camera.label}</Option>
                ))}
            </Select>
            <video ref={videoRef} autoPlay playsInline muted></video>
        </div>
        <div className='p-2 text-center'>
            {scannedData && (
                <div>
                <p>Hasil Scan:</p>
                <p>{scannedData}</p>
                </div>
            )}
            <DataTable
              columns={Columns}
              data={fakeData}
              noHeader
              defaultSortField='no'
              defaultSortAsc={false}
              pagination
              highlightOnHover
            />
            <div className='flex justify-end'>
              <Button>Submit</Button>
            </div>
        </div>
    </>
  );
};

export default ScanAdd;
