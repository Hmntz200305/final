import React, { useState, useEffect } from "react";
import { useAuth } from '../AuthContext';
import QrReader from "react-qr-reader";
import { Button, Select, Option } from "@material-tailwind/react";
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';

const ScanCheck = () => {
  const {  openSidebar, setOpenSidebar, } = useAuth();
  const [selected, setSelected] = useState("user");
  const [startScan, setStartScan] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);
  const [data, setData] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 768;
  const [isDesktopView, setIsDesktopView] = useState(window.innerWidth > 768);


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

  const handleScan = async (scanData) => {
    setLoadingScan(true);
    console.log(`loaded data data`, scanData);
    if (scanData && scanData !== "") {
      console.log(`loaded >>>`, scanData);
      setData(scanData);
      setStartScan(false);
      setLoadingScan(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
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
            <h2 className='text-white'>Welcome, Scan Check page :)</h2>
        </div>
      </div>

      <div className="p-2 space-y-2">
          <div>
            <Button onClick={() => {setStartScan(!startScan);}}>
              {startScan ? "Stop Scan" : "Start Scan"}
            </Button>
          </div>
          {startScan && (
            <>
              <div className="flex flex-col items-center justify-center">
                <Select variant="outlined" label="Select Camera" onChange={(value) => setSelected(value)}>
                  <Option value={"environment"}>Back Camera</Option>
                  <Option value={"user"}>Front Camera</Option>
                </Select>
                {isDesktopView && (
                  <QrReader
                    facingMode={selected}
                    delay={1000}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: "500px"}}
                  />
                )}
                {!isDesktopView && (
                  <QrReader
                    facingMode={selected}
                    delay={1000}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: "100%", width: "100%" }}
                  />
                )}
                {loadingScan && 
                  <p>Detecting Data..</p>
                }
                {data !== "" && 
                  <p>{data}</p>
                }
              </div>
              <div>
                <DataTable
                  columns={Columns}
                  data={fakeData}
                  noHeader
                  defaultSortField='no'
                  defaultSortAsc={false}
                  pagination
                  highlightOnHover
                />
              </div>
            </>
          )}
        </div>
    </>
  );
};

export default ScanCheck;
