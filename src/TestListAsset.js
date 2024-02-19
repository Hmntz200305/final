import './Mrt.css'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import 'react-data-table-component-extensions/dist/index.css';
import {  faFileCsv, faPenToSquare, faTrash, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from './AuthContext';
import { useDropzone } from 'react-dropzone';
import { MaterialReactTable, useMaterialReactTable, createMRTColumnHelper } from 'material-react-table';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Modal from 'react-modal';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel, Input, Menu, MenuList, MenuItem, MenuHandler, Button } from "@material-tailwind/react";

Modal.setAppElement('#root');

const ListAsset = () => {

  const ExportContent = () => {
    
    const handleExportRowsCsv = (rows) => {
      if (rows.length === 0) {
        console.error('Tidak ada data yang dipilih untuk diekspor CSV.');
        return;
      }
      const rowData = rows.map((row) => {
        const dataRow = row.original;
        return {
          no: dataRow.no,
          id: dataRow.id,
          name: dataRow.name,
          description: dataRow.description,
          brand: dataRow.brand,
          model: dataRow.model,
          status: dataRow.status,
          location: dataRow.location,
          category: dataRow.category,
          sn: dataRow.sn,
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
    
      const handleExportRowsPdf = (rows) => {
      if (rows.length === 0) {
        // Tidak ada data yang dipilih, handle secara khusus (misalnya, tampilkan pesan kesalahan)
        console.error('Tidak ada data yang dipilih untuk diekspor PDF.');
        return;
      }
      const doc = new jsPDF();
      const tableData = rows.map((row) => {
        const dataRow = row.original;
        return [dataRow.no, dataRow.id, dataRow.name, dataRow.description, dataRow.brand, dataRow.model, dataRow.status, dataRow.location, dataRow.category, dataRow.sn,];
      });
    
      const tableHeaders = ['No', 'ID Asset', 'Name', 'Description', 'Brand', 'Model', 'Status', 'Location', 'Category', 'Serial Number'];
    
      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
      });
    
      doc.save('mrt-pdf-example.pdf');
    };

    return (
      <div className='flex flex-col p-2 gap-1'>
        <p className='mb-4'>Silahkan pilih ingin mengexport dengan apa </p>
        <div className='flex space-x-[1px]'>
          <Button className='bg-gray-800 cursor-default'>
            <FontAwesomeIcon icon={faFileCsv} size='xl' />
          </Button>
          <div className='flex flex-grow items-center border rounded border-gray-800'>
            <button 
              className='flex-grow rounded py-[8px] text-black hover:bg-gray-800 hover:text-white'
              // disabled={tableRef.current?.getPrePaginationRowModel().rows.length === 0} 
              onClick={() => handleExportRowsCsv(tableRef.current?.getPrePaginationRowModel().rows)}
            >
              by All Rows
            </button>
            <button
              className='flex-grow rounded py-[8px] text-black hover:bg-gray-800 hover:text-white' 
              // disabled={tableRef.current?.getRowModel().rows.length === 0}
              onClick={() => handleExportRowsCsv(tableRef.current?.getRowModel().rows)}
            >
              by Page Rows
            </button>
            <button 
              className='flex-grow rounded py-[8px] text-black hover:bg-gray-800 hover:text-white' 
              // disabled={!tableRef.current?.getIsSomeRowsSelected() && !tableRef.current?.getIsAllRowsSelected()} 
              onClick={() => handleExportRowsCsv(tableRef.current?.getSelectedRowModel().rows)}
            >
              by Selected Rows
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
              onClick={() => handleExportRowsPdf(tableRef.current?.getPrePaginationRowModel().rows)}
            >
              by All Rows
            </button>
            <button 
              className='flex-grow rounded py-[8px] text-black hover:bg-gray-800 hover:text-white' 
              // disabled={tableRef.current?.getRowModel().rows.length === 0} 
              onClick={() => handleExportRowsPdf(tableRef.current?.getRowModel().rows)}
            >
              by Page Rows
            </button>
            <button 
            className='flex-grow items-center rounded py-[8px] text-black hover:bg-gray-800 hover:text-white' 
            // disabled={!tableRef.current?.getIsSomeRowsSelected() && !tableRef.current?.getIsAllRowsSelected()} 
            onClick={() => handleExportRowsPdf(tableRef.current?.getSelectedRowModel().rows)}
            >
              by Selected Rows
            </button>
          </div>
        </div>
      </div>
    )
  }

  const ImportContent = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileUpload = async () => {
      if (!selectedFile) {
        setNotification('Pilih File !');
        setNotificationStatus(true);
        setNotificationInfo('error');
        return;
      }
    
      const formData = new FormData();
      formData.append('csvFile', uploadedFile);
    
      try {
        setIsLoading(true);
        const response = await fetch('https://asset.lintasmediadanawa.com:8443/api/importcsv', {
          method: 'POST',
          body: formData,
        });
    
        if (response.ok) {
          const data = await response.json();
          refreshAssetData();
          setNotification(data.message);
          setNotificationStatus(true);
          setNotificationInfo(data.Status);
        } else {
          const data = await response.json();
          setNotification(data.message);
          setNotificationStatus(true);
          setNotificationInfo(data.Status);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false); // Atur status loading menjadi false
      }
    };
      
      const handleDownload = () => {
        const fileURL = 'https://asset.lintasmediadanawa.com:8443/static/template/TemplateImport.xlsx'; // Gantilah dengan URL file yang sesuai
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = 'TemplateImport.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
      
      const handleUpload = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setUploadedFile(file);
      };

      const onDrop = useCallback(acceptedFiles => {
        const allowedFormats = ['.csv', '.xlsx'];
        const isFormatValid = acceptedFiles.every(file => allowedFormats.includes(file.name.slice(file.name.lastIndexOf('.'))));

        const maxFileSize = 10 * 1024 * 1024;
        const isSizeValid = acceptedFiles.every(file => file.size <= maxFileSize);

        if (isFormatValid && isSizeValid) {
          setSelectedFile(acceptedFiles[0]?.name);
          handleUpload(acceptedFiles);
        } else {
          alert('Invalid file format or size. Please select a valid file.');
        }
      }, []);

      const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});


    return (
      <>
        <div className='flex flex-col p-2'>
          <p className='mb-4'>Silahkan download terlebih dahulu template untuk importnya:
            <span className='font-semibold underline cursor-pointer ml-2' onClick={handleDownload}>Download</span>
          </p>
          <div className='flex items-center'>
            <div {...getRootProps()} className='flex flex-col flex-grow items-center justify-center h-36 w-full border-2 border-gray-800 border-dashed rounded-lg cursor-pointer'>
              <svg className="w-8 h-8 mb-4 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <p>Drop the files here ...</p> 
                  :
                  <p><span className='font-semibold'>Click to upload</span> or drag and drop</p>
              }
              <p className="text-xs text-gray-800 mt-2">Only CSV/XLSX (MAX. 10MB)</p>
              <p className='text-gray text-sm'>Selected File: <span className='underline'>{selectedFile}</span></p>
            </div>
          </div>
          <Button className='mt-2' onClick={handleFileUpload} disabled={isLoading}>{isLoading ? 'Uploading...' : 'Upload'}</Button>
        </div>
      </>
    )
  }

  const { token, Role, DataListAsset, refreshAssetData, refreshStatusList, StatusOptions, LocationOptions, refreshLocationList, refreshCategoryList, CategoryOptions, setNotification, setNotificationInfo, setNotificationStatus, openSidebar, setOpenSidebar, ListCategory, refreshListCategory, ListStatus, refreshListStatus, ListLocation, refreshListLocation  } = useAuth();
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [fileInput, setFileInput] = useState(null);
  const [inputValueStatus, setInputValueStatus] = useState('');
  const [inputValueLocation, setInputValueLocation] = useState('');
  const [inputValueCategory, setInputValueCategory] = useState('');
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 768;
  const [isDesktopView, setIsDesktopView] = useState(window.innerWidth > 768);
  const [modalQr, setModalQr] = useState(false);
  const [QRCodePath, setQRCodePath] = useState('');
  const [QRCodeName, setQRCodeName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const tableRef = useRef(null);

  const openModalQr = (QRPath, QRName) => {
    setModalQr(true);
    setQRCodePath(QRPath);
    setQRCodeName(QRName);
  }
  const closeModalQr = () => {
    setModalQr(false);
    setQRCodePath('');
  }

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

  const openModalEdit = (row) => {
    setModalEdit(true);
    setSelectedAsset(row);
  }
  const closeModalEdit = () => {
    setModalEdit(false);
    setSelectedAsset(null);
  }

  const openModalDelete = (no) => {
    setModalDelete(true);
    setSelectedAssetId(no)
  }
  const closeModalDelete = () => {
    setModalDelete(false);
  }

  const handleOptionSelectStatus = (option) => {
    setInputValueStatus(option); // Menetapkan nilai pada input
    setSelectedAsset((prevAsset) => ({ ...prevAsset, status: option })); // Menetapkan nilai pada selectedAsset
  };
  const handleOptionSelectLocation = (option) => {
    setInputValueLocation(option);
    setSelectedAsset((prevAsset) => ({ ...prevAsset, location: option }));
  };
  const handleOptionSelectCategory = (option) => {
    setInputValueCategory(option);
    setSelectedAsset((prevAsset) => ({ ...prevAsset, category: option }));
  };
  
  useEffect(() => {
    refreshAssetData();
    refreshStatusList();
    refreshLocationList();
    refreshCategoryList();
    refreshListCategory();
    refreshListStatus();
    refreshListLocation();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
      if (allowedExtensions.test(file.name)) {
        setFileInput(file);
      } else {
        alert('Invalid file type. Please select a valid image file.');
        e.target.value = null;
        setFileInput(null);
      }
    }
  };  

  const editAsset = async (token) => {
    const formData = new FormData();

    formData.append('id', selectedAsset.id);
    formData.append('name', selectedAsset.name);
    formData.append('description', selectedAsset.description);
    formData.append('brand', selectedAsset.brand);
    formData.append('model', selectedAsset.model);
    formData.append('status', selectedAsset.status);
    formData.append('location', selectedAsset.location);
    formData.append('category', selectedAsset.category);
    formData.append('sn', selectedAsset.sn);

    if (fileInput) {
      formData.append('addAssetImage', fileInput); 
    }

    try {
      const response = await fetch(`https://asset.lintasmediadanawa.com:8443/api/edit-asset/${selectedAsset.no}`, {
        method: 'PUT',
        headers: {
          Authorization: token,
        },
        body: formData,
      });
      
      if (response.status === 200) {
        const data = await response.json();
        setNotification(data.message);
        setNotificationStatus(true);
        setNotificationInfo(data.Status);
        setModalEdit(false);
        refreshAssetData();
      } else {
        const data = await response.json();
        setNotification(data.message);
        setNotificationStatus(true);
        setNotificationInfo(data.Status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
    
  const deleteAsset = async (id) => {
    try {
      const response = await fetch(`https://asset.lintasmediadanawa.com:8443/api/delete-asset/${id}`, {
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
        setModalDelete(false);
        refreshAssetData();
      } else {
        const data = await response.json();
        setNotification(data.message);
        setNotificationStatus(true);
        setNotificationInfo(data.Status);
      } 
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDownloadQRCode = async (url, name) => {
    try {
    const image = await fetch(url);
    const imageBlob = await image.blob();
    const imageURL = URL.createObjectURL(imageBlob);

    const link = document.createElement('a');
    link.href = imageURL;
    link.download = name + '.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(imageURL);
    } catch (error) {
    console.error('Error downloading image:', error);
    }
  };

  const columnHelper = createMRTColumnHelper();
  const columns = [
    columnHelper.accessor('row', {
      header: 'No',
      size: 150,
    }),
    columnHelper.accessor('id', {
      header: 'ID Asset',
      size: 150,
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      size: 250,
    }),
    columnHelper.accessor('brand', {
      header: 'Brand',
      size: 150,
    }),
    columnHelper.accessor('model', {
      header: 'Model',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      size: 150,
      filterVariant: 'select',
      filterSelectOptions: ListStatus,
    }),
    columnHelper.accessor('location', {
      header: 'Location',
      size: 150,
      filterVariant: 'select',
      filterSelectOptions: ListLocation,
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      size: 150,
      filterVariant: 'select',
      filterSelectOptions: ListCategory,
    }),
    columnHelper.accessor('sn', {
      header: 'SN',
      size: 150,
    }),
    columnHelper.accessor('image_path', {
      header: 'Photo',
      size: 100,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <img src={row.original.image_path} alt="Asset" style={{ width: '70px', height: 'auto' }} />
      ),
    }),
    columnHelper.accessor('qrcode_path', {
      header: 'QRCode',
      size: 100,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <div className='cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105'>
          <img src={row.original.qrcode_path} onClick={() => openModalQr(row.original.qrcode_path, row.original.id)} style={{ width: '70px', height: 'auto' }} />
        </div>
      ),
    }),
    columnHelper.accessor('action', {
      header:'Action',
      size: 100,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({row}) => (
        <div className='text-white'>
          <button className='bg-green-500 p-2 rounded-lg hover:bg-green-700 m-0.5' onClick={() => openModalEdit(row.original)}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button className='bg-red-500 p-2 rounded-lg hover:bg-red-700 m-0.5' onClick={() => openModalDelete(row.original.no)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
        ),
      }),
  ];


  const tableListAsset = useMaterialReactTable({
    columns,
    data: DataListAsset || [],
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

  const [activeTab, setActiveTab] = useState("export");
    const data = [
    {
        label: "Export",
        value: "export",
        content: <ExportContent />,
    },
    {
        label: "Import",
        value: "import",
        content: <ImportContent />,
    },
  ];

  return (
    <>
      <div className='p-2'>
        <div className='bg-gray-800 mb-5 rounded-2xl p-4 shadow'>
          <h2 className='text-white'>Test page hai halo:)</h2>
        </div>
      </div>

      {Role === 2 || Role === 1 ? (
        <div className='p-2'>
          <div className='bg-white rounded'>
              <div className='flex justify-center'>
                  <h1 className="text-2xl font-semibold mt-6">Select Action</h1>
              </div>
              <Tabs value={activeTab} className='p-2'>
                  <TabsHeader className="rounded-none p-0 border-b border-blue-gray-50 mt-4 bg-white"
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
      ) : null}
    
      <>
      {isDesktopView && (
        <Modal
          isOpen={modalEdit}
          onRequestClose={closeModalEdit}
          contentLabel="Contoh Modal"
          overlayClassName="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center"
          className={`modal-content bg-transparent p-4 w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
          shouldCloseOnOverlayClick={false}
        >
          <div className='p-2'>
            <div className='bg-white rounded-2xl shadow p-4 space-y-4'>
              <div className='flex p-4 items-baseline max-w-fit rounded-2xl'>
                <h2 className='text-black text-2xl'>Edit Asset Form
                  <span className='text-black text-sm ml-2'>Input Asset data below:</span>
                </h2>
              </div>
              <div className='flex items-center gap-4'>
                <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>ID</label>
                <Input 
                  variant="outline"
                  label="Input Asset ID"
                  value={selectedAsset?.id}
                  onChange={(e) => setSelectedAsset({ ...selectedAsset, id: e.target.value })}
                />
              </div>
              <div className='flex items-center gap-4'>
                <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Name</label>
                <Input
                  variant="outline"
                  label="Input Asset Name"
                  value={selectedAsset?.name}
                  onChange={(e) => setSelectedAsset({ ...selectedAsset, name: e.target.value })}
                />
              </div>
              <div className='flex items-center gap-4'>
                <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Description</label>
                <Input 
                  variant="outline" 
                  label="Input Asset Description"
                  value={selectedAsset?.description}
                  onChange={(e) => setSelectedAsset({ ...selectedAsset, description: e.target.value })}
                />
              </div>
              <div className='flex items-center gap-4'>
                <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Brand</label>
                <Input 
                  variant="outline" 
                  label="Input Asset Brand" 
                  value={selectedAsset?.brand}
                  onChange={(e) => setSelectedAsset({ ...selectedAsset, brand: e.target.value })}
                />
              </div>
              <div className='flex items-center gap-4'>
                <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Model</label>
                <Input 
                  variant="outline" 
                  label="Input Asset Model"
                  value={selectedAsset?.model}
                  onChange={(e) => setSelectedAsset({ ...selectedAsset, model: e.target.value })}
                />
              </div>

              <div className='flex items-center gap-4'>
                <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Status</label>
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
                      {StatusOptions.map((status) => (
                        <MenuItem key={status.id} value={status.status} onClick={() => handleOptionSelectStatus(status.status)}>
                          {status.status}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                  <Input 
                    className='w-full rounded-l-none'
                    type="text"
                    value={selectedAsset?.status}
                    onChange={(e) => setInputValueStatus(e.target.value)}
                    disabled
                    required
                    label='Input Asset Status'
                  />
                </div>
              </div>

              <div className='flex items-center gap-4'>
                <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Location</label>
                <div className='flex items-center w-full relative'>
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
                      {LocationOptions.map((location) => (
                        <MenuItem value={location.location} key={location.id} onClick={() => handleOptionSelectLocation(location.location)}>
                          {location.location}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                  <Input
                    className='w-full rounded-l-none'
                    type="text"
                    value={selectedAsset?.location}
                    onChange={(e) => setInputValueLocation(e.target.value)}
                    disabled
                    required
                    label='Input Asset Location'
                  />
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Category</label>
                <div className='flex items-center w-full relative'>
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
                      {CategoryOptions.map((category) => (
                        <MenuItem value={category.category} key={category.id} onClick={() => handleOptionSelectCategory(category.category)}>
                          {category.category}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                  <Input
                    className='w-full rounded-l-none'
                    type="text"
                    value={selectedAsset?.category}
                    onChange={(e) => setInputValueCategory(e.target.value)}
                    disabled
                    required
                    label='Input Asset Category'
                  />
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Serial Number</label>
                <Input 
                  variant="outline" 
                  label="Input Asset Serial Number"
                  value={selectedAsset?.sn}
                  onChange={(e) => setSelectedAsset({ ...selectedAsset, sn: e.target.value })}
                />
              </div>
              <div className='flex items-center gap-4'>
                <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Photo</label>
                <Input type='file' accept='image/*' variant="outline" label="Input Asset Photo" name='photo' onChange={handleImageChange} />
              </div>
              <div className='flex gap-1 justify-end'>
                <Button type="button" className='' id="edit-button" onClick={closeModalEdit}>Cancel</Button>
                <Button type="button" className='' id="edit-button" onClick={() => editAsset(token)}>Edit Asset</Button>
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
          overlayClassName="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center"
          className='modal-content bg-transparent p-4 w-screen'
          shouldCloseOnOverlayClick={false}
        >
          <div className='p-2'>
            <div className='bg-white rounded-2xl shadow p-4 space-y-4'>
              <div className='flex p-4 items-baseline max-w-fit rounded-2xl'>
                <h2 className='text-black text-2xl'>Add Asset Form
                  <span className='text-black text-sm ml-2'>Input Asset data below:</span>
                </h2>
              </div>
              <div className='flex items-center gap-4'>
                <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>ID</label>
                <Input 
                  variant="outline"
                  label="Input Asset ID"
                  value={selectedAsset?.id}
                  onChange={(e) => setSelectedAsset({ ...selectedAsset, id: e.target.value })}
                />
              </div>
              <div className='flex items-center gap-4'>
                <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Name</label>
                <Input
                  variant="outline"
                  label="Input Asset Name"
                  value={selectedAsset?.name}
                  onChange={(e) => setSelectedAsset({ ...selectedAsset, name: e.target.value })}
                />
              </div>
              <div className='flex items-center gap-4'>
                <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Description</label>
                <Input 
                  variant="outline" 
                  label="Input Asset Description"
                  value={selectedAsset?.description}
                  onChange={(e) => setSelectedAsset({ ...selectedAsset, description: e.target.value })}
                />
              </div>
              <div className='flex items-center gap-4'>
                <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Brand</label>
                <Input 
                  variant="outline" 
                  label="Input Asset Brand" 
                  value={selectedAsset?.brand}
                  onChange={(e) => setSelectedAsset({ ...selectedAsset, brand: e.target.value })}
                />
              </div>
              <div className='flex items-center gap-4'>
                <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Model</label>
                <Input 
                  variant="outline" 
                  label="Input Asset Model"
                  value={selectedAsset?.model}
                  onChange={(e) => setSelectedAsset({ ...selectedAsset, model: e.target.value })}
                />
              </div>

              <div className='flex items-center gap-4'>
                <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Status</label>
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
                      {StatusOptions.map((status) => (
                        <MenuItem key={status.id} value={status.status} onClick={() => handleOptionSelectStatus(status.status)}>
                          {status.status}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                  <Input 
                    className='w-full rounded-l-none'
                    type="text"
                    value={selectedAsset?.status}
                    onChange={(e) => setInputValueStatus(e.target.value)}
                    disabled
                    required
                    label='Input Asset Status'
                  />
                </div>
              </div>

              <div className='flex items-center gap-4'>
                <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Location</label>
                <div className='flex items-center w-full relative'>
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
                      {LocationOptions.map((location) => (
                        <MenuItem value={location.location} key={location.id} onClick={() => handleOptionSelectLocation(location.location)}>
                          {location.location}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                  <Input
                    className='w-full rounded-l-none'
                    type="text"
                    value={selectedAsset?.location}
                    onChange={(e) => setInputValueLocation(e.target.value)}
                    disabled
                    required
                    label='Input Asset Location'
                  />
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Category</label>
                <div className='flex items-center w-full relative'>
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
                      {CategoryOptions.map((category) => (
                        <MenuItem value={category.category} key={category.id} onClick={() => handleOptionSelectCategory(category.category)}>
                          {category.category}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                  <Input
                    className='w-full rounded-l-none'
                    type="text"
                    value={selectedAsset?.category}
                    onChange={(e) => setInputValueCategory(e.target.value)}
                    disabled
                    required
                    label='Input Asset Category'
                  />
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Serial Number</label>
                <Input 
                  variant="outline" 
                  label="Input Asset Serial Number"
                  value={selectedAsset?.sn}
                  onChange={(e) => setSelectedAsset({ ...selectedAsset, sn: e.target.value })}
                />
              </div>
              <div className='flex items-center gap-4'>
                <label className={`pr-4 w-32 text-right ${isMobile ? 'hidden lg:inline' : ''}`}>Photo</label>
                <Input type='file' accept='image/*' variant="outline" label="Input Asset Photo" name='photo' onChange={handleImageChange} />
              </div>
              <div className='flex gap-1 justify-end'>
                <Button type="button" className='' id="edit-button" onClick={closeModalEdit}>Cancel</Button>
                <Button type="button" className='' id="edit-button" onClick={() => editAsset(token)}>Edit Asset</Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
      
      {isDesktopView && (
        <Modal 
          isOpen={modalQr}
          onRequestClose={closeModalQr}
          overlayClassName="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center border-none"
          className={`border-none bg-transparent p-4 w-3/2 ${openSidebar ? ' pl-[315px]' : ''}`}
          shouldCloseOnOverlayClick={false}
        >
          <div className='p-2 bg-[#efefef] flex justify-center items-center flex-col'>
            <img src={QRCodePath} alt="QRCode" style={{height: '500px'}} />
            <div className='flex mt-4 space-x-4'>
              <Button onClick={() => handleDownloadQRCode(QRCodePath, QRCodeName)}>Download</Button>
              <Button onClick={closeModalQr}>CLose</Button>
            </div>
          </div>
        </Modal>
      )}
      {!isDesktopView && (
        <Modal 
          isOpen={modalQr}
          onRequestClose={closeModalQr}
          overlayClassName="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center border-none"
          className='modal-content bg-transparent p-4 w-screen border-none'
          shouldCloseOnOverlayClick={false}
        >
          <div className='p-2 bg-[#efefef] flex justify-center items-center flex-col'>
            <img src={QRCodePath} alt="QRCode" />
            <div className='flex mt-4 space-x-4'>
              <Button onClick={() => handleDownloadQRCode(QRCodePath, QRCodeName)}>Download</Button>
              <Button onClick={closeModalQr}>CLose</Button>
            </div>
          </div>
        </Modal>
      )}

      {isDesktopView && (
        <Modal 
          isOpen={modalDelete}
          onRequestClose={closeModalDelete}
          contentLabel="Contoh Modal"
          overlayClassName="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center"
          className={`modal-content bg-transparent p-4 w-screen ${openSidebar ? ' pl-[315px]' : ''}`}
          shouldCloseOnOverlayClick={false}
        >
          <div className='p-2'>
            <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
              <div className='flex flex-col text-center mb-2'>
                <h1 className="text-2xl font-semibold">Select Action</h1>
                <p>Apakah anda yakin ingin menghapus Asset ini?</p>
              </div>
              <div className="flex space-x-4 mt-5">
                <Button className="" onClick={closeModalDelete}>
                  Cancel
                </Button>
                <Button className="" onClick={() => deleteAsset(selectedAssetId)}>
                  Delete
                </Button>
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
          overlayClassName="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center"
          className='modal-content bg-transparent p-4 w-screen'
          shouldCloseOnOverlayClick={false}
        >
          <div className='p-2'>
            <div className="flex flex-col items-center justify-center bg-white p-2 shadow-xl rounded-2xl">
              <div className='flex flex-col text-center mb-2'>
                <h1 className="text-2xl font-semibold">Select Action</h1>
                <p>Apakah anda yakin ingin menghapus Asset ini?</p>
              </div>
              <div className="flex space-x-4 mt-5">
                <Button className="" onClick={closeModalDelete}>
                  Cancel
                </Button>
                <Button className="" onClick={() => deleteAsset(selectedAssetId)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
      </>

        <div className='p-2'>
            <MaterialReactTable 
                table={tableListAsset}
            />
        </div>
    </>
  );
};

export default ListAsset;
  