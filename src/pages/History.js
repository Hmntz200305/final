import React, { useEffect, useState, useRef } from 'react'
import { faEllipsis, faFileCsv, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../AuthContext';
import { MaterialReactTable, createMRTColumnHelper, useMaterialReactTable } from 'material-react-table';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel, Button } from "@material-tailwind/react";
Modal.setAppElement('#root');

const History = () => {

    const LogContent = () => {

        const columnLog = [
            columnHelper.accessor('no', {
                header: 'No',
                size: 150,
            }),
            columnHelper.accessor('idticket', {
                header: 'ID Ticket',
                size: 150,
            }),
            columnHelper.accessor('asset', {
                header: 'ID Asset',
                size: 150,
            }),
            columnHelper.accessor('name', {
                header: 'Name',
                size: 150,
            }),
            columnHelper.accessor('leasedate', {
                header: 'Lease Date',
                size: 150,
            }),
            columnHelper.accessor('returndate', {
                header: 'Return Date',
                size: 150,
            }),
            columnHelper.accessor('location', {
                header: 'Location',
                size: 150,
            }),
            columnHelper.accessor('note', {
                header: 'Note',
                size: 250,
            }),
            columnHelper.accessor('email', {
                header: 'Email',
                size: 150,
            }),
            columnHelper.accessor('status', {
                header: 'Status',
                size: 150,
            }),
            columnHelper.accessor('admin1', {
                header: 'Approver #1',
                size: 150,
            }),
            columnHelper.accessor('admin2', {
                header: 'Approver #2',
                size: 150,
            }),
            columnHelper.accessor('more', {
                header: 'More Detail',
                size: 50,
                enableSorting: false,
                enableColumnFilter: false,
                Cell: ({row}) => (
                    <div className='text-white flex items-center justify-center cursor-pointer'>
                        <button
                        className='bg-gray-800 py-[1px] px-3 rounded-xl'
                        onClick={() => openMoreDetailHandler(row.original)}
                        >
                            <FontAwesomeIcon icon={faEllipsis} size='xl'/>
                        </button>
                    </div>
                  ),
                }),
            ];
    
        const tableLog = useMaterialReactTable({
            columns: columnLog,
            data: HistoryTicket || [],
            enableRowSelection: true,
            enableFullScreenToggle: false,
            positionToolbarAlertBanner: 'none',
            displayColumnDefOptions: {
                'mrt-row-select': {
                    size: 20,
                    grow: false,
                },
                'mrt-row-numbers': {
                    size: 20,
                    grow: true,
                },
            },
            muiTablePaperProps: {
                elevation: 0,
                sx: {
                    borderRadius: '0',
                    border: '1px solid #ffffff',
                },
            },
            muiTableBodyProps: {
                sx: {
                    '& tr:nth-of-type(odd) > td': {
                    backgroundColor: '#f5f5f5',
                    },
                },
            },
            muiTopToolbarProps: {
                sx: {
                    backgroundColor: '#1f2937',
                },
            },
            muiBottomToolbarProps: {
                sx: {
                    backgroundColor: '#1f2937',
                },
            },
            muiTableHeadCellProps: {
                sx: {
                    fontWeight: 'bold',
                    fontSize: '14px',
                },
            },
            muiSearchTextFieldProps: {
                size: 'small',
                variant: 'outlined',
            },
            paginationDisplayMode: 'pages',
            muiPaginationProps: {
                color: 'standard',
                rowsPerPageOptions: [2, 5, 10, 20, 50, 100],
                pageSize: 5,
                shape: 'rounded',
                variant: 'outlined',
            },
            renderTopToolbarCustomActions: ({ table }) => {
                tableRef.current = table;
                return null; 
            },
        });

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
              filename: 'History Log'
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
          
            doc.save('History Log.pdf');
        };
        

        return (
            <div className='flex flex-col p-2 gap-1'>
                <p className='mb-4'>Please select the desired export format:</p>
                <div className='flex space-x-[1px]'>
                    <Button className='bg-gray-800 cursor-default'>
                        <FontAwesomeIcon icon={faFileCsv} size='xl' />
                    </Button>
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
                    <Button className='bg-gray-800 cursor-default'>
                        <FontAwesomeIcon icon={faFilePdf} size='xl' />
                    </Button>
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
                        table={tableLog}
                    />
                </div>
            </div>
        )
    };

    const PeminjamanContent = () => {

        const columnPeminjaman = [
            columnHelper.accessor('no', {
                header: 'No',
                size: 150,
            }),
            columnHelper.accessor('idticket', {
                header: 'ID Ticket',
                size: 150,
            }),
            columnHelper.accessor('asset', {
                header: 'ID Asset',
                size: 150,
            }),
            columnHelper.accessor('assetname', {
                header: 'Name',
                size: 150,
            }),
            columnHelper.accessor('leasedate', {
                header: 'Lease Date',
                size: 150,
            }),
            columnHelper.accessor('returndate', {
                header: 'Return Date',
                size: 150,
            }),
            columnHelper.accessor('name', {
                header: 'Username',
                size: 150,
            }),
            columnHelper.accessor('email', {
                header: 'Email',
                size: 150,
            }),
            columnHelper.accessor('status', {
                header: 'Status',
                size: 150,
            }),
            columnHelper.accessor('more', {
                header: 'More Detail',
                size: 50,
                enableSorting: false,
                enableColumnFilter: false,
                Cell: ({row}) => (
                    <div className='text-white flex items-center justify-center cursor-pointer'>
                        <button
                        className='bg-gray-800 py-[1px] px-3 rounded-xl'
                        onClick={() => openMoreDetailHandler(row.original)}
                        >
                        <FontAwesomeIcon icon={faEllipsis} size='xl'/>
                        </button>
                    </div>
                    ),
                }),
            ];
    
        const tablePeminjaman = useMaterialReactTable({
            columns: columnPeminjaman,
            data: HistoryLoanData || [],
            enableRowSelection: true,
            enableFullScreenToggle: false,
            positionToolbarAlertBanner: 'none',
            displayColumnDefOptions: {
                'mrt-row-select': {
                    size: 20,
                    grow: false,
                },
                'mrt-row-numbers': {
                    size: 20,
                    grow: true,
                },
            },
            muiTablePaperProps: {
                elevation: 0,
                sx: {
                    borderRadius: '0',
                    border: '1px solid #ffffff',
                },
            },
            muiTableBodyProps: {
                sx: {
                    '& tr:nth-of-type(odd) > td': {
                    backgroundColor: '#f5f5f5',
                    },
                },
            },
            muiTopToolbarProps: {
                sx: {
                    backgroundColor: '#1f2937',
                },
            },
            muiBottomToolbarProps: {
                sx: {
                    backgroundColor: '#1f2937',
                },
            },
            muiTableHeadCellProps: {
                sx: {
                    fontWeight: 'bold',
                    fontSize: '14px',
                },
            },
            muiSearchTextFieldProps: {
                size: 'small',
                variant: 'outlined',
            },
            paginationDisplayMode: 'pages',
            muiPaginationProps: {
                color: 'standard',
                rowsPerPageOptions: [2, 5, 10, 20, 50, 100],
                pageSize: 5,
                shape: 'rounded',
                variant: 'outlined',
            },
            renderTopToolbarCustomActions: ({ table }) => {
                tableRef.current = table;
                return null; 
            },
        });

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
              filename: 'History Peminjaman'
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
          
            doc.save('History Peminjaman.pdf');
        };

        return (
            <div className='flex flex-col p-2 gap-1'>
                <p className='mb-4'>Please select the desired export format: </p>
                <div className='flex space-x-[1px]'>
                    <Button className='bg-gray-800 cursor-default'>
                        <FontAwesomeIcon icon={faFileCsv} size='xl' />
                    </Button>
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
                    <Button className='bg-gray-800 cursor-default'>
                        <FontAwesomeIcon icon={faFilePdf} size='xl' />
                    </Button>
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
                        table={tablePeminjaman}
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

    const [showMoreDetail, setShowMoreDetail] = useState(false);

    const openMoreDetailHandler = (row) => {
        setShowMoreDetail(true);
        setSelectedAssetDetails([row]);
    };
    const closeMoreDetailHandler = (row) => {
        setShowMoreDetail(false)
    }
      
    const columnHelper = createMRTColumnHelper();
    const columnMore = [
        columnHelper.accessor('asset', {
            header: 'ID Asset',
            size: 150,
        }),
        columnHelper.accessor('assetname', {
            header: 'Name',
            size: 150,
        }),
        columnHelper.accessor('assetdescription', {
            header: 'Description',
            size: 250,
        }),
        columnHelper.accessor('assetbrand', {
            header: 'Brand',
            size: 150,
        }),
        columnHelper.accessor('assetmodel', {
            header: 'Model',
            size: 150,
        }),
        columnHelper.accessor('assetstatus', {
            header: 'Status',
            size: 150,
        }),
        columnHelper.accessor('assetlocation', {
            header: 'Location',
            size: 150,
        }),
        columnHelper.accessor('assetcategory', {
            header: 'Category',
            size: 150,
        }),
        columnHelper.accessor('assetsn', {
            header: 'Serial Number',
            size: 150,
        }),
        columnHelper.accessor('image_path', {
            header: 'Photo',
            size: 100,
            Cell: ({ row }) => (
                <div className='cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105'>
                  <img src={row.original.assetphoto} className='rounded-lg shadow p-0.5 shadow-black' />
                </div>
            ),
        }),
        ];

    const tableMore = useMaterialReactTable({
        columns: columnMore,
        data: selectedAssetDetails || [],
        enableTopToolbar: false,
        enableBottomToolbar: false,
        enableColumnActions: false,
        enableSorting: false,
        displayColumnDefOptions: {
            'mrt-row-select': {
                size: 20,
                grow: false,
            },
            'mrt-row-numbers': {
                size: 20,
                grow: true,
            },
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
                border: '1px solid #ffffff',
            },
        },
        muiTableBodyProps: {
            sx: {
                '& tr:nth-of-type(odd) > td': {
                backgroundColor: '#f5f5f5',
                },
            },
        },
    });

    return (
        <>
            <div className='p-2'>
                <div className='bg-gray-800 rounded-2xl mb-8 p-4 shadow'>
                    <h2 className='text-white'>Welcome, History page:)</h2>
                </div>
                <div className='bg-white rounded'>
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
                            <p>The following is a complete asset detail</p>
                            <MaterialReactTable 
                                table={tableMore}
                            />
                        <Button onClick={closeMoreDetailHandler} className="bg-gray-800 mt-4">
                            Close
                        </Button>
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
                    <p>The following is a complete asset detail</p>
                            <MaterialReactTable 
                                table={tableMore}
                            />
                        <Button onClick={closeMoreDetailHandler} className="bg-gray-800 mt-4">
                            Close
                        </Button>
                    </div>
                </Modal>
            )}
        </>
    )
}
export default History