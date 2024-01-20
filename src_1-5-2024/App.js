import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCameraRetro, faChalkboard,faComputer,faChevronDown,faAnglesLeft, faUserGear,faBook, faUserPlus, faList,faPlus,faPaperPlane,faClockRotateLeft,faHandHolding,faRotateLeft, faThumbsUp, faThumbsDown,  faEnvelope, faUserShield, faUsers, faCamera, faCirclePlus, faBarcode, faTriangleExclamation, faQrcode} from '@fortawesome/free-solid-svg-icons';
import { faComments, faFileLines } from '@fortawesome/free-regular-svg-icons';
import lmd from './resources/img/logo.png';
import profileSA from './resources/profile/superadmin.svg';
import profileAD from './resources/profile/admin.svg'
import profileUS from './resources/profile/user.svg'
import profileGU from './resources/profile/guest.svg'
import Dashboard from './pages/Dashboard';
import ListAsset from './pages/ListAsset';
import AddAsset from './pages/AddAsset';
import Return from './pages/Return';
import Lease from './pages/Lease';
import Submitted from './pages/Submitted';
import History from './pages/History';
import AddUser from './pages/AddUser';
import ListUser from './pages/ListUser';
import Login from './Login';
import Notfound from './pages/Notfound';
import MyReport from './pages/MyReport';
import QRGen from './pages/QRGen';
import Offline from './pages/Offline';
import Verify from './pages/Verify';
import ScanAdd from './pages/ScanAdd';
import ScanLease from './pages/ScanLease';
import ScanCheck from './pages/ScanCheck';
import { AuthProvider, useAuth } from './AuthContext';
import { Bounce,  ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, Typography, List, ListItem, ListItemPrefix, ListItemSuffix, Chip, Accordion, AccordionHeader, AccordionBody, Drawer, Avatar, Popover, PopoverContent,PopoverHandler, Button
} from "@material-tailwind/react";

