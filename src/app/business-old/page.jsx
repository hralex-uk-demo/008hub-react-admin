'use client'

import React, { useState, useEffect } from "react";

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { Badge, Button, Modal, Form, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaEdit, FaTrash, FaArrowUp, FaArrowDown  } from 'react-icons/fa';

import { HttpBackendService } from '../services/httpbackend.service';

import { useDispatch, useSelector } from 'react-redux';
import { fetchSubscriptionsData } from '../redux/subscriptionsSlice';

const { v4: uuidv4 } = require('uuid');

const Sectors = () => {

  const [rowData, setRowData] = useState([]);
  const [validated, setValidated] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(null);
  const [modalMode, setModalMode] = useState("Add");
  const [deletedCustomer, setDeletedCustomer] = useState({});
  const [subscriptionsList, setSubscriptionsList] = useState([]);

  /**
  const dispatch = useDispatch();
  const subscriptionsListRedux = useSelector((state) => state.subscriptions);
   */

  const gridOptions = {
    domLayout: 'autoHeight', // Set the domLayout property to 'autoHeight' to adjust the height automatically.
    suppressHorizontalScroll: true, // Disable horizontal scroll bar.
    rowHeight: 50, // Adjust the row height as needed
  }; 
  
  // Define CSS styles for the cell and header font size
  const cellStyle = { fontSize: '16px' }; 
  const headerStyle = { fontSize: '16px' }; 

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Name',
      valueGetter: (params) => `${params.data.firstName} ${params.data.lastName}`,
      sortable: true
    },
    { field: 'mobileNumber', headerName: 'Mobile Number',sortable: true },
    { field: 'totalInvestment', headerName: 'Total Investment', sortable: true },
    { field: 'currentValue', headerName: 'Current Value', sortable: true },
    { field: 'change',  headerName: 'Change',
    cellRenderer: params => {
      // You can return any JSX or HTML content here
      const changePercentage = calculateInvestmentChange(params.data.totalInvestment, params.data.currentValue);
      const colorClass = getColorClass(changePercentage);
      const arrowIcon = getArrowTypesClass(changePercentage);

      return (
        <div className={colorClass} style={{ display: 'flex', alignItems: 'center' }}>
            {changePercentage}% <div style={{ marginTop: '-3px', marginLeft: '5px' }}> {arrowIcon} </div>
        </div>
      );
    },
    sortable: false,
    filter: false
    },
    { field: 'subscriptionType',
      cellRenderer: params => {
        // You can return any JSX or HTML content here
        return (
          <div>
            {params.data.subscriptionType === 'Basic'
              ? (<Badge bg="success">{params.data.subscriptionType.charAt(0).toUpperCase() + params.data.subscriptionType.slice(1)}</Badge>)
              : params.data.subscriptionType === 'Standard'
                ? (<Badge bg="primary">{params.data.subscriptionType.charAt(0).toUpperCase() + params.data.subscriptionType.slice(1)}</Badge>)
                : (<Badge bg="info">{params.data.subscriptionType.charAt(0).toUpperCase() + params.data.subscriptionType.slice(1)}</Badge>)}
          </div>
        );
      },
      sortable: false,
      filter: false
    },
    { field: 'actions',
    cellRenderer: params => {      
      // You can return any JSX or HTML content here
      return (
       <div style={{ display: 'flex', alignItems: 'center' }}>
        <FaEdit onClick={() => onEditCustomer(params.data)} style={{ cursor: 'pointer', marginRight: '10px', marginTop: '10px', fontSize : 20 }} />
        <FaTrash onClick={() => onDeleteCustomer(params.data)}  style={{ cursor: 'pointer', marginTop: '10px', fontSize : 17}} />
       </div>       
      );
    },
    sortable: false,
    filter: false},
  ]);

  function calculateInvestmentChange(initialInvestment, currentInvestment) {
    const initialInvestmentValue = parseFloat(initialInvestment);
    const currentInvestmentValue = parseFloat(currentInvestment);
  
    if (isNaN(initialInvestmentValue) || isNaN(currentInvestmentValue)) {
      return "";
    }
  
    const changeAmount = currentInvestmentValue - initialInvestmentValue;
    const changePercentage = ((changeAmount / initialInvestmentValue) * 100).toFixed(2);
  
    return parseFloat(changePercentage);
  }
  
  function getColorClass(changePercentage) {
    const changePercentageFloat = parseFloat(changePercentage);
    return changePercentageFloat > 0 ? 'positive-value' : changePercentageFloat < 0 ? 'negative-value' : '';
  }
  
  function getArrowTypesClass(changePercentage) {
    const changePercentageFloat = parseFloat(changePercentage);
    return changePercentageFloat > 0 ?  <FaArrowUp/> : changePercentageFloat < 0 ?  <FaArrowDown/> : '';
  }
  

  const onEditCustomer = (params) => {
    console.log("onEditCustomer() method called");
    console.log(params);
    setEditedCustomer(params);
    setModalMode("Edit"); // Step 3: Set modal mode to "Edit"
    openModal();
  };

  const onDeleteCustomer = (params) => {
    console.log("onDeleteCustomer() method called");
    console.log(params);
    setDeletedCustomer(params);
    openDeleteModal();
  };

  const handleAddCustomerClick = () => {
    setEditedCustomer(null); // Clear any existing edited stock data
    setModalMode("Add"); // Set modal mode to "Add"
    openModal();
  };

  useEffect(() => {
    console.log("useEffect() method called");
    console.log(editedCustomer);

    if (editedCustomer) {
      const form = document.getElementById("customerForm");
      form.elements["id"].value = editedCustomer._id;
      form.elements["firstName"].value = editedCustomer.firstName;
      form.elements["lastName"].value = editedCustomer.lastName;
      form.elements["mobileNumber"].value = editedCustomer.mobileNumber;
      form.elements["totalInvestment"].value = editedCustomer.totalInvestment;
      form.elements["subscriptionType"].value = editedCustomer.subscriptionType;
    };

    fetchDataFromAPI();  
    
    const httpBackendService = new HttpBackendService();

    httpBackendService.fetchData("subscriptions")
    .then((data) => {
      // fetching data
      console.info('fetching subscriptions data:', data);
      setSubscriptionsList(data);
    })
    .catch((error) => {
      console.error('Error fetching subscriptions data:', error);
    });

    // TODO : dispatch(fetchSubscriptionsData());

  }, [editedCustomer]);
  

  const fetchDataFromAPI = () => {
        // Create an instance of the HttpBackendService
        const httpBackendService = new HttpBackendService();

        httpBackendService.fetchData("customers")
        .then((data) => {
          // fetching data
          console.info('fetching customers data:', data);
          setRowData(data);
        })
        .catch((error) => {
          console.error('Error fetching customers data:', error);
        });
  };



  // State to track if the modal should be shown or hidden
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const amountRegexPattern = /^0\d{10}$/;
  
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
  const deleteCustomer = () => {  
    
    console.log("deleteCustomer() method called > ", deletedCustomer._id)

      const httpBackendService = new HttpBackendService();

      httpBackendService.deleteDocument("customers", deletedCustomer._id)
      .then((data) => {
        closeDeleteModal();
        // fetching data
        fetchDataFromAPI();
        console.info('Deleting customer data:', data);                  
      })
      .catch((error) => {
        console.error('Error deleting customer data:', error);
      });

  };

  const handleSubmit = (event) => {

    console.log("handleSubmit() method called > ");
    setValidated(true);

    const form = event.currentTarget;
    form.checkValidity();
    event.preventDefault();
    event.stopPropagation();

    if (modalMode  === 'Add') {

            console.log("handleSubmit() method called", modalMode );
            // Generate a new UUID
            const newUUID = uuidv4();

              let newCustomerJSON = {
                  id: newUUID,
                  firstName : form.elements["firstName"].value,
                  lastName : form.elements["lastName"].value,
                  mobileNumber : form.elements["mobileNumber"].value,
                  totalInvestment : form.elements["totalInvestment"].value,
                  currentValue : form.elements["totalInvestment"].value,
                  subscriptionType : form.elements["subscriptionType"].value
              };

            console.log(newCustomerJSON);


            if (form.checkValidity() === true) {
                console.log(newCustomerJSON);
                setValidated(true);
                
                const httpBackendService = new HttpBackendService();

                httpBackendService.insertDocument("customers", newCustomerJSON)
                .then((data) => {
                  closeModal();
                  // fetching data
                  fetchDataFromAPI();
                  console.info('inserting customer data:', data);                  
                })
                .catch((error) => {
                  console.error('Error inserting customer data:', error);
                });
              
              }  
              
    } else {

      var udpateCustomerJSON = {};

            console.log("handleSubmit() method called", modalMode );

            udpateCustomerJSON = {
                  id: form.elements["id"].value,
                  firstName : form.elements["firstName"].value,
                  lastName : form.elements["lastName"].value,
                  mobileNumber : form.elements["mobileNumber"].value,
                  totalInvestment : form.elements["totalInvestment"].value,
                  subscriptionType : form.elements["subscriptionType"].value
              };

            console.log(udpateCustomerJSON);

            if (form.checkValidity() === true) {
                console.log(udpateCustomerJSON);
                setValidated(true);
                
                const httpBackendService = new HttpBackendService();

                httpBackendService.updateDocument("customers", udpateCustomerJSON)
                .then((data) => {
                  closeModal();
                  // fetching data
                  fetchDataFromAPI();  
                  console.info('updating customers data:', data);                  
                })
                .catch((error) => {
                  console.error('Error updating customers data:', error);
                });
              }
    }
    
  };

  // Function to auto-size columns based on content.
  const onFirstDataRendered = (params) => {
    params.api.sizeColumnsToFit();
  };

  return (
    <div className='ag-theme-alpine' style={{ height: '100%', width: '100%' }}>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Customers</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <button type="button" className="btn btn-primary borderRadiusb1  d-flex  align-items-center" onClick={handleAddCustomerClick}>
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
          id="customerForm"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}>       
            <Modal.Header closeButton>
              <Modal.Title> { modalMode === 'Add' ? 'New' : 'Edit' }  Customer</Modal.Title>
            </Modal.Header>
            <Modal.Body>      
             
            {/* Add a hidden field for the ID */}
            <Form.Group as={Col} md="4">
                <Form.Control
                  name="id"
                  type="hidden"
                />
            </Form.Group>

            <Row className="mb-4">

                <Form.Group as={Col} md="6" >
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    name="firstName"
                    required
                    type="text"
                    isValid={validated}  
                  />
                </Form.Group>

                <Form.Group as={Col} md="6">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    name="lastName"                    
                    required
                    type="text"
                    isValid={validated}  
                  />
                </Form.Group>

              </Row>

              
            <Row className="mb-4">

              <Form.Group as={Col} md="6" >
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  name="mobileNumber"
                  required
                  type="text"
                  isValid={validated}  
                />
              </Form.Group>

              <Form.Group as={Col} md="6">
                <Form.Label>Total Investment</Form.Label>
                <Form.Control
                  name="totalInvestment"                             
                  required
                  type="text"
                  pattern="^\d+(\.\d{1,2})?$"          
                  isValid={validated}  
                />
              </Form.Group>

            </Row>

               
            <Row className="mb-4">

            <Form.Group as={Col} md="6">
                <Form.Label>Subscription</Form.Label>
                <Form.Select aria-label="subscriptionType" name="subscriptionType" required isValid={validated} >
                      <option value=""></option>
                      {subscriptionsList.map((subscription, index) => (
                        <option key={index}  value={subscription.type}>{subscription.type} ({subscription.amount})</option>
                      ))}
                </Form.Select>
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
              <Modal.Title>Delete Sector - {deletedCustomer.name} </Modal.Title>
            </Modal.Header>

            <Modal.Body>
            <Row className="mb-4">
              <h3> Are you sure ?</h3>
              <br></br>
              Do you really want to delete the sector - {deletedCustomer.name} ? This process cannot be undone.
            </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='primary'  onClick={deleteCustomer}>
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

export default Sectors;