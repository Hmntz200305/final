import React, { useEffect } from 'react'
import { faBox, faCheckCircle, faExclamationTriangle, faScrewdriverWrench, faSignInAlt, faSignOutAlt, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import { faShareFromSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../AuthContext';

const Dashboard = () => {
    const { refreshDashboardInfo, DashboardInfo, onRequest, inLoans } = useAuth();

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
                <div className='dashboard-icon mb-5 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Welcome, Dashboard page :)</h2>
                </div>
                <div className='bg-white p-5'>
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        <div className="dashboard-item bg-white rounded-2xl p-6 flex items-center text-center shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[#efefef]">
                            <div className="dashboard-icon rounded-full text-white text-xl p-3">
                                <FontAwesomeIcon icon={faBox} />
                            </div>
                            <div className="dashboard-text ml-5">
                                <div className="dashboard-value text-2xl font-bold">{DashboardInfo.total_assets}</div>
                                <div className="dashboard-label text-[#666] text-sm">Jumlah Asset</div>
                            </div>
                        </div>
                        <div className="dashboard-item bg-white rounded-2xl p-6 flex items-center text-center shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[#efefef]">
                            <div className="dashboard-icon text-white rounded-full text-xl p-3">
                                <FontAwesomeIcon icon={faCheckCircle} />
                            </div>
                            <div className="dashboard-text ml-5">
                                <div className="dashboard-value text-2xl font-bold">{DashboardInfo.available}</div>
                                <div className="dashboard-label text-[#666] text-sm">Asset Tersedia</div>
                            </div>
                        </div>
                        <div className="dashboard-item bg-white rounded-2xl p-6 flex items-center text-center shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[#efefef]">
                            <div className="dashboard-icon text-white rounded-full text-xl p-3">
                                <FontAwesomeIcon icon={faShareFromSquare} />
                            </div>
                            <div className="dashboard-text ml-5">
                                <div className="dashboard-value text-2xl font-bold">{onRequest}</div>
                                <div className="dashboard-label text-[#666] text-sm">Asset Diajukan</div>
                            </div>
                        </div>
                        <div className="dashboard-item bg-white rounded-2xl p-6 flex items-center text-center shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[#efefef]">
                            <div className="dashboard-icon text-white rounded-full text-xl p-3">
                                <FontAwesomeIcon icon={faSignOutAlt} />
                            </div>
                            <div className="dashboard-text ml-5">
                                <div className="dashboard-value text-2xl font-bold">{inLoans}</div>
                                <div className="dashboard-label text-[#666] text-sm">Asset Dipinjam</div>
                            </div>
                        </div>
                        <div className="dashboard-item bg-white rounded-2xl p-6 flex items-center text-center shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[#efefef]">
                            <div className="dashboard-icon text-white rounded-full text-xl p-3">
                                <FontAwesomeIcon icon={faSignInAlt} />
                            </div>
                            <div className="dashboard-text ml-5">
                                <div className="dashboard-value text-2xl font-bold">{DashboardInfo.returning}</div>
                                <div className="dashboard-label text-[#666] text-sm">Asset Dikembalikan</div>
                            </div>
                        </div>
                        <div className="dashboard-item bg-white rounded-2xl p-6 flex items-center text-center shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[#efefef]">
                            <div className="dashboard-icon text-white rounded-full text-xl p-3">
                                <FontAwesomeIcon icon={faExclamationTriangle} />
                            </div>
                            <div className="dashboard-text ml-5">
                                <div className="dashboard-value text-2xl font-bold">{DashboardInfo.broken}</div>
                                <div className="dashboard-label text-[#666] text-sm">Broken Asset</div>
                            </div>
                        </div>
                        <div className="dashboard-item bg-white rounded-2xl p-6 flex items-center text-center shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[#efefef]">
                            <div className="dashboard-icon text-white rounded-full text-xl p-3">
                                <FontAwesomeIcon icon={faTimesCircle} />
                            </div>
                            <div className="dashboard-text ml-5">
                                <div className="dashboard-value text-2xl font-bold">{DashboardInfo.missing}</div>
                                <div className="dashboard-label text-[#666] text-sm">Missing Asset</div>
                            </div>
                        </div>
                        <div className="dashboard-item bg-white rounded-2xl p-6 flex items-center text-center shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[#efefef]">
                            <div className="dashboard-icon text-white rounded-full text-xl p-3">
                                <FontAwesomeIcon icon={faScrewdriverWrench} />
                            </div>
                            <div className="dashboard-text ml-5">
                                <div className="dashboard-value text-2xl font-bold">{DashboardInfo.maintenance}</div>
                                <div className="dashboard-label text-[#666] text-sm">Maintenance Asset</div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            

        </>
    )
}
export default Dashboard