import React, { useEffect, useState, } from 'react';
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';
import { useAuth } from '../AuthContext';

const Qrgen = () => {
  const { setNotification, setNotificationInfo, setNotificationStatus } = useAuth();
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
    // Check if any of the form fields is not empty
    const hasData = AssetID || AssetName || AssetDesc || AssetBrand || AssetModel || AssetStatus || AssetLocation || AssetCategory || AssetSN || QRCode;
  
    // If at least one field is not empty, update the tableData and clear the form fields
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

      // Revoke the object URL to free up resources
      URL.revokeObjectURL(imageURL);
    } catch (error) {
      console.error('Error downloading image:', error);
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
        {
        name: 'img',
        selector: row => row['QRCode'],
        cell: (row) => (
          <div>
            <img src={row.QRCode} alt="QRCode" style={{ width: '50px', height: '50px' }} />
            <button type="button" onClick={() => handleDownload(row.QRCode, row.AssetID)}>
              Download
            </button>
        </div>
        ),
        export: true,
      },

    ]

  return (
    <>
    
    <div className="p-2">
        <div className="mx-auto my-4 p-6 bg-white rounded-md shadow-md">
          <form className="p-2">
            <div className="mb-2">
              <label htmlFor="AssetID" className="block text-gray-600 font-semibold mb-2">
                ID
              </label>
              <input
                type="text"
                id="AssetID"
                name="AssetID"
                value={AssetID}
                onChange={(e) => setAssetID(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="AssetName" className="block text-gray-600 font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                id="AssetName"
                name="AssetName"
                value={AssetName}
                onChange={(e) => setAssetName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="AssetDesc" className="block text-gray-600 font-semibold mb-2">
                Desc
              </label>
              <input
                type="text"
                id="AssetDesc"
                name="AssetDesc"
                value={AssetDesc}
                onChange={(e) => setAssetDesc(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="AssetBrand" className="block text-gray-600 font-semibold mb-2">
                Brand
              </label>
              <input
                type="text"
                id="AssetBrand"
                name="AssetBrand"
                value={AssetBrand}
                onChange={(e) => setAssetBrand(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="MODEL" className="block text-gray-600 font-semibold mb-2">
                Model
              </label>
              <input
                type="text"
                id="AssetModel"
                name="AssetModel"
                value={AssetModel}
                onChange={(e) => setAssetModel(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="STATUS" className="block text-gray-600 font-semibold mb-2">
                Status
              </label>
              <input
                type="text"
                id="AssetStatus"
                name="AssetStatus"
                value={AssetStatus}
                onChange={(e) => setAssetStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="LOCATION" className="block text-gray-600 font-semibold mb-2">
                Location
              </label>
              <input
                type="text"
                id="AssetLocation"
                name="AssetLocation"
                value={AssetLocation}
                onChange={(e) => setAssetLocation(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="CATEGORY" className="block text-gray-600 font-semibold mb-2">
                Category
              </label>
              <input
                type="text"
                id="AssetCategory"
                name="AssetCategory"
                value={AssetCategory}
                onChange={(e) => setAssetCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            

            <div className="mb-6">
              <label htmlFor="SN" className="block text-gray-600 font-semibold mb-2">
                SN
              </label>
              <input
                type="text"
                id="AssetSN"
                name="AssetSN"
                value={AssetSN}
                onChange={(e) => setAssetSN(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <button 
              type="button" 
              className='main-btn' 
              id="edit-button" 
              onClick={handleGenQR} 
              disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Asset'}
            </button>
          </form>
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
    </>
  );
};

export default Qrgen;