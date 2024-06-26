'use client'

import React, { useState, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button, Modal, Badge, Form, Dropdown, Col, Row } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';

import { GraphQLService } from '../graphql/graphql.service';

import { HttpBackendService } from '../services/httpbackend.service';

const { v4: uuidv4 } = require('uuid');

const Business = () => {

  const [rowData, setRowData] = useState([]);
  const [validated, setValidated] = useState(false);
  const [editedStock, setEditedStock] = useState(null);
  const [modalMode, setModalMode] = useState("Add");
  const [deletedStock, setDeletedStock] = useState({});
  const [editedDocument, setEditedDocument] = useState(null);
  const [currenciesList, setCurrenciesList] = useState([]);
  const [exchangesList, setExchangesList] = useState([]);
  const [sectorsList, setSectorsList] = useState([]);

  const [selectedBusinessCategoryId, setSelectedBusinessCategoryId] = useState([]);
  const [businessCategoriesList, setBusinessCategoriesList] = useState([]);
  const [businessSubCategoriesList, setBusinessSubCategoriesList] = useState([]);

  const gridOptions = {
    domLayout: 'autoHeight', // Set the domLayout property to 'autoHeight' to adjust the height automatically.
    suppressHorizontalScroll: true, // Disable horizontal scroll bar.
    rowHeight: 50, // Adjust the row height as needed
  };

  // Define CSS styles for the cell and header font size
  const cellStyle = { fontSize: '16px' };
  const headerStyle = { fontSize: '16px' };

  const [columnDefs, setColumnDefs] = useState([

    { field: 'businessName', sortable: true, filter: true, width: 180 },
    { field: 'postalCode', sortable: true, width: 150 },  
    { field: 'phoneNumber', sortable: true },
    { field: 'mobileNumber', sortable: true },    
    { field: 'email', sortable: true },    
    { field: 'Activation code', sortable: true },
    { field: 'status', sortable: true },       
    {
      field: 'actions',
      cellRenderer: params => {
        // You can return any JSX or HTML content here
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaEdit onClick={() => onEditStock(params.data)} style={{ cursor: 'pointer', marginRight: '10px', marginTop: '10px', fontSize: 20 }} />
            <FaTrash onClick={() => onDeleteStock(params.data)} style={{ cursor: 'pointer', marginTop: '10px', fontSize: 17 }} />
          </div>
        );
      },
      sortable: false,
      filter: false
    },
  ]);

  const onEditStock = (params) => {
    console.log("onEditStock() method called");
    console.log(params);
    setEditedStock(params);
    setModalMode("Edit"); // Step 3: Set modal mode to "Edit"
    openModal();
  };

  const onDeleteStock = (params) => {
    console.log("onDeleteStock() method called");
    console.log(params);
    setDeletedStock(params);
    openDeleteModal();
  };

  const handleAddStockClick = () => {
    setEditedStock(null); // Clear any existing edited stock data
    setModalMode("Add"); // Set modal mode to "Add"
    openModal();
  };

  

  // State to track if the modal should be shown or hidden
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setValidated(false);
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Function to open the delete modal
  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  // Function to close the delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // Function to close the delete modal
  const deleteStock = () => {

    console.log("deleteStock() method called > ", deletedStock.id)
    closeDeleteModal();

    const graphQLService = new GraphQLService();

    // Fetch data from the service when the component mounts
    graphQLService.deleteStock(deletedStock.id)
      .then((data) => {
        closeModal();
        graphQLService.fetchStocksData()
          .then((data) => {
            // Update the rowData state with the fetched data
            setRowData(data);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };
  const handleBusinessCategoryChange = (event) => {
    const selectedBusinessCategoryId = event.target.value;
    setSelectedBusinessCategoryId(selectedBusinessCategoryId);
    if (selectedBusinessCategoryId != "") {
      fetchDataFromAPI(selectedBusinessCategoryId); 
    } else {
      setBusinessSubCategoriesList([]);
    }   
  };

  const fetchDataFromAPI = (selectedBusinessCategoryId) => {
    // Create an instance of the HttpBackendService
    const httpBackendService = new HttpBackendService();

    httpBackendService.fetchSubCategories("getBusinessSubCategories", selectedBusinessCategoryId)
    .then((data) => {
      // fetching data
      console.info('fetching Business Sub Categories data:', data);
      setBusinessSubCategoriesList(data);
    })
    .catch((error) => {
      console.error('Error fetching Sub Categories data:', error);
    });
  };

  const handleSubmit = (event) => {

    console.log("handleSubmit() method called > ");
    setValidated(true);

    const form = event.currentTarget;
    form.checkValidity();
    event.preventDefault();
    event.stopPropagation();

    console.log("modalMode > ", modalMode);

    if (modalMode === 'Add') {

      var newBusinessJSON = {};

      console.log("handleSubmit() method called > modalMode", modalMode);

      newBusinessJSON = {
          endpoint: 'addBusiness',
          categoryDocId: form.elements["businessCategory"].value,
          subCategoryDocId: form.elements["businessSubCategory"].value,
          businessName: form.elements["businessName"].value,
          countryCode: 'gb',          
          mobileNumber: form.elements["mobileNumber"].value,
          email: form.elements["email"].value,
          address: { 
            addressLine1: form.elements["addressLine1"].value,
            addressLine2: form.elements["addressLine2"].value,
            city: form.elements["city"].value,
            region: form.elements["region"].value,
            postalCode: form.elements["postalCode"].value,
          },
          profile: {},             
      };

      console.log(newBusinessJSON);

      if (form.checkValidity() === true) {

        console.log(newBusinessJSON);
        setValidated(true);
        // Invoke HttpBackendService
        const httpBackendService = new HttpBackendService();
        httpBackendService.insertDocument(newBusinessJSON)
                .then((data) => {
                  closeModal();
                  fetchDataFromAPI();
                  console.info('inserting business category data:', data);                  
                })
                .catch((error) => {
                  console.error('Error inserting business category data:', error);
                });
      }
      
      } else {
      var udpateStockJSON = {};

      console.log("handleSubmit() method called", modalMode);

      udpateStockJSON = {
        updateinvestastocksinput: {
          id: form.elements["id"].value,
          stockSymbol: form.elements["stockSymbol"].value,
          companyName: form.elements["companyName"].value,
          currencySymbol: form.elements["currencySymbol"].value,
          sectorName: form.elements["sectorName"].value,
          exchangeCode: form.elements["exchangeCode"].value
        }
      };


      console.log(udpateStockJSON);


      if (form.checkValidity() === true) {
        console.log(udpateStockJSON);
        setValidated(true);

        const graphQLService = new GraphQLService();

        // Fetch data from the service when the component mounts
        graphQLService.updateStock(udpateStockJSON)
          .then((data) => {
            // Update the rowData state with the fetched data
            //setRowData(data);
            closeModal();
            graphQLService.fetchStocksData()
              .then((data) => {
                // Update the rowData state with the fetched data
                setRowData(data);
              })
              .catch((error) => {
                console.error('Error fetching data:', error);
              });
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }

    }

  };

  // Function to auto-size columns based on content.
  const onFirstDataRendered = (params) => {
    params.api.sizeColumnsToFit();
  };

  useEffect(() => {
    console.log("useEffect() method called");
  
    // Fetch business categories
    const httpBackendService = new HttpBackendService();
    httpBackendService.fetchData("getBusinessCategories")
      .then((businessCategoriesData) => {
        console.info('fetching Business Categories data:', businessCategoriesData);
        setBusinessCategoriesList(businessCategoriesData);
      })
      .catch((error) => {
        console.error('Error fetching Business Categories data:', error);
      });

      var searchDataJSON = {};

      console.log("handleSubmit() method called > modalMode", modalMode);

      searchDataJSON = {
          endpoint: 'searchBusinesses',
          countryCode: 'gb',
          search: [
            {
                field : 'searchKey',
                condition : "==", 
                value : "wd6" 
            }
          ]                
      };

      console.log(searchDataJSON);

    // Fetch data from the service when the component mounts
    httpBackendService.searchData(searchDataJSON)
      .then((data) => {
        // fetching data
        console.info('fetching data:', data);
        setRowData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  

  
  }, []);
  


  return (
    <div className='ag-theme-alpine' style={{ height: '100%', width: '100%' }}>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Business</h1>
        <Form.Group as={Col} md="2" className="ms-auto mr-3">
                    <Form.Select aria-label="businessCategory" name="businessCategoryFilter" required isValid={validated} onChange={handleBusinessCategoryChange} >
                          <option value="">Category</option>
                          {businessCategoriesList.map((businessCategory, index) => (
                            <option key={index}  value={businessCategory.categoryDocId}>{businessCategory.name}</option>
                          ))}
                    </Form.Select>
        </Form.Group>
        <Form.Group as={Col} md="2" className="mr-3">
                    <Form.Select aria-label="businessSubCategory" name="businessSubCategoryFilter" required isValid={validated}>
                          <option value="">Sub Category</option>
                          {businessSubCategoriesList.map((businessSubCategory, index) => (
                            <option key={index}  value={businessSubCategory.subCategoryDocId}>{businessSubCategory.name}</option>
                          ))}
                    </Form.Select>
        </Form.Group>

        <Form.Group  md="2" >
                <Form.Control
                  name="Search"
                  required
                  type="varchar"
                  placeholder="Postal Code (Search...)"
                />
              </Form.Group> 


         
          <div className="btn-toolbar ml-4 mr-4">
          <button type="button" className="btn btn-secondary borderRadiusb1  d-flex  align-items-center" onClick={""}>
          <span style={{ fontSize: '23px' }}>
          <FaSearch />
        </span> 
          </button>
        </div>  

        
        {/* <div className="btn-toolbar ml-2 mr-2">
          <button type="button" className="btn btn-dark borderRadiusb1  d-flex  align-items-center" onClick={""}> 
        <span>Search...</span>
          </button>
        </div>
         */}


        <div className="btn-toolbar mb-2 mb-md-0">
          <button type="button" className="btn btn-primary borderRadiusb1  d-flex  align-items-center" onClick={handleAddStockClick}>
            <span ><img src="../add-ic.png" className="addIcheight" /></span>  <span>New</span>
          </button>
        </div>
      </div>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        gridOptions={gridOptions} // Pass the gridOptions object here.
        onFirstDataRendered={onFirstDataRendered} // Call auto-size function after data is rendered.
        defaultColDef={{ cellStyle, headerStyle }}
      />

      <Modal show={showModal} onHide={closeModal}>
        <Form
          id="businessForm"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{ modalMode === 'Add' ? 'New' : 'Edit' } Business</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            {/* Add a hidden field for the ID */}
            <Form.Group as={Col} md="4">
              <Form.Control
                name="id"
                type="hidden"
              // Set the type to "hidden"
              />
            </Form.Group>

            <Row className="mb-4">

              <Form.Group as={Col} md="6" >
                <Form.Label>Business category</Form.Label>
                <Form.Select aria-label="businessCategory" name="businessCategory" required isValid={validated} onChange={handleBusinessCategoryChange}>
                  <option value="">Select</option>
                  {businessCategoriesList.map((businessCategory) => (
                    <option key={businessCategory.categoryDocId} value={businessCategory.categoryDocId}>
                      {businessCategory.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} md="6">
                <Form.Label>Business sub-category</Form.Label>
                <Form.Select aria-label="businessSubCategory" name="businessSubCategory" required>
                <option value="">Select</option>
                  {businessSubCategoriesList.map((businessSubCategory) => (
                    <option key={businessSubCategory.subCategoryDocId} value={businessSubCategory.subCategoryDocId}>
                      {businessSubCategory.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

            </Row>   


            <Row className="mb-4">
              <Form.Group as={Col} md="6">
                  <Form.Label>Business Name</Form.Label>
                  <Form.Control
                    name="businessName"
                    required
                    type="text"
                    placeholder=""
                  />
                </Form.Group>
             </Row> 

             <Row className="mb-4">
              <Form.Group as={Col} md="6" >
                <Form.Label>Address Line 1</Form.Label>
                <Form.Control
                  name="addressLine1"
                  required
                  type="text"
                  isValid={validated}
                />
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Address Line 2</Form.Label>
                <Form.Control
                  name="addressLine2"
                  required
                  type="text"
                  placeholder=""
                />
              </Form.Group>
            </Row>

            <Row className="mb-4">
              <Form.Group as={Col} md="6" >
                <Form.Label>City</Form.Label>
                <Form.Control
                  name="city"
                  required
                  type="text"
                  isValid={validated}
                />
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Region</Form.Label>
                <Form.Control
                  name="region"
                  required
                  type="text"
                  placeholder=""
                />
              </Form.Group>
            </Row>                       

            <Row className="mb-4">
              <Form.Group as={Col} md="6" >
                <Form.Label>Postal code</Form.Label>
                <Form.Control
                  name="postalCode"
                  required
                  type="text"
                  isValid={validated}
                />
              </Form.Group>             
            </Row>

      
            <Row className="mb-4">
              <Form.Group as={Col} md="6" >
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  name="mobileNumber"
                  required
                  type="text"
                  isValid={validated}
                />
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  required
                  type="text"
                  placeholder=""
                />
              </Form.Group>
            </Row>


          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' type="submit">
            { modalMode === 'Add' ? 'Save' : 'Update' }
            </Button>
            <Button variant='secondary' onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>


      {/* DELETE MODEL */}
      <Modal show={showDeleteModal} onHide={closeDeleteModal}>

        <Modal.Header closeButton>
          <Modal.Title>Delete Stock - {deletedStock.stockSymbol} </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="mb-4">
            <h3> Are you sure ?</h3>
            <br></br>
            Do you really want to delete the company - {deletedStock.companyName} ? This process cannot be undone.
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={deleteStock}>
            Delete
          </Button>
          <Button variant='secondary' onClick={closeDeleteModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );

};

export default Business;