const Home = () =>  {
  const { loggedIn, logout, username, Role, Roles, email, Notification, setNotification, setNotificationStatus, NotificationStatus, NotificationInfo, setNotificationInfo, openSidebar, setOpenSidebar,  } = useAuth();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(0);
  const [isDesktopView, setIsDesktopView] = useState(window.innerWidth > 768);
  const [rotateButton, setRotateButton] = useState(false);
  const [popoverProfile, setPopoverProfile] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);
  const [iconComponent, setIconComponent] = useState(null);
 
  const popoverProfileHandler = {
    onMouseEnter: () => setPopoverProfile(true),
    onMouseLeave: () => setPopoverProfile(false),
  };
  const handleOpenSidebar = () => {
    setOpenSidebar((prev) => !prev);
    setRotateButton(!rotateButton);
  };
 
  const handleOpenDrawer = () => {
    setOpenDrawer((prev) => !prev);
    setRotateButton(!rotateButton);
  };

  const handleOpenSubmenu = (value) => {
    setOpenSubmenu(openSubmenu === value ? 0 : value);
  };

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


  useEffect(() => {
    const clearNotification = () => {
      setNotificationStatus(false);
      setNotification('');
      setNotificationInfo('');
      setActiveNotification(null);
      setIconComponent(null); // Clear iconComponent content
    };


    if (NotificationStatus) {
      let toastConfig = {};
      let iconComponent = null;

      if (NotificationInfo === 'success') {
        iconComponent = (
          <div className='bg-green-500 p-2 rounded-xl flex items-center w-8 h-8 '>
            <FontAwesomeIcon icon={faThumbsUp} />
          </div>
        );
      } else if (NotificationInfo === 'error') {
        iconComponent = (
          <div className='bg-red-500 p-2 rounded-xl flex items-center w-8 h-8 '>
            <FontAwesomeIcon icon={faThumbsDown} />
          </div>
        );
      } else if (NotificationInfo === 'warning') {
        iconComponent = (
          <div className='bg-yellow-700 p-2 rounded-xl flex items-center w-8 h-8'>
            <FontAwesomeIcon icon={faTriangleExclamation} />
          </div>
        );
      }

      if (activeNotification !== NotificationInfo) {
        toastConfig = {
          icon: iconComponent,
          // other toast configurations
        };

        setActiveNotification(NotificationInfo);
        toast[NotificationInfo](<p className='ml-3'>{Notification}</p>, toastConfig);

        setTimeout(clearNotification, 3000);
      }
    }


    setNotificationStatus(false);
    setNotification('');
    setNotificationInfo('');
  }, [NotificationStatus, NotificationInfo, Notification, activeNotification]);

  const getProfileImage = (Role) => {
    if (Role === 2) {
      return profileSA;
    } else if (Role === 1) {
      return profileAD;
    } else if (Role === 0) {
      return profileUS;
    } else {
      return profileGU;
    }
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  useEffect(() => {
      const dashboardIcons = document.querySelectorAll('.bg-icon');
      dashboardIcons.forEach((icon) => {
          icon.style.backgroundColor = getRandomColor();
      });
  }, []);

  return (
    <Router>
      {/* NAVBAR */}
      {loggedIn ? (
        <div className={`flex fixed z-[9998] text-white items-center w-full justify-between bg-gray-800 h-[60px] px-7 border-b ${openDrawer ? 'border-[#606060]' : 'border-[#efefef]'}`}>
          <div className='flex justify-between items-center'>
            <Link to='https://sipanda.online:2096'>
              <div className='logo'>
                <img src={lmd} alt='logohe' className='w-[150px] h-auto flex m-auto items-center' />
              </div>
            </Link>
          </div>

          <div className='flex items-center'>
            {/* Profile */}
            {loggedIn ? (
              <div className='flex items-center cursor-default'>
                <Popover 
                  open={popoverProfile} 
                  handler={setPopoverProfile}
                >
                  <PopoverHandler {... popoverProfileHandler}>
                    <div className='flex items-center cursor-default bg-icon rounded-full'>
                      <Avatar src={getProfileImage(Role)} alt='profile' className='object-contain brightness-0 invert' withBorder={true} color='white' size='sm' />
                    </div>
                  </PopoverHandler>
                    <div className={`font-semibold ml-1.5 overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[60px] ${isDesktopView ? '' : 'hidden'}`}>
                      {username}
                    </div>
                  <PopoverContent {... popoverProfileHandler} className='border-none z-[9998] bg-transparent shadow-none'>
                    <div className="flex flex-col opacity-90 justify-center shadow-md p-4 rounded-xl bg-gray-900 w-[250px]">
                      <Avatar src={getProfileImage(Role)} alt='profile' className="object-contain brightness-0 invert mx-auto" size='lg' />
                      <div className="space-y-2 text-center divide-y divide-gray-700">
                        <div className="my-1 space-y-1 break-all">
                          <h2 className=" font-semibold text-sm break-all">{username}</h2>
                        </div>
                        <div className="flex justify-center item-center content-center text-gray-400 pt-1 align-center">
                          <div className='tex-gray-400 text-xs pr-2'>
                            <FontAwesomeIcon icon={faEnvelope} />
                            <h3 className='text-xs'>{email}</h3>
                          </div>
                          <div className='text-gray-400 text-xs pl-2'>
                            <FontAwesomeIcon icon={faUserShield} />
                            <h3 className='text-xs'>{Roles}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div className='flex items-center cursor-default'>
                <Popover 
                  open={popoverProfile} 
                  handler={setPopoverProfile}
                >
                  <PopoverHandler {... popoverProfileHandler}>
                    <Avatar src={getProfileImage(Role)} alt='profile' className='object-contain brightness-0 invert' withBorder={true} color='white' size='sm' />
                  </PopoverHandler>
                    <div className={`font-semibold ml-1.5 overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[60px] ${isDesktopView ? '' : 'hidden'}`}>
                      {username}
                    </div>
                  <PopoverContent {... popoverProfileHandler} className='border-none z-[9998] bg-transparent shadow-none'>
                    <div className="flex flex-col opacity-90 justify-center shadow-md p-4 rounded-xl bg-gray-900 w-[250px]">
                      <Avatar src={getProfileImage(Role)} alt='profile' className="object-contain brightness-0 invert mx-auto" size='lg' />
                      <div className="space-y-2 text-center divide-y divide-gray-700">
                        <div className="my-1 space-y-1 break-all">
                          <h2 className=" font-semibold text-sm break-all">Guest</h2>
                        </div>
                        <div className="flex justify-center item-center content-center text-gray-400 pt-1 align-center">
                          <div className='tex-gray-400 text-xs pr-2'>
                            <FontAwesomeIcon icon={faEnvelope} />
                            <h3 className='text-xs'>-</h3>
                          </div>
                          <div className='text-gray-400 text-xs pl-2'>
                            <FontAwesomeIcon icon={faUserShield} />
                            <h3 className='text-xs'>-</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}

          <div>
          {isDesktopView && (
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
              />
            )}
            {!isDesktopView && (
                <ToastContainer
                  position="top-left"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="dark"
                  transition={Bounce}
                  style={{width: '250px'}}
              />
            )}
          </div>
        </div>
      </div>
      ) : null }

      {/* CONTAINER */}
      {loggedIn ? (
      <div className='flex'>
        {isDesktopView && (
          <Card 
            className={`h-screen text-white z-[9999] fixed mt-[60px] w-full bg-gray-800 rounded-none max-w-[296px] ${openSidebar ? 'sidebar-opened' : 'sidebar-closed'}`} 
            id='sidebar' 
            style={{left: openSidebar ? '0' : '-296px', 
                    transition: 'left 0.5s ease-in-out',
                  }}
          >
            <div className="mb-8 p-8">
              <Typography variant="h5" className='uppercase text-center font-semibold text-2xl' color="white">
                asset<br />management
              </Typography>
                <div className="relative">
                  <button 
                    onClick={handleOpenSidebar} 
                    className="absolute bottom-10 -right-14 w-10 h-8 bg-gray-800 border-[#efefef] border-2 rounded-full text-[#efefef]" 
                  >
                    <FontAwesomeIcon
                      icon={faAnglesLeft} 
                      size='xs' 
                      style={{transform: openSidebar ? 'rotate(0deg)' : 'rotate(180deg)', 
                              transition: 'transform 0.8s ease', 
                            }}
                    />
                  </button>
                </div>
            </div>
            <List className='px-6'>
              {/* DASHBOARD */}
              <Link to='/'>
                <ListItem className='px-4 text-white hover:bg-[#323b49] hover:text-white focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                  <ListItemPrefix className='mr-3 w-6 h-6'>
                    <FontAwesomeIcon icon={faChalkboard}/>
                  </ListItemPrefix>
                  <Typography>
                    Dashboard
                  </Typography>
                </ListItem>
              </Link>
              {/* ASSET */}
              <Accordion
                open={openSubmenu === 1}
                icon={
                  <FontAwesomeIcon icon={faChevronDown} size=''
                    className={`mx-auto items-center flex h-3 w-4 transition-transform ${openSubmenu === 1 ? "rotate-180" : ""}`}
                  />
                }
              >
                <ListItem className="p-0 px-1 hover:bg-[#323b49] active:bg-gray-600 focus:bg-gray-800 bg-gray-800" selected={openSubmenu === 1}>
                  <AccordionHeader onClick={() => handleOpenSubmenu(1)} className="border-b-0 p-3 bg-none text-white hover:text-white">
                    <ListItemPrefix className='mr-3 w-6 h-6'>
                      <FontAwesomeIcon icon={faComputer} size='sm' />
                    </ListItemPrefix>
                    <Typography color="white" className="mr-auto font-normal">
                      Assets
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="p-0 bg-gray-600">
                  <List className="p-0 gap-0">
                    <Link to='/listasset'>
                      <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                        <ListItemPrefix className='mr-3 w-6 h-6'>
                          <FontAwesomeIcon icon={faList} />
                        </ListItemPrefix>
                        List of Asset
                      </ListItem>
                    </Link>
                    {Role === 2 || Role === 1 ? (
                      <Link to='/addasset'>
                        <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                          <ListItemPrefix className='mr-3 w-6 h-6'>
                            <FontAwesomeIcon icon={faPlus} />
                          </ListItemPrefix>
                          Add an Asset
                        </ListItem>
                      </Link>
                    ) : null}
                    {loggedIn ? (
                      <Link to='/lease'>
                        <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                          <ListItemPrefix className='mr-3 w-6 h-6'>
                            <FontAwesomeIcon icon={faHandHolding} />
                          </ListItemPrefix>
                          Lease
                        </ListItem>
                      </Link>
                    ) : null}
                    {loggedIn ? (
                      <Link to='/return'>
                        <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                          <ListItemPrefix className='mr-3 w-6 h-6'>
                            <FontAwesomeIcon icon={faRotateLeft} />
                          </ListItemPrefix>
                          Return
                        </ListItem>
                      </Link>
                    ) : null}
                    {Role === 2 || Role === 1 ? (
                      <Link to='/submitted'>
                        <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                          <ListItemPrefix className='mr-3 w-6 h-6'>
                            <FontAwesomeIcon icon={faPaperPlane} />
                          </ListItemPrefix>
                          Submitted
                        </ListItem>
                      </Link>
                    ) : null}
                    {Role === 2 || Role === 1 ? (
                      <Link to='/qrgen'>
                        <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                          <ListItemPrefix className='mr-3 w-6 h-6'>
                            <FontAwesomeIcon icon={faQrcode} />
                          </ListItemPrefix>
                          QR Generator
                        </ListItem>
                      </Link>
                    ) : null}
                  </List>
                </AccordionBody>
              </Accordion>
              {/* SCAN */}
              <Accordion
                open={openSubmenu === 2}
                icon={
                  <FontAwesomeIcon icon={faChevronDown} size=''
                    className={`mx-auto items-center flex h-3 w-4 transition-transform ${openSubmenu === 2 ? "rotate-180" : ""}`}
                  />
                }
              >
                <ListItem className="p-0 px-1 hover:bg-[#323b49] active:bg-gray-600 focus:bg-gray-800 bg-gray-800" selected={openSubmenu === 2}>
                  <AccordionHeader onClick={() => handleOpenSubmenu(2)} className="border-b-0 p-3 bg-none text-white hover:text-white">
                    <ListItemPrefix className='mr-3 w-6 h-6'>
                      <FontAwesomeIcon icon={faCameraRetro} size='sm' />
                    </ListItemPrefix>
                    <Typography color="white" className="mr-auto font-normal">
                      Scan
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="p-0 bg-gray-600">
                  <List className="p-0 gap-0">
                    {Role === 2 || Role === 1 ? (
                      <Link to='/scanadd'>
                        <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                          <ListItemPrefix className='mr-3 w-6 h-6'>
                            <FontAwesomeIcon icon={faCirclePlus}/>
                          </ListItemPrefix>
                          Scan Add
                        </ListItem>
                      </Link>
                    ) : null}
                    <Link to='/scanlease'>
                      <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                        <ListItemPrefix className='mr-3 w-6 h-6'>
                          <FontAwesomeIcon icon={faBarcode} />
                        </ListItemPrefix>
                        Scan Lease
                      </ListItem>
                    </Link>
                    <Link to='/scancheck'>
                      <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                        <ListItemPrefix className='mr-3 w-6 h-6'>
                          <FontAwesomeIcon icon={faCamera} />
                        </ListItemPrefix>
                        Scan Check
                      </ListItem>
                    </Link>
                  </List>
                </AccordionBody>
              </Accordion>
              {/* REPORT */}
              <Accordion
                open={openSubmenu === 3}
                icon={
                  <FontAwesomeIcon icon={faChevronDown} size=''
                    className={`mx-auto items-center flex h-3 w-4 transition-transform ${openSubmenu === 3 ? "rotate-180" : ""}`}
                  />
                }
              >
                <ListItem className="p-0 px-1 hover:bg-[#323b49] active:bg-gray-600 focus:bg-gray-800 bg-gray-800" selected={openSubmenu === 3}>
                  <AccordionHeader onClick={() => handleOpenSubmenu(3)} className="border-b-0 p-3 bg-none text-white hover:text-white">
                    <ListItemPrefix className='mr-3 w-6 h-6'>
                      <FontAwesomeIcon icon={faBook} size='sm' />
                    </ListItemPrefix>
                    <Typography color="white" className="mr-auto font-normal">
                      Reports
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="p-0 bg-gray-600">
                  <List className="p-0 gap-0">
                    {Role === 2 || Role === 1 ? (
                      <Link to='/history'>
                        <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                          <ListItemPrefix className='mr-3 w-6 h-6'>
                            <FontAwesomeIcon icon={faClockRotateLeft}/>
                          </ListItemPrefix>
                          History
                        </ListItem>
                      </Link>
                    ) : null}
                    <Link to='myreport'>
                      <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                        <ListItemPrefix className='mr-3 w-6 h-6'>
                          <FontAwesomeIcon icon={faFileLines} />
                        </ListItemPrefix>
                        My Report
                      </ListItem>
                    </Link>
                  </List>
                </AccordionBody>
              </Accordion>
              {/* MANAGE USER */}
              <Accordion
                open={openSubmenu === 4}
                icon={
                  <FontAwesomeIcon icon={faChevronDown}
                    className={`mx-auto items-center flex h-3 w-4 transition-transform ${openSubmenu === 4 ? "rotate-180" : ""}`}
                  />
                }
              >
                <ListItem className="p-0 px-1 hover:bg-[#323b49] active:bg-gray-600 focus:bg-gray-800 bg-gray-800" selected={openSubmenu === 4}>
                  <AccordionHeader onClick={() => handleOpenSubmenu(4)} className="border-b-0 p-3 bg-none text-white hover:text-white">
                    <ListItemPrefix className='mr-3 w-6 h-6'>
                      <FontAwesomeIcon icon={faUserGear} size='sm' />
                    </ListItemPrefix>
                    <Typography color="white" className="mr-auto font-normal">
                      Manage User
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="p-0 bg-gray-600">
                  <List className="p-0 gap-0">
                    {Role === 2 || Role === 1 ? (
                      <Link to='/listuser'>
                        <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                          <ListItemPrefix className='mr-3 w-6 h-6'>
                            <FontAwesomeIcon icon={faUsers}/>
                          </ListItemPrefix>
                          List of User
                        </ListItem>
                      </Link>
                    ) : null}
                    <Link to='/adduser'>
                      <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                        <ListItemPrefix className='mr-3 w-6 h-6'>
                          <FontAwesomeIcon icon={faUserPlus} />
                        </ListItemPrefix>
                        Add an User
                      </ListItem>
                    </Link>
                  </List>
                </AccordionBody>
              </Accordion>
              {loggedIn && (
                <Link to='/Login'>
                  <ListItem onClick={logout} className=' py-2 mt-4 flex justify-center items-center text-sm text-white bg-gray-600 hover:text-white hover:bg-[#323b49] focus:text-white focus:bg-gray-600 active:bg-gray-600 active:text-white'>
                      Log Out
                  </ListItem>
                </Link>
              )}
            </List>
          </Card>
          )}

          {/* DRAWER */}
          {!isDesktopView && (
          <Drawer 
          open={openDrawer} 
          className='mt-[60px] z-[9999] w-full bg-gray-800' 
          onClose={handleOpenDrawer}
          overlayProps={{
            className:'z-[9998] fixed mt-[60px]'
          }}
        >
            <div className="mb-8 p-8">
              <Typography variant="h5" className='uppercase text-center font-semibold text-2xl' color="white">
                asset<br />management
              </Typography>
              <div className="relative">
                  <button 
                    onClick={handleOpenDrawer} 
                    className={`absolute bottom-10 -right-14 bg-gray-800 border-2 rounded-full w-10 h-8 text-white ${openDrawer ? 'border-[#606060]' : 'border-[#efefef]'}`}
                  >
                    <FontAwesomeIcon 
                      icon={faAnglesLeft}
                      size='xs'
                      style={{transform: openDrawer ? 'rotate(0deg)' : 'rotate(180deg)', 
                              transition: 'transform 0.8s ease', 
                            }}
                    />
                  </button>
              </div>
            </div>
            <List className='px-6 overflow-y-auto'>
              {/* DASHBOARD */}
              <Link to='/'>
                <ListItem className='px-4 text-white hover:bg-[#323b49] hover:text-white focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                  <ListItemPrefix className='mr-3 w-6 h-6'>
                    <FontAwesomeIcon icon={faChalkboard}/>
                  </ListItemPrefix>
                  <Typography>
                    Dashboard
                  </Typography>
                </ListItem>
              </Link>
              {/* ASSET */}
              <Accordion
                open={openSubmenu === 1}
                icon={
                  <FontAwesomeIcon icon={faChevronDown} size=''
                    className={`mx-auto items-center flex h-3 w-4 transition-transform ${openSubmenu === 1 ? "rotate-180" : ""}`}
                  />
                }
              >
                <ListItem className="p-0 px-1 hover:bg-[#323b49] active:bg-gray-600 focus:bg-gray-800 bg-gray-800" selected={openSubmenu === 1}>
                  <AccordionHeader onClick={() => handleOpenSubmenu(1)} className="border-b-0 p-3 bg-none text-white hover:text-white">
                    <ListItemPrefix className='mr-3 w-6 h-6'>
                      <FontAwesomeIcon icon={faComputer} size='sm' />
                    </ListItemPrefix>
                    <Typography color="white" className="mr-auto font-normal">
                      Assets
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="p-0 bg-gray-600">
                  <List className="p-0 gap-0">
                    <Link to='/listasset'>
                      <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                        <ListItemPrefix className='mr-3 w-6 h-6'>
                          <FontAwesomeIcon icon={faList} />
                        </ListItemPrefix>
                        List of Asset
                      </ListItem>
                    </Link>
                    {Role === 2 || Role === 1 ? (
                      <Link to='/addasset'>
                        <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                          <ListItemPrefix className='mr-3 w-6 h-6'>
                            <FontAwesomeIcon icon={faPlus} />
                          </ListItemPrefix>
                          Add an Asset
                        </ListItem>
                      </Link>
                    ) : null}
                    {loggedIn ? (
                      <Link to='/lease'>
                        <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                          <ListItemPrefix className='mr-3 w-6 h-6'>
                            <FontAwesomeIcon icon={faHandHolding} />
                          </ListItemPrefix>
                          Lease
                        </ListItem>
                      </Link>
                    ) : null}
                    {loggedIn ? (
                      <Link to='/return'>
                        <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                          <ListItemPrefix className='mr-3 w-6 h-6'>
                            <FontAwesomeIcon icon={faRotateLeft} />
                          </ListItemPrefix>
                          Return
                        </ListItem>
                      </Link>
                    ) : null}
                    {Role === 2 || Role === 1 ? (
                      <Link to='/submitted'>
                        <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                          <ListItemPrefix className='mr-3 w-6 h-6'>
                            <FontAwesomeIcon icon={faPaperPlane} />
                          </ListItemPrefix>
                          Submitted
                        </ListItem>
                      </Link>
                    ) : null}
                    {Role === 2 || Role === 1 ? (
                      <Link to='/qrgen'>
                        <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                          <ListItemPrefix className='mr-3 w-6 h-6'>
                            <FontAwesomeIcon icon={faQrcode} />
                          </ListItemPrefix>
                          QR Generator
                        </ListItem>
                      </Link>
                    ) : null}
                  </List>
                </AccordionBody>
              </Accordion>
              {/* SCAN */}
              <Accordion
                open={openSubmenu === 2}
                icon={
                  <FontAwesomeIcon icon={faChevronDown} size=''
                    className={`mx-auto items-center flex h-3 w-4 transition-transform ${openSubmenu === 2 ? "rotate-180" : ""}`}
                  />
                }
              >
                <ListItem className="p-0 px-1 hover:bg-[#323b49] active:bg-gray-600 focus:bg-gray-800 bg-gray-800" selected={openSubmenu === 2}>
                  <AccordionHeader onClick={() => handleOpenSubmenu(2)} className="border-b-0 p-3 bg-none text-white hover:text-white">
                    <ListItemPrefix className='mr-3 w-6 h-6'>
                      <FontAwesomeIcon icon={faCameraRetro} size='sm' />
                    </ListItemPrefix>
                    <Typography color="white" className="mr-auto font-normal">
                      Scan
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="p-0 bg-gray-600">
                  <List className="p-0 gap-0">
                    {Role === 2 ? (
                      <Link to='/scanadd'>
                        <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                          <ListItemPrefix className='mr-3 w-6 h-6'>
                            <FontAwesomeIcon icon={faCirclePlus}/>
                          </ListItemPrefix>
                          Scan Add
                        </ListItem>
                      </Link>
                    ) : null}
                    <Link to='/scanlease'>
                      <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                        <ListItemPrefix className='mr-3 w-6 h-6'>
                          <FontAwesomeIcon icon={faBarcode} />
                        </ListItemPrefix>
                        Scan Lease
                      </ListItem>
                    </Link>
                    <Link to='/scancheck'>
                      <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                        <ListItemPrefix className='mr-3 w-6 h-6'>
                          <FontAwesomeIcon icon={faCamera} />
                        </ListItemPrefix>
                        Scan Check
                      </ListItem>
                    </Link>
                  </List>
                </AccordionBody>
              </Accordion>
              {/* REPORT */}
              <Accordion
                open={openSubmenu === 3}
                icon={
                  <FontAwesomeIcon icon={faChevronDown} size=''
                    className={`mx-auto items-center flex h-3 w-4 transition-transform ${openSubmenu === 3 ? "rotate-180" : ""}`}
                  />
                }
              >
                <ListItem className="p-0 px-1 hover:bg-[#323b49] active:bg-gray-600 focus:bg-gray-800 bg-gray-800" selected={openSubmenu === 3}>
                  <AccordionHeader onClick={() => handleOpenSubmenu(3)} className="border-b-0 p-3 bg-none text-white hover:text-white">
                    <ListItemPrefix className='mr-3 w-6 h-6'>
                      <FontAwesomeIcon icon={faBook} size='sm' />
                    </ListItemPrefix>
                    <Typography color="white" className="mr-auto font-normal">
                      Reports
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="p-0 bg-gray-600">
                  <List className="p-0 gap-0">
                    {Role === 2 || Role === 1 ? (
                      <Link to='/history'>
                        <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                          <ListItemPrefix className='mr-3 w-6 h-6'>
                            <FontAwesomeIcon icon={faClockRotateLeft}/>
                          </ListItemPrefix>
                          History
                        </ListItem>
                      </Link>
                    ) : null}
                    <Link to='myreport'>
                      <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                        <ListItemPrefix className='mr-3 w-6 h-6'>
                          <FontAwesomeIcon icon={faFileLines} />
                        </ListItemPrefix>
                        My Report
                      </ListItem>
                    </Link>
                  </List>
                </AccordionBody>
              </Accordion>
              {/* MANAGE USER */}
              <Accordion
                open={openSubmenu === 4}
                icon={
                  <FontAwesomeIcon icon={faChevronDown}
                    className={`mx-auto items-center flex h-3 w-4 transition-transform ${openSubmenu === 4 ? "rotate-180" : ""}`}
                  />
                }
              >
                <ListItem className="p-0 px-1 hover:bg-[#323b49] active:bg-gray-600 focus:bg-gray-800 bg-gray-800" selected={openSubmenu === 4}>
                  <AccordionHeader onClick={() => handleOpenSubmenu(4)} className="border-b-0 p-3 bg-none text-white hover:text-white">
                    <ListItemPrefix className='mr-3 w-6 h-6'>
                      <FontAwesomeIcon icon={faUserGear} size='sm' />
                    </ListItemPrefix>
                    <Typography color="white" className="mr-auto font-normal">
                      Manage User
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="p-0 bg-gray-600">
                  <List className="p-0 gap-0">
                    {Role === 2 || Role === 1 ? (
                      <Link to='/listuser'>
                        <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                          <ListItemPrefix className='mr-3 w-6 h-6'>
                            <FontAwesomeIcon icon={faUsers}/>
                          </ListItemPrefix>
                          List of User
                        </ListItem>
                      </Link>
                    ) : null}
                    <Link to='/adduser'>
                      <ListItem className='px-4 text-white hover:bg-[#374151] hover:text-white hover:rounded-none focus:rounded-none focus:bg-[#323b49] focus:text-white active:bg-gray-600 active:text-white'>
                        <ListItemPrefix className='mr-3 w-6 h-6'>
                          <FontAwesomeIcon icon={faUserPlus} />
                        </ListItemPrefix>
                        Add an User
                      </ListItem>
                    </Link>
                  </List>
                </AccordionBody>
              </Accordion>
              {loggedIn && (
                <Link to='/Login'>
                  <ListItem onClick={logout} className=' py-2 mt-4 flex justify-center items-center text-sm text-white bg-gray-600 hover:text-white hover:bg-[#323b49] focus:text-white focus:bg-gray-600 active:bg-gray-600 active:text-white'>
                      Log Out
                  </ListItem>
                </Link>
              )}
            </List>
          </Drawer>
          )}

        
        {/* MAIN CONTENT */}
        <div 
          className='bg-[#efefef] p-[20px] flex flex-col min-h-screen w-screen mt-[60px]' 
          style={{marginLeft: isDesktopView ? (openSidebar ? '296px' : '0') : '0', 
                        width: isDesktopView ? (openSidebar ? 'calc(100% - 296px)' : '100%') : '100%', 
                        transition: 'margin 0.5s ease-in-out, width 0.5s ease-in-out',
                      }}
        >
          <Routes>
            {loggedIn ? (
              <Route path="/" element={<Dashboard />} />
            ) : (
              <Route path="/" element={<Login />} />
            )}
              <Route 
                path="/listasset" 
                element={<ListAsset />} 
              />
              <Route 
                path="/addasset" 
                element={Role === 2 || Role === 1 ? <AddAsset /> : <Dashboard />}
              />
              <Route 
                path="/lease" 
                element={loggedIn ? <Lease /> : <Login />} />
              <Route 
                path="/return" 
                element={loggedIn ? <Return /> : <Login />} />
              <Route 
                path="/submitted" 
                element={Role === 2 || Role === 1 ? <Submitted /> : <Dashboard />} />
              <Route 
                path="/history" 
                element={Role === 2 || Role === 1 ? <History /> : <Dashboard />} />
              <Route
                path="/login"
                element={loggedIn ? <Navigate to="/" /> : <Login />}
              />  
              <Route 
                path="/myreport" 
                element={<MyReport />} 
              />
              <Route 
                path="*" 
                element={<Notfound />} 
              />
              <Route 
                path="/offline" 
                element={<Offline />} 
              />
              <Route 
                path="/adduser" 
                element={Role === 2 ? <AddUser /> : <Dashboard />}
              />
              <Route 
                path="/listuser" 
                element={Role === 2 || Role === 1 ? <ListUser /> : <Dashboard />} 
              />
              <Route 
                path="/verify/:token" 
                element ={<Verify />}  
              />
              <Route 
                path="/scanadd" 
                element={Role === 2 ? <ScanAdd /> : <Dashboard />}
              />
              <Route 
                path="/scanlease" 
                element ={<ScanLease />}  
              />
              <Route 
                path="/scancheck" 
                element ={<ScanCheck />}  
              />
              <Route 
                path="/qrgen" 
                element={Role === 2 ? <QRGen /> : <Dashboard />}
              />
            </Routes>
        </div>
      </div>
    ) : <Login /> }
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
}

export default App;
