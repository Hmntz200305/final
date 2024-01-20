import React, { useState, useEffect } from 'react'
import { faLock, faThumbsUp, faThumbsDown, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from './AuthContext';
import Modal from 'react-modal';
import { Bounce,  ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
Modal.setAppElement('#root');

const Login = () => {
    const { login, setNotification, Notification, setNotificationStatus, NotificationStatus, NotificationInfo, setNotificationInfo, setLoginNotificationStatus, LoginNotificationStatus } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [FEmail, setFEmail] = useState("");
    const [FUsername, setFUsername] = useState("");
    const [FPassword, setFPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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

    // Modal
    const [showModalForgot, setShowModalForgot] = useState(false);
    const showModalForgotHandle = () => {
      setShowModalForgot(true);
    }
    const closeModalForgotHandle = () => {
      setShowModalForgot(false);
    }
  
    // POST ke API
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
            setShowModalForgot(false);
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
              <p>
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
          </div>
          {NotificationStatus ? (
              <div className={`notification ${NotificationStatus ? 'slide-in' : 'slide-out'}`}>
                <div class="flex items-center lg:w-[300px] md:w-[250px] sm:w-[200px] p-4 opacity-90 rounded-lg shadow bg-gray-900">
                  {NotificationInfo === 'Error' ? (
                    <div class="flex bg-red-500 items-center justify-center flex-shrink-0 w-8 h-8 text-white rounded-lg">
                      <FontAwesomeIcon icon={faThumbsDown} />
                    </div>
                  ) : (
                    <div class="flex bg-green-500 items-center justify-center flex-shrink-0 w-8 h-8 text-white rounded-lg">
                      <FontAwesomeIcon icon={faThumbsUp} />
                    </div>
                  )}
                  <div class="ml-3 text-left text-sm font-normal break-all text-white">{Notification}</div>
                </div>
              </div>
            ) : null }
            <div className=" flex justify-center items-center min-h-screen p-3">
                <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-semibold text-center mb-12">LOGIN</h1>
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-sm font-medium">Email</h2>
                            <div className="relative">
                                <i className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </i>
                                <input
                                  type="email"
                                  id="email"
                                  name="email"
                                  placeholder="Enter your email"
                                  className="w-full py-2 pl-10 pr-4 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  required
                                />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-sm font-medium">Password</h2>
                            <div className="relative">
                                <i className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <FontAwesomeIcon icon={faLock} />
                                </i>
                                <input
                                  type="password"
                                  id="password"
                                  name="password"
                                  placeholder="Enter your password"
                                  className="w-full py-2 pl-10 pr-4 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required
                                />
                            </div>
                        </div>
                       
                        <button
                          type="submit"
                          onClick={handleLogin}
                          className="w-full py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Login...' : 'Login'}
                        </button>
                        <div className="text-center">
                            <button className="text-black hover:underline focus:outline-none" onClick={showModalForgotHandle}>Forgot password?</button>
                        </div>
                    </div>
                </div>
                <Modal
                  isOpen={showModalForgot}
                  onRequestClose={closeModalForgotHandle}
                  contentLabel="Contoh Modal"
                  overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                  className="modal-content bg-white w-1/2 p-4 rounded shadow-md"
                  shouldCloseOnOverlayClick={false}
                  >
                  <div className='p-2'>
                    <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                        <div className='flex flex-col text-center mb-2'>
                            <h1 className="text-2xl font-semibold">Select Action</h1>
                            <p>Silahkan masukan Data anda sebelumnya</p>
                        </div>
                        <div className='form-group'>
                            <label className='label-text'>Username</label>
                            <input 
                            className='form-input pl-5' 
                            placeholder='Masukan Username' 
                            value={FUsername}
                            onChange={(e) => setFUsername(e.target.value)}
                            required
                            />
                        </div>
                        <div className='form-group'>
                            <label className='label-text'>Email</label>
                            <input 
                            className='form-input pl-5' 
                            placeholder='Masukan Email' 
                            value={FEmail}
                            onChange={(e) => setFEmail(e.target.value)}
                            required
                            />
                        </div>
                        <div className='form-group'>
                            <label className='label-text'>Password</label>
                            <input 
                            type='password'
                            className='form-input pl-5' 
                            placeholder='Masukan New Password' 
                            value={FPassword}
                            onChange={(e) => setFPassword(e.target.value)}
                            required
                            />
                        </div>
                        <div className="flex space-x-4 mt-5 mb-2">
                            <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={closeModalForgotHandle}>Cancel</button>
                            <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={handleForgotPassword}>Submit</button>
                        </div>
                    </div>
                  </div>
                </Modal>
                
            </div>
        </div>
    )
}
export default Login