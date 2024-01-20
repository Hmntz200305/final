import React, { useState, useEffect } from 'react';
import {QrReader} from 'react-qr-reader'
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
      <div className="flex flex-col items-center justify-center relative">
              {/* Red marker using Tailwind CSS */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-red-500"
              />
              {/* QR Code reader component */}
              <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                onResult={handleResult}
                containerStyle={{ width: '50%', height: '50%' }}
                className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-red-500'
                videoContainerStyle={{}}
                rearCamera
              />
        </div>

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
