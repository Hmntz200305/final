import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';

const QRScanner = () => {
  const [result, setResult] = useState('');
  const [tableData, setTableData] = useState([]);

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
    }
  };
  

  useEffect(() => {
    if (result) {
      try {
        const parsedResult = JSON.parse(result);
        setTableData([parsedResult]);
      } catch (error) {
        console.error('Error parsing QR code data:', error);
      }
    }
  }, [result]);

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
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        onResult={handleResult}  // Add this line
        style={{ width: '50%' }}
        rearCamera
      />
      <div className='p-2'>
        <div className='bg-white p-2'>
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
      </div>
    </div>
  );
};

export default QRScanner;
