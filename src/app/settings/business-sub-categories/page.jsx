'use client'

import React, { useState, useEffect } from "react";

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { Button, Modal, Form, Col, Row } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

import { HttpBackendService } from '../../services/httpbackend.service';

const { v4: uuidv4 } = require('uuid');

const BusinessCategory = () => {

  const [rowData, setRowData] = useState([]);
  const [validated, setValidated] = useState(false);
  const [editedDocument, setEditedDocument] = useState(null);
  const [modalMode, setModalMode] = useState("Add");
  const [deletedDocument, setDeletedDocument] = useState({});
  
  const gridOptions = {
    domLayout: 'autoHeight', // Set the domLayout property to 'autoHeight' to adjust the height automatically.
    suppressHorizontalScroll: true, // Disable horizontal scroll bar.
    rowHeight: 50, // Adjust the row height as needed
  }; 
  
  // Define CSS styles for the cell and header font size
  const cellStyle = { fontSize: '16px' }; 
  const headerStyle = { fontSize: '16px' }; 

  const [columnDefs, setColumnDefs] = useState([
    { field: 'name', headerName: 'Name', sortable: true },
    { field: 'actions',
    cellRenderer: params => {      
      // You can return any JSX or HTML content here
      return (
       <div style={{ display: 'flex', alignItems: 'center' }}>
        <FaEdit onClick={() => onEditDocument(params.data)} style={{ cursor: 'pointer', marginRight: '10px', marginTop: '10px', fontSize : 20 }} />
        <FaTrash onClick={() => onDeleteDocument(params.data)}  style={{ cursor: 'pointer', marginTop: '10px', fontSize : 17}} />
       </div>       
      );
    },
    sortable: false,
    filter: false},
  ]);

  const onEditDocument = (params) => {
    console.log("onEditDocument() method called");
    console.log(params);
    setEditedDocument(params);
    setModalMode("Edit"); // Step 3: Set modal mode to "Edit"
    openModal();
  };

  const onDeleteDocument = (params) => {
    console.log("onDeleteDocument() method called");
    console.log(params);
    setDeletedDocument(params);
    openDeleteModal();
  };

  const handleAddBusinessCategoryClick = () => {
    setEditedDocument(null); // Clear any existing edited stock data
    setModalMode("Add"); // Set modal mode to "Add"
    openModal();
  };

  useEffect(() => {
    console.log("useEffect() method called");
    console.log(editedDocument);

    if (editedDocument) {
      const form = document.getElementById("documentForm");
      form.elements["categoryDocId"].value = editedDocument.categoryDocId;
      form.elements["name"].value = editedDocument.name;
    };

    fetchDataFromAPI();    

  }, [editedDocument]);
  

  const fetchDataFromAPI = () => {
        // Create an instance of the HttpBackendService
        const httpBackendService = new HttpBackendService();

        httpBackendService.fetchData("getBusinessCategories")
        .then((data) => {
          // fetching data
          console.info('fetching Business Categories data:', data);
          setRowData(data);
        })
        .catch((error) => {
          console.error('Error fetching Categories data:', error);
        });
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
  const deleteDocument = () => {  
    
    console.log("deleteDocument() method called > ", deletedDocument.categoryDocId)

      const httpBackendService = new HttpBackendService();

      let deletedBusinessCategoryJSON = {
        endpoint: "deleteBusinessCategory",
        categoryDocId: deletedDocument.categoryDocId       
      };
  
      httpBackendService.deleteDocument(deletedBusinessCategoryJSON)
      .then((data) => {
        closeDeleteModal();
        // fetching data
        fetchDataFromAPI();
        console.info('Deleting business category :', data);                  
      })
      .catch((error) => {
        console.error('Error deleting business category:', error);
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

              let newBusinessCategoryJSON = {
                  endpoint: "addBusinessCategory",
                  category : {
                    name : form.elements["name"].value,
                    status: true
                  }
              };

  
            console.log(newBusinessCategoryJSON);


            if (form.checkValidity() === true) {
                console.log(newBusinessCategoryJSON);
                setValidated(true);
                
                const httpBackendService = new HttpBackendService();

                httpBackendService.insertDocument(newBusinessCategoryJSON)
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

      var udpateBusinessCategoryJSON = {};

            console.log("handleSubmit() method called", modalMode );

            udpateBusinessCategoryJSON = {
                  endpoint: "updateBusinessCategory",
                  categoryDocId: form.elements["categoryDocId"].value, 
                  category : {                
                    name : form.elements["name"].value,
                    status: false,
                  }
              };

            console.log(udpateBusinessCategoryJSON);

            if (form.checkValidity() === true) {
                console.log(udpateBusinessCategoryJSON);
                setValidated(true);
                
                const httpBackendService = new HttpBackendService();

                httpBackendService.updateDocument(udpateBusinessCategoryJSON)
                .then((data) => {
                  closeModal();
                  // fetching data
                  fetchDataFromAPI();  
                  console.info('updating sectors data:', data);                  
                })
                .catch((error) => {
                  console.error('Error updating sectors data:', error);
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
        <h1 className="h2">Business Categories</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <button type="button" className="btn btn-primary borderRadiusb1  d-flex  align-items-center" onClick={handleAddBusinessCategoryClick}>
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
          id="documentForm"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}>       
            <Modal.Header closeButton>
              <Modal.Title> { modalMode === 'Add' ? 'New' : 'Edit' } Business Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>      
             
            {/* Add a hidden field for the ID */}
            <Form.Group as={Col} md="4">
                <Form.Control
                  name="categoryDocId"
                  type="hidden"
                />
            </Form.Group>

            <Row className="mb-4">

                <Form.Group as={Col} md="6">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"                    
                    required
                    type="text"
                    isValid={validated}  
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
              <Modal.Title>Delete Category - {deletedDocument.name} </Modal.Title>
            </Modal.Header>

            <Modal.Body>
            <Row className="mb-4">
              <h3> Are you sure ?</h3>
              <br></br>
              Do you really want to delete the sector - {deletedDocument.name} ? This process cannot be undone.
            </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='primary'  onClick={deleteDocument}>
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

export default BusinessCategory;