import React, { useState, useEffect } from 'react'
import { faLock, faThumbsUp, faThumbsDown, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope, faUser,  faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from './AuthContext';
import Modal from 'react-modal';
import { Bounce,  ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input, Button, } from "@material-tailwind/react";
import Gambar1 from './resources/img/1.png';
import Gambar2 from './resources/img/2.png';
import Gambar3 from './resources/img/3.png';
import Gambar4 from './resources/img/4.png';
Modal.setAppElement('#root');

const getRandomImage = () => {
  const images = [Gambar1, Gambar2, Gambar3, Gambar4];
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

const Login = () => {
    const { login, setNotification, Notification, setNotificationStatus, NotificationStatus, NotificationInfo, setNotificationInfo, setLoginNotificationStatus, LoginNotificationStatus } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [FEmail, setFEmail] = useState("");
    const [FUsername, setFUsername] = useState("");
    const [FPassword, setFPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState(getRandomImage);
    const [openModal, setOpenModal] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isDesktopView, setIsDesktopView] = useState(window.innerWidth > 768);

    const handleResizeMobile = () => {
        setIsDesktopView(window.innerWidth > 768);
    }; 
      
    useEffect(() => {
        window.addEventListener('resize', handleResizeMobile);
  
        return () => {
        window.removeEventListener('resize', handleResizeMobile);
        };
    }, []);

    const openModalHandler = () => {
      setOpenModal(true);
    }
    const closeModalHandler = () => {
        setOpenModal(false);
    }

    const visiblePasswordHandler = () => {
        setPasswordVisible(!passwordVisible);
    };

    useEffect(() => {
      setBackgroundImage(getRandomImage());
    }, []);

    if (NotificationStatus) {
      setTimeout(() => {
        setNotificationStatus(false);
        setNotification('');
      }, 8000);
    } else {
      setNotificationStatus(false);
      setNotification('');
      setNotificationInfo('');
    }
  
    const handleLogin = async () => {
        try {
          setIsLoading(true);
          const response = await fetch("https://asset.lintasmediadanawa.com:8443/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
    
          if (response.status === 200) {
            const data = await response.json();
            login(data);
            setNotification(data.message);
            setNotificationStatus(true);
            setNotificationInfo(data.Status);
          } else {
            const data = await response.json();
            setNotification(data.message);
            setLoginNotificationStatus(true);
            setNotificationInfo(data.Status);
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setIsLoading(false);
        }
      };

      const handleForgotPassword = async () => {
        if ((!FUsername || FUsername.trim() === '') || (!FEmail || FEmail.trim() === '') || (!FPassword || FEmail.trim() === '')) {
          setNotification('Harap semua form diisi');
          setLoginNotificationStatus(true);
          setNotificationInfo('warning');
        }

        try {
          const response = await fetch("https://asset.lintasmediadanawa.com:8443/api/forgotpassword", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ FUsername, FEmail, FPassword }),
          });
    
          if (response.status === 200) {
            const data = await response.json();
            setNotification(data.message);
            setNotificationStatus(true);
            setNotificationInfo(data.Status);
            setFUsername('');
            setFEmail('');
            setFPassword('');
            setOpenModal(false);
          } else {
            const data = await response.json();
            setNotification(data.message);
            setLoginNotificationStatus(true);
            setNotificationInfo(data.Status);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

      useEffect(() => {
        if (LoginNotificationStatus) {
          if (NotificationInfo === 'error') {
            toast.error(
              <p className='ml-3'>
                {Notification}
              </p>,
            {
              icon: (
                <div className='bg-red-500 p-2 rounded-xl flex items-center w-8 h-8 '>
                  <FontAwesomeIcon icon={faThumbsDown} />
                </div>
              )
            });
          } else if (NotificationInfo === 'warning') {
            toast.warning(
              <p className='ml-3'>
                {Notification}
              </p>,
            {
              icon: (
                <div className='bg-yellow-700 p-2 rounded-xl flex items-center w-8 h-8'>
                  <FontAwesomeIcon icon={faTriangleExclamation} />
                </div>
              )
            });
          } else {
          }
        } else {
        }
    
        setNotificationStatus(false);
        setLoginNotificationStatus(false);
        setNotification('');
        setNotificationInfo('');
      }, [LoginNotificationStatus, NotificationInfo, Notification]);

    return (
        <div className='bg-[#efefef]'>
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
            <div className=" flex justify-center items-center min-h-screen">
              <div className={`bg-white p-4 rounded-lg shadow-lg flex justify-center items-center space-x-8 ${isDesktopView ? 'w-1/2' : 'w-[90%]'}`}> 
                {isDesktopView && (
                  <div
                    className="w-80 h-80 bg-cover object-contain flex items-center justify-center rounded-lg"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                  />
                )}
                <div className='flex-grow p-2'>
                  <h1 className="text-2xl font-semibold text-center mb-12">Login</h1>
                  <div className="space-y-4">
                      <div>
                          <h2 className="text-sm text-gray-600 mb-2">Email</h2>
                          <div className="relative">
                              <i className="absolute inset-y-0 right-0 flex items-center pr-3">
                                  <FontAwesomeIcon icon={faEnvelope} />
                              </i>
                              <Input
                                type="email"
                                variant='outlined'
                                label="Enter your email"
                                className="w-full py-2 pr-4 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                          </div>
                      </div>
                      <div>
                          <label className="text-sm text-gray-600 mb-2">Password</label>
                          <div className="relative">
                              <Input
                                type={passwordVisible ? "text" : "password"}
                                variant='outlined'
                                label="Enter your password"
                                className="w-full py-2 pr-4 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                              />
                              <button className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={visiblePasswordHandler}>
                                <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
                              </button>
                          </div>
                          <div className='flex items-center justify-end'>
                              <button className='text-sm p-2' onClick={openModalHandler}>Forgot Password ?</button>
                          </div>
                      </div>
                      <Button
                        type="submit"
                        className="py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none"
                        onClick={handleLogin}
                        disabled={isLoading}
                      >
                          {isLoading ? 'Login...' : 'Login'}
                      </Button>
                  </div>
                </div>
            </div>
            <Modal
              isOpen={openModal}
              onRequestClose={closeModalHandler}
              contentLabel="Contoh Modal"
              overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
              className={`modal-content bg-none p-4 rounded ${isDesktopView ? 'w-1/2' : 'w-[90%]'}`}
              shouldCloseOnOverlayClick={false}
            >
              <div className='p-2'>
                  <div className="flex flex-col items-center justify-center bg p-2 shadow-xl rounded-2xl gap-2 bg-white">
                      <div className='flex flex-col text-center mb-8 px-8'>
                          <h1 className="text-2xl font-semibold">Forgot Password</h1>
                          <p className='mt-2'>Silahkan lakukan Validasi Data, kemudian inputkan Password anda yang baru</p>
                      </div>
                      <hr className="border-t-2 border-gray-300 w-32" />
                      <div className="text-xs text-gray-500 mb-2">Validasi User</div>
                      <div className='flex items-center gap-4 w-full px-8'>
                          {isDesktopView && (
                            <label className='pr-4 w-32 text-right'>Username</label>
                          )}
                          <div className='flex-grow relative'>
                              <Input 
                                  variant='outline' 
                                  label='Enter your previous username' 
                                  type='text'
                                  value={FUsername}
                                  onChange={(e) => setFUsername(e.target.value)}
                              /> 
                              <button className='absolute inset-y-0 right-0 flex items-center pr-4'>
                                <FontAwesomeIcon icon={faUser} />
                              </button>
                          </div>
                      </div>
                      <div className='flex items-center gap-4 w-full px-8'>
                          {isDesktopView && (
                            <label className='pr-4 w-32 text-right'>Email</label>
                          )}
                          <div className='flex-grow relative'>
                              <Input 
                                  variant='outline' 
                                  label='Enter your previous email' 
                                  type='email' 
                                  value={FEmail}
                                  onChange={(e) => setFEmail(e.target.value)}
                              /> 
                              <button className='absolute inset-y-0 right-0 flex items-center pr-4'>
                                <FontAwesomeIcon icon={faEnvelope} />
                              </button>
                          </div>
                      </div>
                      <hr className="border-t-2 border-gray-300 mt-8 w-32" />
                      <div className="text-xs text-gray-500 mb-2">New Password</div>
                      <div className='flex items-center gap-4 w-full px-8'>
                          {isDesktopView && (
                            <label className='pr-4 w-32 text-right'>Password</label>
                          )}
                          <div className='relative flex-grow'>
                              <Input 
                                  variant='outline' 
                                  label='Enter your  new password' 
                                  type={passwordVisible ? "text" : "password"}
                                  value={FPassword}
                                  onChange={(e) => setFPassword(e.target.value)}
                              />
                              <button className='absolute inset-y-0 right-0 flex items-center pr-4' onClick={visiblePasswordHandler}>
                                  <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
                              </button>
                          </div>
                      </div>
                      <div className="flex space-x-4 mt-5 mb-2">
                          <Button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={closeModalHandler}>Cancel</Button>
                          <Button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" type='submit' onClick={handleForgotPassword}>Submit</Button>
                      </div>
                  </div>
              </div>
          </Modal>
        </div>
      </div>

    )
}
export default Login