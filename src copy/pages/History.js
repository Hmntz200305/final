import React, { useEffect, useState, useRef } from 'react'
import DataTable from 'react-data-table-component';
import { faFileCsv, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import 'react-data-table-component-extensions/dist/index.css';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../AuthContext';
import { MaterialReactTable, createMRTColumnHelper, } from 'material-react-table';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel, } from "@material-tailwind/react";
Modal.setAppElement('#root');

const History = () => {

    const LogContent = () => {

        const handleExportCsvLog = (rows) => {
            if (rows.length === 0) {
                console.error('Tidak ada data yang dipilih untuk diekspor CSV Log.');
                return;
            }
            const rowData = rows.map((row) => {
              const dataRow = row.original;
              return {
                no: dataRow.no,
                id: dataRow.idticket,
                assset: dataRow.asset,
                name: dataRow.name,
                leasedatae: dataRow.leasedate,
                returndate: dataRow.returndate,
                location: dataRow.location,
                note: dataRow.note,
                email: dataRow.email,
                status: dataRow.status,
                admin1: dataRow.admin1,
                admin2: dataRow.admin2,
              };
            });
          
            const csvConfig = mkConfig({
              fieldSeparator: ',',
              decimalSeparator: '.',
              useKeysAsHeaders: true,
            });
          
            const csv = generateCsv(csvConfig)(rowData);
            download(csvConfig)(csv);
          };
          
            const handleExportPdfLog = (rows) => {
            if (rows.length === 0) {
                console.error('Tidak ada data yang dipilih untuk diekspor PDF Log.');
                return;
            }
            const doc = new jsPDF();
            const tableData = rows.map((row) => {
              const dataRow = row.original;
              return [dataRow.no, dataRow.idticket, dataRow.asset, dataRow.name, dataRow.leasedate, dataRow.returndate, dataRow.location, dataRow.note, dataRow.email, dataRow.status, dataRow.admin1, dataRow.admin2];
            });
          
            const tableHeaders = ['No', 'ID Ticket', 'ID Asset', 'Name', 'Lease Date', 'Return Date', 'Location', 'Note', 'Email', 'Status', 'Admin #1', 'Admin #2'];
          
            autoTable(doc, {
              head: [tableHeaders],
              body: tableData,
            });
          
            doc.save('mrt-pdf-example.pdf');
        };

        return (
            <div className='p-0'>
                <p className='mb-4'>Silahkan pilih ingin mengexport dengan apa </p>
                <div className='flex space-x-[1px]'>
                    <button className='main-btn cursor-default'>
                        <FontAwesomeIcon icon={faFileCsv} size='xl' />
                    </button>
                    <div className='flex flex-grow items-center border rounded border-gray-800'>
                        <button 
                            className='flex-grow rounded py-[8px] text-black hover:bg-gray-800 hover:text-white'
                            // disabled={tableRef.current?.getPrePaginationRowModel().rows.length === 0} 
                            onClick={() => handleExportCsvLog(tableRef.current?.getPrePaginationRowModel().rows)}
                        >
                        Export All Rows
                        </button>
                        <button
                            className='flex-grow rounded py-[8px] text-black hover:bg-gray-800 hover:text-white' 
                            // disabled={tableRef.current?.getRowModel().rows.length === 0}
                            onClick={() => handleExportCsvLog(tableRef.current?.getRowModel().rows)}
                        >
                        Export Page Rows
                        </button>
                        <button 
                            className='flex-grow rounded py-[8px] text-black hover:bg-gray-800 hover:text-white' 
                            // disabled={!tableRef.current?.getIsSomeRowsSelected() && !tableRef.current?.getIsAllRowsSelected()} 
                            onClick={() => handleExportCsvLog(tableRef.current?.getSelectedRowModel().rows)}
                        >
                        Export Selected Rows
                        </button>
                    </div>
                </div>
                <div className='flex space-x-[1px]'>
                    <button className='main-btn cursor-default'>
                        <FontAwesomeIcon icon={faFilePdf} size='xl' />
                    </button>
                    <div className='flex flex-grow items-center border rounded border-gray-800'>
                        <button 
                            className='flex-grow rounded py-[8px] text-black hover:bg-gray-800 hover:text-white' 
                            // disabled={tableRef.current?.getPrePaginationRowModel().rows.length === 0} 
                            onClick={() => handleExportPdfLog(tableRef.current?.getPrePaginationRowModel().rows)}
                        >
                        Export All Rows
                        </button>
                        <button 
                            className='flex-grow rounded py-[8px] text-black hover:bg-gray-800 hover:text-white' 
                            // disabled={tableRef.current?.getRowModel().rows.length === 0} 
                            onClick={() => handleExportPdfLog(tableRef.current?.getRowModel().rows)}
                        >
                        Export Page Rows
                        </button>
                        <button 
                            className='flex-grow items-center rounded py-[8px] text-black hover:bg-gray-800 hover:text-white' 
                            // disabled={!tableRef.current?.getIsSomeRowsSelected() && !tableRef.current?.getIsAllRowsSelected()} 
                            onClick={() => handleExportPdfLog(tableRef.current?.getSelectedRowModel().rows)}
                        >
                        Export Selected Rows
                        </button>
                    </div>
                </div>
                <div className='mt-4'>
                    <MaterialReactTable 
                        columns={columnsNew}
                        data={HistoryTicket}
                        enableRowSelection={true}
                        enableClickToCopy={false}
                        columnFilterDisplayMode= 'popover'
                        paginationDisplayMode= 'pages'
                        positionToolbarAlertBanner= 'bottom'
                        renderTopToolbarCustomActions= {({ table }) => { 
                            tableRef.current = table;
                            return null; 
                        }}
                    />
                </div>
            </div>
        )
    };

    const PeminjamanContent = () => {

        const handleExportCsvPeminjaman = (rows) => {
            if (rows.length === 0) {
                console.error('Tidak ada data yang dipilih untuk diekspor CSV Peminjaman.');
                return;
            }
            const rowData = rows.map((row) => {
              const dataRow = row.original;
              return {
                no: dataRow.no,
                id: dataRow.idticket,
                assset: dataRow.asset,
                assetname: dataRow.assetname,
                leasedatae: dataRow.leasedate,
                returndate: dataRow.returndate,
                name: dataRow.name,
                email: dataRow.email,
                status: dataRow.status,
              };
            });
          
            const csvConfig = mkConfig({
              fieldSeparator: ',',
              decimalSeparator: '.',
              useKeysAsHeaders: true,
            });
          
            const csv = generateCsv(csvConfig)(rowData);
            download(csvConfig)(csv);
          };
          
            const handleExportPdfPeminjaman = (rows) => {
            if (rows.length === 0) {
                console.error('Tidak ada data yang dipilih untuk diekspor PDF Peminjaman.');
                return;
            }
            const doc = new jsPDF();
            const tableData = rows.map((row) => {
              const dataRow = row.original;
              return [dataRow.no, dataRow.idticket, dataRow.asset, dataRow.assetname, dataRow.leasedate, dataRow.returndate, dataRow.name, dataRow.email, dataRow.status];
            });
          
            const tableHeaders = ['No', 'ID Ticket', 'ID Asset', 'Name', 'Lease Date', 'Return Date', 'Username', 'Email', 'Status'];
          
            autoTable(doc, {
              head: [tableHeaders],
              body: tableData,
            });
          
            doc.save('mrt-pdf-example.pdf');
        };

        return (
            <div className='p-0'>
                <p className='mb-4'>Silahkan pilih ingin mengexport dengan apa </p>
                <div className='flex space-x-[1px]'>
                    <button className='main-btn cursor-default'>
                        <FontAwesomeIcon icon={faFileCsv} size='xl' />
                    </button>
                    <div className='flex flex-grow items-center border rounded border-gray-800'>
                        <button 
                            className='flex-grow rounded py-[8px] text-black hover:bg-gray-800 hover:text-white'
                            // disabled={tableRef.current?.getPrePaginationRowModel().rows.length === 0} 
                            onClick={() => handleExportCsvPeminjaman(tableRef.current?.getPrePaginationRowModel().rows)}
                        >
                        Export All Rows
                        </button>
                        <button
                            className='flex-grow rounded py-[8px] text-black hover:bg-gray-800 hover:text-white' 
                            // disabled={tableRef.current?.getRowModel().rows.length === 0}
                            onClick={() => handleExportCsvPeminjaman(tableRef.current?.getRowModel().rows)}
                        >
                        Export Page Rows
                        </button>
                        <button 
                            className='flex-grow rounded py-[8px] text-black hover:bg-gray-800 hover:text-white' 
                            // disabled={!tableRef.current?.getIsSomeRowsSelected() && !tableRef.current?.getIsAllRowsSelected()} 
                            onClick={() => handleExportCsvPeminjaman(tableRef.current?.getSelectedRowModel().rows)}
                        >
                        Export Selected Rows
                        </button>
                    </div>
                </div>
                <div className='flex space-x-[1px]'>
                    <button className='main-btn cursor-default'>
                        <FontAwesomeIcon icon={faFilePdf} size='xl' />
                    </button>
                    <div className='flex flex-grow items-center border rounded border-gray-800'>
                        <button 
                            className='flex-grow rounded py-[8px] text-black hover:bg-gray-800 hover:text-white' 
                            // disabled={tableRef.current?.getPrePaginationRowModel().rows.length === 0} 
                            onClick={() => handleExportPdfPeminjaman(tableRef.current?.getPrePaginationRowModel().rows)}
                        >
                        Export All Rows
                        </button>
                        <button 
                            className='flex-grow rounded py-[8px] text-black hover:bg-gray-800 hover:text-white' 
                            // disabled={tableRef.current?.getRowModel().rows.length === 0} 
                            onClick={() => handleExportPdfPeminjaman(tableRef.current?.getRowModel().rows)}
                        >
                        Export Page Rows
                        </button>
                        <button 
                            className='flex-grow items-center rounded py-[8px] text-black hover:bg-gray-800 hover:text-white' 
                            // disabled={!tableRef.current?.getIsSomeRowsSelected() && !tableRef.current?.getIsAllRowsSelected()} 
                            onClick={() => handleExportPdfPeminjaman(tableRef.current?.getSelectedRowModel().rows)}
                        >
                        Export Selected Rows
                        </button>
                    </div>
                </div>
                <div className='mt-4'>
                    <MaterialReactTable 
                        columns={Peminjaman}
                        data={HistoryLoanData}
                        enableRowSelection={true}
                        enableClickToCopy={false}
                        columnFilterDisplayMode= 'popover'
                        paginationDisplayMode= 'pages'
                        positionToolbarAlertBanner= 'bottom'
                        renderTopToolbarCustomActions= {({ table }) => { 
                            tableRef.current = table;
                            return null; 
                        }}
                    />
                </div>
            </div>
        )
    };
    

    const { refreshHistoryTicket, HistoryTicket, refreshHistoryLoanData, HistoryLoanData, openSidebar, setOpenSidebar, } = useAuth();
    const [selectedAssetDetails, setSelectedAssetDetails] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const isMobile = windowWidth <= 768;
    const [isDesktopView, setIsDesktopView] = useState(window.innerWidth > 768);
    const tableRef = useRef(null);

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

    useEffect(() =>{
        refreshHistoryTicket();
        refreshHistoryLoanData();
        // eslint-disable-next-line
    }, [])

    const [activeTab, setActiveTab] = React.useState("log");
    const data = [
        {
        label: "Log",
        value: "log",
        content: <LogContent />,
        },
        {
        label: "Peminjaman",
        value: "peminjaman",
        content: <PeminjamanContent />,
        },
    ];

    // Modal
    const [showMoreDetail, setShowMoreDetail] = useState(false);

    const openMoreDetailHandler = (row) => {
        setShowMoreDetail(true);
        setSelectedAssetDetails([row]);
    };
    const closeMoreDetailHandler = (row) => {
        setShowMoreDetail(false)
    }

      
    const columnHelper = createMRTColumnHelper();

        const columnsNew = [
        columnHelper.accessor('no', {
            header: 'No',
            size: 40,
        }),
        columnHelper.accessor('idticket', {
            header: 'ID Ticket',
            size: 120,
        }),
        columnHelper.accessor('asset', {
            header: 'ID Asset',
            size: 120,
        }),
        columnHelper.accessor('name', {
            header: 'Name',
            size: 120,
        }),
        columnHelper.accessor('leasedate', {
            header: 'Lease Date',
            size: 120,
        }),
        columnHelper.accessor('returndate', {
            header: 'Return Date',
            size: 120,
        }),
        columnHelper.accessor('location', {
            header: 'Location',
            size: 120,
        }),
        columnHelper.accessor('note', {
            header: 'Note',
            size: 120,
        }),
        columnHelper.accessor('email', {
            header: 'Email',
            size: 120,
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            size: 120,
        }),
        columnHelper.accessor('admin1', {
            header: 'Admin #1',
            size: 120,
        }),
        columnHelper.accessor('admin2', {
            header: 'Admin #2',
            size: 120,
        }),
        columnHelper.accessor('more', {
            header: 'More Detail',
            size: 120,
            enableSorting: false,
            enableColumnFilter: false,
            Cell: ({row}) => (
                <div className='text-white flex items-center justify-center cursor-pointer'>
                    <button
                    className='bg-gray-800 p-1 rounded-lg'
                    onClick={() => openMoreDetailHandler(row.original)}
                    >
                    <FontAwesomeIcon icon={faCircleInfo} size='xl'/>
                    </button>
                </div>
              ),
            }),
        ];

        const Peminjaman = [
        columnHelper.accessor('no', {
            header: 'No',
            size: 40,
        }),
        columnHelper.accessor('idticket', {
            header: 'ID Ticket',
            size: 120,
        }),
        columnHelper.accessor('asset', {
            header: 'ID Asset',
            size: 120,
        }),
        columnHelper.accessor('assetname', {
            header: 'Name',
            size: 120,
        }),
        columnHelper.accessor('leasedate', {
            header: 'Lease Date',
            size: 120,
        }),
        columnHelper.accessor('returndate', {
            header: 'Return Date',
            size: 120,
        }),
        columnHelper.accessor('name', {
            header: 'Username',
            size: 120,
        }),
        columnHelper.accessor('email', {
            header: 'Email',
            size: 120,
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            size: 120,
        }),
        columnHelper.accessor('more', {
            header: 'More Detail',
            size: 120,
            enableSorting: false,
            enableColumnFilter: false,
            Cell: ({row}) => (
                <div className='text-white flex items-center justify-center cursor-pointer'>
                    <button
                    className='bg-gray-800 p-1 rounded-lg'
                    onClick={() => openMoreDetailHandler(row.original)}
                    >
                    <FontAwesomeIcon icon={faCircleInfo} size='xl'/>
                    </button>
                </div>
                ),
            }),
        ];

    const HistoryMore = [
        {
            name: 'ID Asset',
            selector: (row) => row.asset,
            },
            {
            name: 'Name',
            selector: (row) => row.assetname,
            },
            {
            name: 'Description',
            selector: (row) => row.assetdescription,
            },
            {
            name: 'Brand',
            selector: (row) => row.assetbrand,
            },
            {
            name: 'Model',
            selector: (row) => row.assetmodel,
            },
            {
            name: 'Status',
            selector: (row) => row.assetstatus,
            },
            {
            name: 'Location',
            selector: (row) => row.assetlocation,
            },
            {
            name: 'Category',
            selector: (row) => row.assetcategory,
            },
            {
            name: 'SN',
            selector: (row) => row.assetsn,
            },
            {
            name: 'Photo',
            cell: (row) => (
                <div>
                  <img src={row.assetphoto} alt="Asset" className='rounded-lg shadow p-0.5 shadow-black' />
                </div>
              ),
            },
    ]

    return (
        <>
            <div className='p-2'>
                <div className='bg-black rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Selamat datang di History page :)</h2>
                </div>
            </div>
            
            <div className='p-2'>
                <div className='bg-white rounded mt-6 '>
                    <div className='flex justify-center'>
                        <h1 className="text-2xl font-semibold mt-6">Select Menu</h1>
                    </div>
                    <Tabs value={activeTab} className='p-2'>
                        <TabsHeader
                        className="rounded-none p-0 border-b border-blue-gray-50 mt-4 bg-white"
                        indicatorProps={{
                            className:
                            "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
                        }}
                        >
                        {data.map(({ label, value }) => (
                            <Tab
                            key={value}
                            value={value}
                            onClick={() => setActiveTab(value)}
                            className={activeTab === value ? "text-gray-800" : "hover:text-gray-500"}
                            >
                            {label}
                            </Tab>
                        ))}
                        </TabsHeader>
                        <TabsBody>
                        {data.map(({ value, content }) => (
                            <TabPanel key={value} value={value}>
                            {content}
                            </TabPanel>
                        ))}
                        </TabsBody>
                    </Tabs>
                </div>
            </div>
            
            {isDesktopView && (
                <Modal
                    isOpen={showMoreDetail}
                    onRequestClose={closeMoreDetailHandler}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed z-10 inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                    className={`modal-content bg-transparent p-4 w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2 py-4 bg-white'>
                        <h1>Ini adalah detail lengkap asset</h1>
                            <DataTable
                                columns={HistoryMore}
                                data={selectedAssetDetails}
                                highlightOnHover
                            />
                        <button onClick={closeMoreDetailHandler} className="main-btn mt-4">
                            Close
                        </button>
                    </div>
                </Modal>
            )}
            {!isDesktopView && (
                <Modal
                    isOpen={showMoreDetail}
                    onRequestClose={closeMoreDetailHandler}
                    contentLabel="Contoh Modal"
                    overlayClassName="fixed z-10 inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                    className='modal-content bg-transparent p-4 w-screen'
                    shouldCloseOnOverlayClick={false}
                    >
                    <div className='p-2 py-4 bg-white'>
                        <h1>Ini adalah detail lengkap asset</h1>
                            <DataTable
                                columns={HistoryMore}
                                data={selectedAssetDetails}
                                highlightOnHover
                            />
                        <button onClick={closeMoreDetailHandler} className="main-btn mt-4">
                            Close
                        </button>
                    </div>
                </Modal>
            )}
        </>
    )
}
export default History