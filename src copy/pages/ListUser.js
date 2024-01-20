import React, { useEffect, useState} from 'react'
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { faPenToSquare, faTrash, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input, Menu, MenuList, MenuItem, MenuHandler, Button } from "@material-tailwind/react";
import Modal from 'react-modal';
import { useAuth } from '../AuthContext';

const ListUser = () => {

    const { token, Role, refreshManageUser, ManageUserData, setNotification, setNotificationStatus, openSidebar, setOpenSidebar, setNotificationInfo } = useAuth();
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [roles, setRoles] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [inputValueRole, setInputValueRole] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const isMobile = windowWidth <= 768;
    const [isDesktopView, setIsDesktopView] = useState(window.innerWidth > 768);
    // eslint-disable-next-line

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

    const [modalEdit, setModalEdit] = useState(false);
    const openModalEdit = (row) => {
        setModalEdit(true);
        setSelectedUser(row);
    }
    const closeModalEdit = () => {
        setModalEdit(false);
    }

    const [modalDelete, setModalDelete] = useState(false);
    const openModalDelete = (no) => {
        setModalDelete(true);
        setSelectedUserId(no);
    }
    const closeModalDelete = () => {
        setModalDelete(false);
    }

    useEffect(() => {
        if (Role === 2) {
            refreshManageUser();
        }
    }, [Role]);
    
    
    const handleOptionSelectRole = (selectedRole) => {
        setSelectedUser({ ...selectedUser, role: selectedRole });
    };


      const editUser = async (token) => {
        if (selectedUser.role === 'Super Admin') {
            selectedUser.role = 2;
        } else if (selectedUser.role === 'Admin') {
            selectedUser.role = 1;
        } else {
            selectedUser.role = 0;
        }
    
        const editedUser = {
            username: selectedUser.username,
            userrole: selectedUser.role,
            password: password
        };
        try {
            const response = await fetch(`https://asset.lintasmediadanawa.com:8443/api/edit-user/${selectedUser.no}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify(editedUser),
            })

            if (response.status === 200) {
                const data = await response.json();
                setNotification(data.message);
                setNotificationStatus(true);
                setNotificationInfo(data.Status);
                setShowEdit(false);
                refreshManageUser();
            } else {
                setNotification('Failed to edit user');
                setNotificationStatus(true);
                setNotificationInfo("error");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteUser = async (no) => {
        try {
          const response = await fetch(`https://asset.lintasmediadanawa.com:8443/api/delete-user/${no}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (response.status === 200) {
            const data = await response.json();
            setNotification(data.message);
            setNotificationStatus(true);
            setNotificationInfo(data.Status);
            setShowDelete(false);
            refreshManageUser();
          } else {
            setNotification('Failed to delete user');
            setNotificationStatus(true);
            setNotificationInfo("error");
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
      
    const showEditHandler = (row) => {
        setSelectedUser(row);
        setShowDelete(false);
        setShowEdit((prev) => !prev);
    };
    const showDeleteHandler = (no) => {
        setSelectedUserId(no);
        setShowEdit(false);
        setShowDelete((prev) => !prev);
    };

    const columns = [
        {
            name: 'No',
            selector: (row) => row.no,
            },
            {
            name: 'Username',
            selector: (row) => row.username,
            },
            {
            name: 'Email',
            selector: (row) => row.email,
            },
            {
            name: 'Role',
            selector: (row) => row.role,
            },
            {
            name: 'Created Date',
            selector: (row) => row.created_at,
            },
            {
            name: 'Action',
            cell: (row) => (
                <div className='text-white'>
                    <button className='bg-green-500 p-2 rounded-lg hover:bg-green-700 m-0.5' onClick={() => openModalEdit(row)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button className='bg-red-500 p-2 rounded-lg hover:bg-red-700 m-0.5' onClick={() => openModalDelete(row.no)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
                )
            }
    ]

    return (
        <> 
            <div className='bg-black rounded-2xl p-4 shadow'>
                <h2 className='text-white'>Selamat datang di List User page :)</h2>
            </div>

            <div className='p-2 ' id='data tabel'>
                {isDesktopView && (
                    <Modal
                        isOpen={modalDelete}
                        onRequestClose={closeModalDelete}
                        contentLabel="Contoh Modal"
                        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                        className={`modal-content bg-transparent p-4 w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
                        shouldCloseOnOverlayClick={false}
                    >
                        <div className='p-2'>
                            <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                                <div className='flex flex-col text-center mb-2'>
                                    <h1 className="text-2xl font-semibold">Select Action</h1>
                                    <p>Apakah anda yakin ingin menghapus User ini?</p>
                                </div>
                                <div className="flex space-x-4 mt-5">
                                    <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={closeModalDelete}>Cancel</button>
                                    <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={() => deleteUser(selectedUserId)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )}
                {!isDesktopView && (
                    <Modal
                        isOpen={modalDelete}
                        onRequestClose={closeModalDelete}
                        contentLabel="Contoh Modal"
                        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                        className='modal-content bg-transparent p-4 w-screen'
                        shouldCloseOnOverlayClick={false}
                    >
                        <div className='p-2'>
                            <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
                                <div className='flex flex-col text-center mb-2'>
                                    <h1 className="text-2xl font-semibold">Select Action</h1>
                                    <p>Apakah anda yakin ingin menghapus User ini?</p>
                                </div>
                                <div className="flex space-x-4 mt-5">
                                    <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={closeModalDelete}>Cancel</button>
                                    <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={() => deleteUser(selectedUserId)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )}
                
                {isDesktopView && (
                    <Modal 
                        isOpen={modalEdit}
                        onRequestClose={closeModalEdit}
                        contentLabel="Contoh Modal"
                        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                        className={`modal-content bg-transparent p-4 w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
                        shouldCloseOnOverlayClick={false} 
                    >
                        <div className=''>
                            <div className="flex flex-col bg-white p-2 shadow-xl rounded-2xl space-y-4">
                                <div className='flex flex-col text-center mb-2'>
                                    <h1 className="text-2xl font-semibold">Select Action</h1>
                                    <p>Silahkan inputkan data User yang baru</p>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Username</label>
                                    <Input 
                                        variant="outline"
                                        label="Input Username"
                                        value={selectedUser?.username}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className='flex items-center gap-4'>
                                    <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Password</label>
                                    <Input 
                                        variant="outline"
                                        label="Input Password"
                                        // type='password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className='flex items-center gap-4'>
                                    <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Role</label>
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
                                            value={selectedUser?.role}
                                            onChange={(e) => setInputValueRole(e.target.value)}
                                            disabled
                                            required
                                            label='Input Role'
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-center space-x-4 mt-5 mb-2">
                                    <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={closeModalEdit}>Cancel</button>
                                    <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={() => editUser(token)}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )}
                {!isDesktopView && (
                    <Modal 
                        isOpen={modalEdit}
                        onRequestClose={closeModalEdit}
                        contentLabel="Contoh Modal"
                        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                        className='modal-content bg-transparent p-4 w-screen'
                        shouldCloseOnOverlayClick={false} 
                    >
                        <div className=''>
                            <div className="flex flex-col bg-white p-2 shadow-xl rounded-2xl space-y-4">
                                <div className='flex flex-col text-center mb-2'>
                                    <h1 className="text-2xl font-semibold">Select Action</h1>
                                    <p>Silahkan inputkan data User yang baru</p>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Username</label>
                                    <Input 
                                        variant="outline"
                                        label="Input Username"
                                        value={selectedUser?.username}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className='flex items-center gap-4'>
                                    <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Password</label>
                                    <Input 
                                        variant="outline"
                                        label="Input Password"
                                        // type='password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className='flex items-center gap-4'>
                                    <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Role</label>
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
                                            value={selectedUser?.role}
                                            onChange={(e) => setInputValueRole(e.target.value)}
                                            disabled
                                            required
                                            label='Input Role'
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-center space-x-4 mt-5 mb-2">
                                    <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={closeModalEdit}>Cancel</button>
                                    <button className="main-btn hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded" onClick={() => editUser(token)}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )}

                <div>
                    <DataTableExtensions
                    columns={columns}
                    data={ManageUserData}
                    fileName='hehe'
                    filter
                    print={false}
                    export={false}
                    exportHeaders={false}
                    filterPlaceholder='Filter Data'
                    >
                    <DataTable
                        noHeader
                        defaultSortField='no'
                        defaultSortAsc={false}
                        pagination
                        highlightOnHover
                    />
                    </DataTableExtensions>
                </div>
            </div>
        </>
    )
}
export default ListUser;