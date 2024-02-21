import React, { useEffect, useState } from 'react'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../AuthContext';
import { Input, Menu, MenuList, MenuItem, MenuHandler, Button, Card, CardHeader, Typography } from "@material-tailwind/react";
import Modal from 'react-modal';

const AddAsset = () => {
    const { token, Role, refreshAssetData, refreshStatusList, StatusOptions, refreshLocationList, LocationOptions, refreshCategoryList, CategoryOptions, setNotification, setNotificationStatus, setNotificationInfo, openSidebar, setOpenSidebar} = useAuth();
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
    const [modalStatus, setModalStatus] = useState(false);
    const [modalLocation, setModalLocation] = useState(false);
    const [modalCategory, setModalCategory] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const isMobile = windowWidth <= 768;
    const [isDesktopView, setIsDesktopView] = useState(window.innerWidth > 768);

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
          setInputValueStatus('');
          setaddAssetLocation('');
          setInputValueLocation('');
          setaddAssetCategory('');
          setInputValueCategory('');
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
      } finally {
        setModalStatus(false)
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
      } finally {
        setModalLocation(false)
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
      } finally {
        setModalCategory(false)
      }
    };

    return (
        <>
            <div className='p-2'>
                <div className='bg-gray-800 mb-8 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Welcome, Add an Asset page :)</h2>
                </div>

                <Card floated={false} shadow={false} color='transparent'>
                  <CardHeader
                      floated={false}
                      shadow={false}
                      color="transparent"
                      className="m-0 mb-4 flex flex-col gap-4 rounded-none md:flex-row md:items-center"
                  >
                      <div>
                          <Typography variant="h6" color="blue-gray">
                              Add Asset Form
                          </Typography>
                          <Typography
                              variant="small"
                              color="gray"
                              className="max-w-sm font-normal"
                          >
                              Please fill in the column below with details of the assets to be added.
                          </Typography>
                      </div>
                  </CardHeader>
                  <Card className='space-y-4 p-4'>
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
                            ripple={false}
                            className='absolute right-0 px-4 z-10 bg-gray-800'
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
                            ripple={false}
                            className='absolute top-0 right-0 px-4 z-10 bg-gray-800'
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
                            ripple={false}
                            className='absolute top-0 right-0 px-4 z-10 bg-gray-800'
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
                      <Button type="button" className='bg-gray-800' id="edit-button" onClick={() => handleAddAsset(token)} disabled={isLoading}>{isLoading ? 'Adding...' : 'Add Asset'}</Button>
                    </div>
                  </Card>
                </Card>
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
                            <p>Please input the Status to be added.</p>
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
                            <Button className="border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-200 shadow-none" onClick={closeModalStatus}>Cancel</Button>
                            <Button className="bg-gray-800 hover:bg-gray-900 shadow-none" onClick={() => handleNewStatus(token)}>Add</Button>
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
                            <p>Please input the Status to be added.</p>
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
                            <Button className="border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-200 shadow-none" onClick={closeModalStatus}>Cancel</Button>
                            <Button className="bg-gray-800 hover:bg-gray-900 shadow-none" onClick={() => handleNewStatus(token)}>Add</Button>
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
                            <p>Please input the Location to be added.</p>
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
                            <Button className="border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-200 shadow-none" onClick={closeModalLocation}>Cancel</Button>
                            <Button className="bg-gray-800 hover:bg-gray-900 shadow-none" onClick={() => handleNewLocation(token)}>Add</Button>
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
                            <p>Please input the Location to be added.</p>
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
                            <Button className="border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-200 shadow-none" onClick={closeModalLocation}>Cancel</Button>
                            <Button className="bg-gray-800 hover:bg-gray-900 shadow-none" onClick={() => handleNewLocation(token)}>Add</Button>
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
                            <p>Please input the Category to be added.</p>
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
                            <Button className="border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-200 shadow-none" onClick={closeModalCategory}>Cancel</Button>
                            <Button className="bg-gray-800 hover:bg-gray-900 shadow-none" onClick={() => handleNewCategory(token)}>Add</Button>
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
                            <p>Please input the Category to be added.</p>
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
                            <Button className="border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-200 shadow-none" onClick={closeModalCategory}>Cancel</Button>
                            <Button className="bg-gray-800 hover:bg-gray-900 shadow-none" onClick={() => handleNewCategory(token)}>Add</Button>
                        </div>
                    </div>
                </div>
              </Modal>
            )}
        </>
    )
}
export default AddAsset