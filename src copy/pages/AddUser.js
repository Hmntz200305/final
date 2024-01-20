import React, { useEffect, useState} from 'react'
import { Input, Menu, MenuList, MenuItem, MenuHandler, Button } from "@material-tailwind/react";
import { faLock, faUser, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../AuthContext';

const AddUser = () => {

    const { token, Role, refreshManageUser, setNotification, setNotificationStatus, setNotificationInfo } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [roles, setRoles] = useState("");
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const isMobile = windowWidth <= 768;
    const [isLoading, setIsLoading] = useState(false);

    const handleOptionSelectRole = (selectedRole) => {
      setRoles(selectedRole);
    };

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
    
    useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
    };
    }, []);

    useEffect(() => {
        if (Role === 2) {
            refreshManageUser();
        }
    }, [Role]);
    
    
    const handleRegister = async (token) => {
        let selectedRole = roles;

        if (selectedRole === 'Super Admin') {
          selectedRole = '2';
        } else if (selectedRole === 'Admin') {
          selectedRole = '1';
        } else {
          selectedRole = '0';
        }

        try {
          setIsLoading(true);
          const response = await fetch("https://asset.lintasmediadanawa.com:8443/api/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({ username, email, password, roles: selectedRole }),
          });
    
          if (response.status === 200) {
            const data = await response.json();
            setNotification(data.message);
            setNotificationStatus(true);
            setNotificationInfo(data.Status);
            setUsername('');
            refreshManageUser();
            setEmail('');
            setPassword('');
            setRoles('0');
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

    return (
        <>
            <div className=" flex justify-center items-center p-3">
                <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-semibold text-center mb-12">REGISTRASI</h1>
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-sm font-medium">Username</h2>
                            <div className="relative">
                                <i className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <FontAwesomeIcon icon={faUser} />
                                </i>
                                <Input 
                                variant='outline'
                                type="text"
                                id="username" 
                                name="username" 
                                label="Input Username" 
                                className="w-full border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} 
                                required
                                />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-sm font-medium">Email</h2>
                            <div className="relative">
                                <i className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </i>
                                <Input
                                variant='outline'
                                type="email" 
                                id="email" 
                                name="email" 
                                label="Input Email" 
                                className="w-full border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                                required
                                />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-sm font-medium">Password</h2>
                            <div className="relative">
                                <i className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <FontAwesomeIcon icon={faLock} />
                                </i>
                                <Input 
                                variant='outline'
                                type="password" 
                                id="password" 
                                name="password" 
                                label="Inpout Password" 
                                className="w-full border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                />
                            </div>
                        </div>

                        <div className=''>
                          <label className="text-sm font-medium">Role</label>
                          <div className='flex relative'>
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
                                  <MenuItem onClick={() => handleOptionSelectRole('Super Admin')}>
                                      Super Admin
                                  </MenuItem>
                                  <MenuItem onClick={() => handleOptionSelectRole('Admin')}>
                                      Admin
                                  </MenuItem>
                                  <MenuItem onClick={() => handleOptionSelectRole('User')}>
                                      User
                                  </MenuItem>
                              </MenuList>
                            </Menu>
                            <Input 
                                className='w-full rounded-l-none'
                                type="text"
                                value={roles}
                                onChange={(e) => setRoles(e.target.value)}
                                disabled
                                required
                                label='Input Role'
                            />
                            <i className='absolute right-0 flex items-center pr-3 inset-y-0'>
                              <FontAwesomeIcon icon={faUserShield} />
                            </i>
                          </div>
                        </div>
                        <button
                            className='main-btn w-full'
                            type='submit'
                            onClick={() => handleRegister(token)}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
};

export default AddUser;