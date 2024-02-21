import React, { useEffect, useState } from 'react'
import { faBox, faCheckCircle, faExclamationTriangle, faScrewdriverWrench, faSignInAlt, faSignOutAlt, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import { faShareFromSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom'
import { Popover, PopoverContent, PopoverHandler, Typography, Card, CardHeader } from '@material-tailwind/react';
import Chart from "react-apexcharts";

const Dashboard = () => {
    const { refreshDashboardInfo, DashboardInfo, onRequest, inLoans, Role } = useAuth();
    const [popover1, setPopover1] = useState(false);
    const [popover2, setPopover2] = useState(false);
    const [popover3, setPopover3] = useState(false);
    const [popover4, setPopover4] = useState(false);
    const [popover5, setPopover5] = useState(false);
    const totalAssets = DashboardInfo ? DashboardInfo.total_assets : 0;
    const availableAssets = DashboardInfo ? DashboardInfo.available : 0;
    const submittedAssets = onRequest || 0;
    const leasedAssets = inLoans || 0;
    const returnedAssets = DashboardInfo ? DashboardInfo.returning : 0;
    const brokenAssets = DashboardInfo ? DashboardInfo.broken : 0;
    const missingAssets = DashboardInfo ? DashboardInfo.missing : 0;
    const maintenanceAssets = DashboardInfo ? DashboardInfo.maintenance : 0;

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

    const seriesData = [
        totalAssets,
        availableAssets,
        submittedAssets,
        leasedAssets,
        returnedAssets,
        brokenAssets,
        missingAssets,
        maintenanceAssets,
    ];
    
    const filteredSeriesData = seriesData.filter(data => typeof data !== 'undefined');
    
    const barChart = {
        type: "bar",
        height: 300,
        series: [
          {
            name: "Value",
            data: filteredSeriesData,
          },
        ],
        options: {
          chart: {
            toolbar: {
              show: false,
            },
          },
          title: {
            show: "",
          },
          dataLabels: {
            enabled: false,
          },
          colors: ["#020617"],
          plotOptions: {
            bar: {
              columnWidth: "40%",
              borderRadius: 2,
            },
          },
          xaxis: {
            axisTicks: {
              show: false,
            },
            axisBorder: {
              show: false,
            },
            labels: {
              style: {
                colors: "#616161",
                fontSize: "12px",
                fontFamily: "inherit",
                fontWeight: 400,
              },
            },
            categories: [
              "Total Asset",
              "Available Asset",
              "Submitted Asset",
              "Leased Asset",
              "Returned Asset",
              "Broken Asset",
              "Missing Asset",
              "Maintenance Asset",
            ],
          },
          yaxis: {
            labels: {
              style: {
                colors: "#616161",
                fontSize: "12px",
                fontFamily: "inherit",
                fontWeight: 400,
              },
            },
          },
          grid: {
            show: true,
            borderColor: "#dddddd",
            strokeDashArray: 5,
            xaxis: {
              lines: {
                show: true,
              },
            },
            padding: {
              top: 5,
              right: 20,
            },
          },
          fill: {
            opacity: 0.8,
          },
          tooltip: {
            theme: "dark",
          },
        },
    };
    
    const pieChart = {
        type: "pie",
        width: 300,
        height: 297,
        series: filteredSeriesData,
        options: {
          chart: {
            toolbar: {
              show: false,
            },
          },
          title: {
            show: "",
          },
          labels: [
            "Total Asset",
            "Available Asset",
            "Submitted Asset",
            "Leased Asset",
            "Returned Asset",
            "Broken Asset",
            "Missing Asset",
            "Maintenance Asset",
          ],
          dataLabels: {
            enabled: false,
          },
          colors: ["#E69500", "#4D4D4D", "#808080", "#008066", "#008040", "#E68AFF", "#E64C4C", "#336699"],
          legend: {
            show: false,
          },
        },
    };

    return (
        <>
            <div className='p-2'>
                <div className='bg-gray-800 mb-8 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Welcome, Dashboard page :)</h2>
                </div>
                <Card className='rounded-xl' floated={false} shadow={false} color="transparent">
                    <CardHeader
                        floated={false}
                        shadow={false}
                        color="transparent"
                        className="m-0 flex flex-col gap-4 rounded-none md:flex-row md:items-center"
                    >
                        <div>
                            <Typography variant="h6" color="blue-gray">
                                Dashboard & Statistic
                            </Typography>
                            <Typography
                                variant="small"
                                color="gray"
                                className="max-w-sm font-normal"
                            >
                                Visuallization of the data into Card, Bar Chart, and Pie Chart.
                            </Typography>
                        </div>
                    </CardHeader>
                    <Card className="mt-4 p-5 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
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
                                            <div className="dashboard-label text-[#666] text-sm">Total Asset</div>
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
                                            <div className="dashboard-label text-[#666] text-sm">Available Asset</div>
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
                                            <div className="dashboard-label text-[#666] text-sm">Submitted Asset</div>
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
                                            <div className="dashboard-label text-[#666] text-sm">Leased Asset</div>
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
                                            <div className="dashboard-label text-[#666] text-sm">Returned Asset</div>
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
                    </Card>
                    <div className='grid md:grid-cols-1 xl:grid-cols-2 gap-1 mt-1'>
                        <Card className='px-2 pb-0'>
                            <Chart {...barChart} />
                        </Card>
                        <Card className='grid place-items-center'>
                            <Chart {...pieChart} />
                        </Card>
                    </div>
                </Card>
                
            </div>
            

        </>
    )
}
export default Dashboard