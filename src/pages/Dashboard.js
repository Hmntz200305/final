import React, { useEffect, useState } from 'react'
import { faBox, faCheckCircle, faExclamationTriangle, faScrewdriverWrench, faSignInAlt, faSignOutAlt, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import { faShareFromSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom'
import { Popover, PopoverContent, PopoverHandler, Typography } from '@material-tailwind/react';

const Dashboard = () => {
    const { refreshDashboardInfo, DashboardInfo, onRequest, inLoans, Role } = useAuth();
    const [popover1, setPopover1] = useState(false);
    const [popover2, setPopover2] = useState(false);
    const [popover3, setPopover3] = useState(false);
    const [popover4, setPopover4] = useState(false);
    const [popover5, setPopover5] = useState(false);
    const [popover6, setPopover6] = useState(false);
    const [popover7, setPopover7] = useState(false);
    const [popover8, setPopover8] = useState(false);

    const popoverHandler1 = {
        onMouseEnter: () => setPopover1(true),
        onMouseLeave: () => setPopover1(false),
    };
    const popoverHandler2 = {
        onMouseEnter: () => setPopover2(true),
        onMouseLeave: () => setPopover2(false),
    };
    const popoverHandler3 = {
        onMouseEnter: () => setPopover3(true),
        onMouseLeave: () => setPopover3(false),
    };
    const popoverHandler4 = {
        onMouseEnter: () => setPopover4(true),
        onMouseLeave: () => setPopover4(false),
    };
    const popoverHandler5 = {
        onMouseEnter: () => setPopover5(true),
        onMouseLeave: () => setPopover5(false),
    };
    const popoverHandler6 = {
        onMouseEnter: () => setPopover6(true),
        onMouseLeave: () => setPopover6(false),
    };
    const popoverHandler7 = {
        onMouseEnter: () => setPopover7(true),
        onMouseLeave: () => setPopover7(false),
    };
    const popoverHandler8 = {
        onMouseEnter: () => setPopover8(true),
        onMouseLeave: () => setPopover8(false),
    };

    useEffect(() => {
        refreshDashboardInfo();
    }, [])

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    useEffect(() => {
        const dashboardIcons = document.querySelectorAll('.dashboard-icon');
        dashboardIcons.forEach((icon) => {
            icon.style.backgroundColor = getRandomColor();
        });
    }, []);

    return (
        <>
            <div className='p-2'>
                <div className='bg-gray-800 mb-5 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Welcome, Dashboard page tehe :)</h2>
                </div>
                <div className='bg-white p-5'>
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
                        <Link to='/listasset'>
                            <Popover
                                open={popover1}
                                handler={setPopover1}
                            >
                                <PopoverHandler {... popoverHandler1}>
                                    <div className="dashboard-item bg-white rounded-2xl p-6 flex items-center text-center shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[#efefef]">
                                        <div className="dashboard-icon rounded-full text-white text-xl p-3">
                                            <FontAwesomeIcon icon={faBox} />
                                        </div>
                                        <div className="dashboard-text ml-5">
                                            <div className="dashboard-value text-2xl font-bold">{DashboardInfo.total_assets}</div>
                                            <div className="dashboard-label text-[#666] text-sm">Jumlah Asset</div>
                                        </div>
                                    </div>
                                </PopoverHandler>
                                <PopoverContent>
                                    <Typography variant='small'>
                                        Redirect to List of Asset Page
                                    </Typography>
                                </PopoverContent>
                            </Popover>
                        </Link>
                        <Link to='/lease'>
                            <Popover
                                open={popover2}
                                handler={setPopover2}
                                >
                                <PopoverHandler {... popoverHandler2}>
                                    <div className="dashboard-item bg-white rounded-2xl p-6 flex items-center text-center shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[#efefef]">
                                        <div className="dashboard-icon text-white rounded-full text-xl p-3">
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                        </div>
                                        <div className="dashboard-text ml-5">
                                            <div className="dashboard-value text-2xl font-bold">{DashboardInfo.available}</div>
                                            <div className="dashboard-label text-[#666] text-sm">Asset Tersedia</div>
                                        </div>
                                    </div>
                                </PopoverHandler>
                                <PopoverContent>
                                    <Typography variant='small'>
                                        Redirect to Lease Page
                                    </Typography>
                                </PopoverContent>
                            </Popover>
                        </Link>
                        <Link to='/submitted'>
                            <Popover
                                open={popover3}
                                handler={setPopover3}
                                >
                                <PopoverHandler {... popoverHandler3}>
                                    <div className="dashboard-item bg-white rounded-2xl p-6 flex items-center text-center shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[#efefef]">
                                        <div className="dashboard-icon text-white rounded-full text-xl p-3">
                                            <FontAwesomeIcon icon={faShareFromSquare} />
                                        </div>
                                        <div className="dashboard-text ml-5">
                                            <div className="dashboard-value text-2xl font-bold">{onRequest}</div>
                                            <div className="dashboard-label text-[#666] text-sm">Asset Diajukan</div>
                                        </div>
                                    </div>
                                </PopoverHandler>
                                <PopoverContent>
                                    <Typography variant='small'>
                                    Redirect to Submitted Page
                                    </Typography>
                                </PopoverContent>
                            </Popover>
                        </Link>
                        <Link to={Role === 1 || Role === 2 ? '/history' : '/return'}>
                            <Popover
                                open={popover4}
                                handler={setPopover4}
                                >
                                <PopoverHandler {... popoverHandler4}>
                                    <div className="dashboard-item bg-white rounded-2xl p-6 flex items-center text-center shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[#efefef]">
                                        <div className="dashboard-icon text-white rounded-full text-xl p-3">
                                            <FontAwesomeIcon icon={faSignOutAlt} />
                                        </div>
                                        <div className="dashboard-text ml-5">
                                            <div className="dashboard-value text-2xl font-bold">{inLoans}</div>
                                            <div className="dashboard-label text-[#666] text-sm">Asset Dipinjam</div>
                                        </div>
                                    </div>
                                </PopoverHandler>
                                <PopoverContent>
                                    <Typography variant='small'>
                                        {Role === 2 ? 'Redirect to History Page' : 'Redirect to Return Page'}
                                    </Typography>
                                </PopoverContent>
                            </Popover>
                        </Link>
                        <Link to={Role === 1 || Role === 2 ? '/history' : null}>
                            <Popover
                                open={popover5}
                                handler={setPopover5}
                                >
                                <PopoverHandler {... popoverHandler5}>
                                    <div className="dashboard-item bg-white rounded-2xl p-6 flex items-center text-center shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[#efefef]">
                                        <div className="dashboard-icon text-white rounded-full text-xl p-3">
                                            <FontAwesomeIcon icon={faSignInAlt} />
                                        </div>
                                        <div className="dashboard-text ml-5">
                                            <div className="dashboard-value text-2xl font-bold">{DashboardInfo.returning}</div>
                                            <div className="dashboard-label text-[#666] text-sm">Asset Dikembalikan</div>
                                        </div>
                                    </div>
                                </PopoverHandler>
                                <PopoverContent>
                                    <Typography variant='small'>
                                        Redirect to History Page
                                    </Typography>
                                </PopoverContent>
                            </Popover>
                        </Link>
                        <Popover
                            open={popover6}
                            handler={setPopover6}
                        >
                            <PopoverHandler {... popoverHandler6}>
                                <div className="dashboard-item bg-white rounded-2xl p-6 flex items-center text-center shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[#efefef]">
                                    <div className="dashboard-icon text-white rounded-full text-xl p-3">
                                        <FontAwesomeIcon icon={faExclamationTriangle} />
                                    </div>
                                    <div className="dashboard-text ml-5">
                                        <div className="dashboard-value text-2xl font-bold">{DashboardInfo.broken}</div>
                                        <div className="dashboard-label text-[#666] text-sm">Broken Asset</div>
                                    </div>
                                </div>
                            </PopoverHandler>
                            <PopoverContent>
                                <Typography variant='small'>
                                Page not found
                                </Typography>
                            </PopoverContent>
                        </Popover>
                        <Popover
                            open={popover7}
                            handler={setPopover7}
                        >
                            <PopoverHandler {... popoverHandler7}>
                                <div className="dashboard-item bg-white rounded-2xl p-6 flex items-center text-center shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[#efefef]">
                                    <div className="dashboard-icon text-white rounded-full text-xl p-3">
                                        <FontAwesomeIcon icon={faTimesCircle} />
                                    </div>
                                    <div className="dashboard-text ml-5">
                                        <div className="dashboard-value text-2xl font-bold">{DashboardInfo.missing}</div>
                                        <div className="dashboard-label text-[#666] text-sm">Missing Asset</div>
                                    </div>
                                </div>
                            </PopoverHandler>
                            <PopoverContent>
                                <Typography variant='small'>
                                Page not found
                                </Typography>
                            </PopoverContent>
                        </Popover>
                        <Popover
                            open={popover8}
                            handler={setPopover8}
                        >
                            <PopoverHandler {... popoverHandler8}>
                                <div className="dashboard-item bg-white rounded-2xl p-6 flex items-center text-center shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[#efefef]">
                                    <div className="dashboard-icon text-white rounded-full text-xl p-3">
                                        <FontAwesomeIcon icon={faScrewdriverWrench} />
                                    </div>
                                    <div className="dashboard-text ml-5">
                                        <div className="dashboard-value text-2xl font-bold">{DashboardInfo.maintenance}</div>
                                        <div className="dashboard-label text-[#666] text-sm">Maintenance Asset</div>
                                    </div>
                                </div>
                            </PopoverHandler>
                            <PopoverContent>
                                <Typography variant='small'>
                                    Page not found
                                </Typography>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                
            </div>
            

        </>
    )
}
export default Dashboard