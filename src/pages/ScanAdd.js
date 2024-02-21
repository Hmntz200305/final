import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Button, Select, Option } from '@material-tailwind/react';
import { MaterialReactTable, useMaterialReactTable, createMRTColumnHelper } from 'material-react-table';
import 'react-data-table-component-extensions/dist/index.css';
import { useAuth } from '../AuthContext';

const ScanAdd = () => {
  const { setNotification, setNotificationStatus, setNotificationInfo } = useAuth();
  const videoRef = useRef(null);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scannedData, setScannedData] = useState([]);
  const [facingMode, setFacingMode] = useState('environment');
  const [cameraList, setCameraList] = useState([]); // Menambah state untuk menyimpan daftar kamera
  const [submitting, setSubmitting] = useState(false);
  const [ShowTable, setShowTable] = useState(false);
  let qrScanner;

  useEffect(() => {
    const videoElem = videoRef.current;

    qrScanner = new QrScanner(
      videoElem,
      result => {
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

  const handleSubmit = async () => {
    const apiUrl = 'https://asset.lintasmediadanawa.com:8443/api/qrscanner';
    const dataToSend = scannedData.length > 0 ? scannedData[0] : null;
  
    if (dataToSend) {
      setSubmitting(true);
  
      try {
        const response = await fetch(apiUrl, {
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
        } else {
          const data = await response.json();
          setNotification(data.message);
          setNotificationStatus(true);
          setNotificationInfo(data.Status);
        }
      } catch (error) {
        setNotification('Error sending data to API');
        setNotificationInfo("error");
        setNotificationStatus(false);
      } finally {
        setSubmitting(false);
      }
    }
  };

    const columnHelper = createMRTColumnHelper();
    const columns = [
        columnHelper.accessor('AssetID', {
            header: 'ID Asset',
            size: 150,
        }),
        columnHelper.accessor('AssetName', {
            header: 'Name',
            size: 150,
        }),
        columnHelper.accessor('AssetDesc', {
            header: 'Description',
            size: 250,
        }),
        columnHelper.accessor('AssetBrand', {
            header: 'Brand',
            size: 150,
        }),
        columnHelper.accessor('AssetModel', {
            header: 'Model',
            size: 150,
        }),
        columnHelper.accessor('AssetStatus', {
            header: 'Status',
            size: 150,
        }),
        columnHelper.accessor('AssetLocation', {
            header: 'Location',
            size: 150,
        }),
        columnHelper.accessor('AssetCategory', {
            header: 'Category',
            size: 150,
        }),
        columnHelper.accessor('AssetSN', {
            header: 'Serial Number',
            size: 150,
        }),
        ];

        const tableScan = useMaterialReactTable({
            columns,
            data: scannedData || [],
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

  return (
    <>
        <div className="p-2">
          <div className='bg-gray-800 mb-5 rounded-2xl p-4 shadow'>
              <h2 className='text-white'>Welcome, Scan Add page :)</h2>
          </div>
        </div>
        <div className='p-2'>
        {isScannerActive ? (
          <Button className='bg-gray-800' onClick={handleToggleScanner}>Stop Scan</Button>
        ) : (
          <Button className='bg-gray-800' onClick={handleToggleScanner}>{ShowTable ? 'Start Scan Again' : 'Start Scan'}</Button>
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
        <div className='p-2 text-center'>
            {/* {scannedData && (
                <div>
                <p>Hasil Scan:</p>
                <p>{scannedData}</p>
                </div>
            )} */}
            {ShowTable && (
              <>
                <MaterialReactTable
                    table={tableScan}
                />
                <div className='flex justify-end mt-2'>
                  <Button className='bg-gray-800' onClick={handleSubmit} disabled={submitting}>
                    Submit
                  </Button>
                </div>
              </>
            )}              
        </div>
    </>
  );
};

export default ScanAdd;
