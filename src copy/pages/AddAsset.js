import React, { useEffect, useState } from 'react'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../AuthContext';
import { Input, Menu, MenuList, MenuItem, MenuHandler, Button } from "@material-tailwind/react";
import Modal from 'react-modal';

const AddAsset = () => {
    const { token, Role, refreshAssetData, refreshStatusList, StatusOptions, refreshLocationList, LocationOptions, refreshCategoryList, CategoryOptions, setNotification, setNotificationStatus, setNotificationInfo, openSidebar, setOpenSidebar } = useAuth();
    const [newStatus, setnewStatus] = useState("");
    const [newLocation, setnewLocation] = useState("");
    const [newCategory, setnewCategory] = useState("");
    const [addAssetID, setaddAssetID] = useState("");
    const [addAssetName, setaddAssetName] = useState("");
    const [addAssetDesc, setaddAssetDesc] = useState("");
    const [addAssetBrand, setaddAssetBrand] = useState("");
    const [addAssetModel, setaddAssetModel] = useState("");
    const [addAssetStatus, setaddAssetStatus] = useState("");
    const [addAssetLocation, setaddAssetLocation] = useState("");
    const [addAssetCategory, setaddAssetCategory] = useState("");
    const [addAssetSN, setaddAssetSN] = useState("");
    const [fileInput, setFileInput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValueStatus, setInputValueStatus] = useState('');
    const [inputValueLocation, setInputValueLocation] = useState('');
    const [inputValueCategory, setInputValueCategory] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const isMobile = windowWidth <= 768;
    const [isDesktopView, setIsDesktopView] = useState(window.innerWidth > 768);
    const [modalStatus, setModalStatus] = useState(false);
    const [modalLocation, setModalLocation] = useState(false);
    const [modalCategory, setModalCategory] = useState(false);

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

    const openModalStatus = () => {
      setModalStatus(true);
    };
    const closeModalStatus = () => {
      setModalStatus(false);
    };

    const openModalLocation = () => {
      setModalLocation(true);
    };
    const closeModalLocation = () => {
      setModalLocation(false);
    };

    const openModalCategory = () => {
      setModalCategory(true);
    };
    const closeModalCategory = () => {
      setModalCategory(false);
    };

    const handleOptionSelectStatus = (option) => {
      setInputValueStatus(option);
      setaddAssetStatus(option);
    };
    const handleOptionSelectLocation = (option) => {
      setInputValueLocation(option);
      setaddAssetLocation(option);
    };
    const handleOptionSelectCategory = (option) => {
      setInputValueCategory(option);
      setaddAssetCategory(option);
    };
    

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        if (allowedExtensions.test(file.name)) {
          setFileInput(file);
        } else {
          alert('Invalid file type. Please select a valid image file.');
          e.target.value = null;
          setFileInput(null);
        }
      }
    };
    

    useEffect(() => {
        refreshStatusList();
        refreshLocationList();
        refreshCategoryList();
        // eslint-disable-next-line
      },[]);


    const handleAddAsset = async (token) => {
      try {
        setIsLoading(true);
        const formData = new FormData();

        formData.append('addAssetID', addAssetID);
        formData.append('addAssetName', addAssetName);
        formData.append('addAssetDesc', addAssetDesc);
        formData.append('addAssetBrand', addAssetBrand);
        formData.append('addAssetModel', addAssetModel);
        formData.append('addAssetStatus', addAssetStatus);
        formData.append('addAssetLocation', addAssetLocation);
        formData.append('addAssetCategory', addAssetCategory);
        formData.append('addAssetSN', addAssetSN);

        if (fileInput) {
          formData.append('addAssetImage', fileInput); 
        }

        const response = await fetch("https://asset.lintasmediadanawa.com:8443/api/addasset", {
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
          refreshAssetData();
          setaddAssetID('');
          setaddAssetName('');
          setaddAssetDesc('');
          setaddAssetBrand('');
          setaddAssetModel('');
          setaddAssetStatus('');
          setaddAssetLocation('');
          setaddAssetCategory('');
          setaddAssetSN('');
          setFileInput('');
          setFileInput(null);
        } else {
          const data = await response.json();
          setNotification(data.message);
          setNotificationStatus(true);
          setNotificationInfo(data.Status);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false); // Atur status loading menjadi false
      }
    };
      

    const handleNewStatus = async (token) => {
      try {
        const response = await fetch("https://asset.lintasmediadanawa.com:8443/api/addstatus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ newStatus }),
        });
  
        if (response.status === 200) {
          const data = await response.json();
          setNotification(data.message);
          setNotificationStatus(true);
          setNotificationInfo(data.Status);
          refreshStatusList();
          setnewStatus('');
        } else {
          const data = await response.json();
          setNotification(data.message);
          setNotificationStatus(true);
          setNotificationInfo(data.Status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const handleNewLocation = async (token) => {
      try {
        const response = await fetch("https://asset.lintasmediadanawa.com:8443/api/addlocation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ newLocation }),
        });
  
        if (response.status === 200) {
          const data = await response.json();
          setNotification(data.message);
          setNotificationStatus(true);
          setNotificationInfo(data.Status);
          refreshLocationList();
          setnewLocation('');
        } else {
          const data = await response.json();
          setNotification(data.message);
          setNotificationStatus(true);
          setNotificationInfo(data.Status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const handleNewCategory = async (token) => {
      try {
        const response = await fetch("https://asset.lintasmediadanawa.com:8443/api/addcategory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ newCategory }),
        });
  
        if (response.status === 200) {
          const data = await response.json();
          setNotification(data.message);
          setNotificationStatus(true);
          setNotificationInfo(data.Status);
          refreshCategoryList();
          setnewCategory('');
        } else {
          const data = await response.json();
          setNotification(data.message);
          setNotificationStatus(true);
          setNotificationInfo(data.Status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    return (
        <>
            <div className='p-2'>
                <div className='bg-white mb-5 rounded-2xl p-4 shadow'>
                    <h2 className=''>Welcome, Add an Asset page :)</h2>
                </div>
            </div>

            {isDesktopView && (
              <Modal
                isOpen={modalStatus}
                onRequestClose={closeModalStatus}
                contentLabel="Contoh Modal"
                overlayClassName="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                className={`modal-content bg-transparent p-4 w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
                shouldCloseOnOverlayClick={false}
              >
                <div className='p-2'>
                    <div className="flex flex-col bg-white p-2 shadow-xl rounded-2xl">
                        <div className='flex flex-col text-center mb-2'>
                            <h1 className="text-2xl font-semibold">Select Action</h1>
                            <p>Silahkan masukan Status yang ingin ditambahkan</p>
                        </div>
                        <div className='flex items-center gap-4 px-4'>
                          <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Status</label>
                          <Input 
                            variant='outline'
                            label='Input Status' 
                            value={newStatus}
                            onChange={(e) => setnewStatus(e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex justify-center space-x-4 mt-5 mb-2">
                            <button className="main-btn" onClick={closeModalStatus}>Cancel</button>
                            <button className="main-btn" onClick={() => handleNewStatus(token)}>Tambah</button>
                        </div>
                    </div>
                </div>
              </Modal>
            )}
            {!isDesktopView && (
              <Modal
                isOpen={modalStatus}
                onRequestClose={closeModalStatus}
                contentLabel="Contoh Modal"
                overlayClassName="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                className='modal-content bg-transparent p-4 w-screen'
                shouldCloseOnOverlayClick={false}
              >
                <div className='p-2'>
                    <div className="flex flex-col bg-white p-2 shadow-xl rounded-2xl">
                        <div className='flex flex-col text-center mb-2'>
                            <h1 className="text-2xl font-semibold">Select Action</h1>
                            <p>Silahkan masukan Status yang ingin ditambahkan</p>
                        </div>
                        <div className='flex items-center gap-4 px-4'>
                          <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Status</label>
                          <Input 
                            variant='outline'
                            label='Input Status' 
                            value={newStatus}
                            onChange={(e) => setnewStatus(e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex justify-center space-x-4 mt-5 mb-2">
                            <button className="main-btn" onClick={closeModalStatus}>Cancel</button>
                            <button className="main-btn" onClick={() => handleNewStatus(token)}>Tambah</button>
                        </div>
                    </div>
                </div>
              </Modal>
            )}

            {isDesktopView && (
              <Modal
                isOpen={modalLocation}
                onRequestClose={closeModalLocation}
                contentLabel="Contoh Modal"
                overlayClassName="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                className={`modal-content bg-transparent p-4 w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
                shouldCloseOnOverlayClick={false}
              >
                <div className='p-2'>
                    <div className="flex flex-col bg-white p-2 shadow-xl rounded-2xl">
                        <div className='flex flex-col text-center mb-2'>
                            <h1 className="text-2xl font-semibold">Select Action</h1>
                            <p>Silahkan masukan Lokasi yang ingin ditambahkan</p>
                        </div>
                        <div className='flex items-center gap-4 px-4'>
                            <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Location</label>
                            <Input
                              variant='outline' 
                              label='Masukan Lokasi' 
                              value={newLocation}
                              onChange={(e) => setnewLocation(e.target.value)}
                              required
                            />
                        </div>
                        <div className="flex justify-center space-x-4 mt-5 mb-2">
                            <button className="main-btn" onClick={closeModalLocation}>Cancel</button>
                            <button className="main-btn" onClick={() => handleNewLocation(token)}>Tambah</button>
                        </div>
                    </div>
                </div>
              </Modal>
            )}
            {!isDesktopView && (
              <Modal
                isOpen={modalLocation}
                onRequestClose={closeModalLocation}
                contentLabel="Contoh Modal"
                overlayClassName="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                className='modal-content bg-transparent p-4 w-screen'
                shouldCloseOnOverlayClick={false}
              >
                <div className='p-2'>
                    <div className="flex flex-col bg-white p-2 shadow-xl rounded-2xl">
                        <div className='flex flex-col text-center mb-2'>
                            <h1 className="text-2xl font-semibold">Select Action</h1>
                            <p>Silahkan masukan Lokasi yang ingin ditambahkan</p>
                        </div>
                        <div className='flex items-center gap-4 px-4'>
                            <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Location</label>
                            <Input
                              variant='outline' 
                              label='Masukan Lokasi' 
                              value={newLocation}
                              onChange={(e) => setnewLocation(e.target.value)}
                              required
                            />
                        </div>
                        <div className="flex justify-center space-x-4 mt-5 mb-2">
                            <button className="main-btn" onClick={closeModalLocation}>Cancel</button>
                            <button className="main-btn" onClick={() => handleNewLocation(token)}>Tambah</button>
                        </div>
                    </div>
                </div>
              </Modal>
            )}

            {isDesktopView && (
              <Modal
                isOpen={modalCategory}
                onRequestClose={closeModalCategory}
                contentLabel="Contoh Modal"
                overlayClassName="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                className={`modal-content bg-transparent p-4 w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
                shouldCloseOnOverlayClick={false}
              >
                <div className='p-2'>
                    <div className="flex flex-col bg-white p-2 shadow-xl rounded-2xl">
                        <div className='flex flex-col text-center mb-2'>
                            <h1 className="text-2xl font-semibold">Select Action</h1>
                            <p>Silahkan masukan Kategori yang ingin ditambahkan</p>
                        </div>
                        <div className='flex gap-4 items-center px-4'>
                        <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Category</label>
                            <Input 
                              variant='outline'
                              label='Masukan Category' 
                              value={newCategory}
                              onChange={(e) => setnewCategory(e.target.value)}
                              required
                            />
                        </div>
                        <div className="flex justify-center space-x-4 mt-5 mb-2">
                            <button className="main-btn" onClick={closeModalCategory}>Cancel</button>
                            <button className="main-btn" onClick={() => handleNewCategory(token)}>Tambah</button>
                        </div>
                    </div>
                </div>
              </Modal>
            )}
            {!isDesktopView && (
              <Modal
                isOpen={modalCategory}
                onRequestClose={closeModalCategory}
                contentLabel="Contoh Modal"
                overlayClassName="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                className='modal-content bg-transparent p-4 w-screen'
                shouldCloseOnOverlayClick={false}
              >
                <div className='p-2'>
                    <div className="flex flex-col bg-white p-2 shadow-xl rounded-2xl">
                        <div className='flex flex-col text-center mb-2'>
                            <h1 className="text-2xl font-semibold">Select Action</h1>
                            <p>Silahkan masukan Kategori yang ingin ditambahkan</p>
                        </div>
                        <div className='flex gap-4 items-center px-4'>
                        <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Category</label>
                            <Input 
                              variant='outline'
                              label='Masukan Category' 
                              value={newCategory}
                              onChange={(e) => setnewCategory(e.target.value)}
                              required
                            />
                        </div>
                        <div className="flex justify-center space-x-4 mt-5 mb-2">
                            <button className="main-btn" onClick={closeModalCategory}>Cancel</button>
                            <button className="main-btn" onClick={() => handleNewCategory(token)}>Tambah</button>
                        </div>
                    </div>
                </div>
              </Modal>
            )}

            <div className='p-2'>
              <div className='bg-white rounded-2xl shadow p-4 space-y-4'>
                <div className='flex p-4 items-baseline max-w-fit rounded-2xl'>
                  <h2 className='text-black text-2xl'>Add Asset Form
                    <span className='text-black text-sm ml-2'>Input Asset data below:</span>
                  </h2>
                </div>
                <div className='flex items-center gap-4'>
                  <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>ID</label>
                  <Input 
                    variant="outline"
                    label="Input Asset ID"
                    value={addAssetID}
                    onChange={(e) => setaddAssetID(e.target.value)}
                    required
                  />
                </div>
                <div className='flex items-center gap-4'>
                  <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Name</label>
                  <Input
                    variant="outline"
                    label="Input Asset Name"
                    value={addAssetName}
                    onChange={(e) => setaddAssetName(e.target.value)} 
                    required 
                  />
                </div>
                <div className='flex items-center gap-4'>
                  <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Description</label>
                  <Input 
                    variant="outline" 
                    label="Input Asset Description"
                    value={addAssetDesc}
                    onChange={(e) => setaddAssetDesc(e.target.value)} 
                    required
                  />
                </div>
                <div className='flex items-center gap-4'>
                  <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Brand</label>
                  <Input 
                    variant="outline" 
                    label="Input Asset Brand" 
                    value={addAssetBrand}
                    onChange={(e) => setaddAssetBrand(e.target.value)} 
                    required
                  />
                </div>
                <div className='flex items-center gap-4'>
                  <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Model</label>
                  <Input 
                    variant="outline" 
                    label="Input Asset Model"
                    value={addAssetModel}
                    onChange={(e) => setaddAssetModel(e.target.value)}  
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
                    {Role === 2 && (
                      <Button
                        color='gray'
                        ripple={false}
                        className='absolute right-0 px-4 z-10'
                        onClick={openModalStatus}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    )}
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
                    {Role === 2 && (
                      <Button
                        color='gray'
                        ripple={false}
                        className='absolute top-0 right-0 px-4 z-10'
                        onClick={openModalLocation}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    )}
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
                    {Role === 2 && (
                      <Button
                        color='gray'
                        ripple={false}
                        className='absolute top-0 right-0 px-4 z-10'
                        onClick={openModalCategory}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    )}
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Serial Number</label>
                  <Input 
                    variant="outline" 
                    label="Input Asset Serial Number"
                    value={addAssetSN}
                    onChange={(e) => setaddAssetSN(e.target.value)}  
                    required
                  />
                </div>
                <div className='flex items-center gap-4'>
                  <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Photo</label>
                  <Input type='file' accept='image/*' variant="outline" label="Input Asset Photo" name='photo' onChange={handleImageChange} />
                </div>
                <div className='flex justify-end'>
                  <button type="button" className='main-btn' id="edit-button" onClick={() => handleAddAsset(token)} disabled={isLoading}>{isLoading ? 'Adding...' : 'Add Asset'}</button>
                </div>
              </div>
            </div>   
        </>
    )
}
export default AddAsset