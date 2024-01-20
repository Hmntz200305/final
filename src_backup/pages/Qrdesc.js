import React, { useState, useEffect, useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import DataTable from 'react-data-table-component';
import './qr.css'
import 'react-data-table-component-extensions/dist/index.css';
import { useAuth } from '../AuthContext';

const QRScanner = () => {
  const { setNotification, setNotificationInfo, setNotificationStatus } = useAuth();
  const [result, setResult] = useState('');
  const [tableData, setTableData] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const qrReaderRef = useRef(null);

  const handleScan = (data) => {
    if (data) {
      setResult(data);
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  const handleResult = (result) => {
    if (result === undefined) {
      return;
    }
    if (!result) {
      return;
    }

    try {
      const parsedResult = JSON.parse(result);
      console.log('Parsed result:', parsedResult);
      setTableData([parsedResult]);
    } catch (error) {
      console.error('Error parsing QR code data:', error);
    }
  };

  useEffect(() => {
    if (result && scanning) {
      try {
        const parsedResult = JSON.parse(result);
        setTableData([parsedResult]);
      } catch (error) {
        console.error('Error parsing QR code data:', error);
      }
    }
  }, [result, scanning]);

  const startScan = () => {
    setScanning(true);
  };

  const stopScan = () => {
    setScanning(false);
    if (qrReaderRef.current) {
      qrReaderRef.current.stopScan();
    }
  };
  

  const handleSubmit = async (token) => {
  const apiUrl = 'https://asset.lintasmediadanawa.com:8443/api/qrscanner';
  const dataToSend = tableData.length > 0 ? tableData[0] : null;

  if (dataToSend) {
    setSubmitting(true);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      setNotification('IDAsset Already Exist');
      setNotificationStatus(false);

      if (response.ok) {
        setNotification('Request successful');
        setNotificationStatus(true);
      } else {
        setNotification('IDAsset Already Exist');
        setNotificationStatus(false);
      }
    } catch (error) {
      setNotification('Error sending data to API');
      setNotificationStatus(false);
    } finally {
      setSubmitting(false);
    }
  }
};

  const columns = [
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
    <div>
      {scanning && (
        <QrReader
          ref={qrReaderRef}
          delay={300}
          onError={handleError}
          onScan={handleScan}
          onResult={handleResult}
          style={{ width: '50%' }}
          rearCamera
        />
      )}
      <div className='p-2'>
        <div className=''>
          <button className='main-btn' type="button" onClick={startScan} disabled={scanning}>
            Start Scan
          </button>
          <button className='main-btn mx-2' type="button" onClick={stopScan} disabled={!scanning}>
            Stop Scan
          </button>
        </div>
        {console.log('Table Data:', tableData)}
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
      <div className='mx-2'>
        <button className='main-btn' type="button" onClick={handleSubmit} disabled={submitting}>
              Submit
        </button>
       </div>
    </div>
  );
};

export default QRScanner;