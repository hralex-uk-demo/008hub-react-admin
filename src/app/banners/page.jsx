'use client'

import React, { useState, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button, Modal, Badge, Form, Dropdown, Col, Row } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

import { GraphQLService } from '../graphql/graphql.service';

import { HttpBackendService } from '../services/httpbackend.service';

const { v4: uuidv4 } = require('uuid');

const Stocks = () => {

  const [rowData, setRowData] = useState([]);
  const [validated, setValidated] = useState(false);
  const [editedStock, setEditedStock] = useState(null);
  const [modalMode, setModalMode] = useState("Add");
  const [deletedStock, setDeletedStock] = useState({});
  
  const [currenciesList, setCurrenciesList] = useState([]);
  const [exchangesList, setExchangesList] = useState([]);
  const [sectorsList, setSectorsList] = useState([]);



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
      field: 'icon',
      width: 100,
      cellRenderer: params => {
        const iconUrl = `https://do1r04b5laugk.cloudfront.net/${params.data.stockSymbol}.png`;
        // You can return any JSX or HTML content here
        return (
          <div>
            <img src={iconUrl} alt="" className="h-10 w-10 rounded-full bg-gray-50" />
          </div>
        );
      },
      sortable: false,
      filter: false
    },
    { field: 'stockSymbol', sortable: true, filter: true, width: 180 },
    { field: 'companyName', sortable: true },
    { field: 'exchangeCode', sortable: true, width: 150 },
    {
      field: 'sharePrice',
      cellRenderer: params => {
        const parsedNumber = parseFloat(params.data.sharePrice);
        const formattedNumber = parsedNumber.toFixed(2);
        return (
          <div>
            {formattedNumber}
          </div>
        );
      },
      sortable: false,
      filter: false
    },
    { field: 'sectorName', sortable: true },
    {
      field: 'status',
      cellRenderer: params => {
        // You can return any JSX or HTML content here
        return (
          <div>
            {params.data.status === 'live'
              ? (<Badge bg="success">{params.data.status.charAt(0).toUpperCase() + params.data.status.slice(1)}</Badge>)
              : params.data.status === 'New'
                ? (<Badge bg="primary">{params.data.status.charAt(0).toUpperCase() + params.data.status.slice(1)}</Badge>)
                : (<Badge bg="info">{params.data.status.charAt(0).toUpperCase() + params.data.status.slice(1)}</Badge>)}
          </div>
        );
      },
      sortable: false,
      filter: false
    },
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

  useEffect(() => {
    console.log("useEffect() method called");
    console.log(editedStock);

    if (editedStock) {
      const form = document.getElementById("stockForm");
      form.elements["id"].value = editedStock.id;
      form.elements["stockSymbol"].value = editedStock.stockSymbol;
      form.elements["companyName"].value = editedStock.companyName;
      form.elements["currencySymbol"].value = editedStock.currencySymbol;
      form.elements["sectorName"].value = editedStock.sectorName;
      form.elements["exchangeCode"].value = editedStock.exchangeCode;
    }


    // Populate all static data

    // Create an instance of the HttpBackendService
    const httpBackendService = new HttpBackendService();

    httpBackendService.fetchData("currencies")
      .then((data) => {
        // fetching data
        console.info('fetching currencies data:', data);
        setCurrenciesList(data);
      })
      .catch((error) => {
        console.error('Error fetching customers data:', error);
      });

      httpBackendService.fetchData("exchanges")
      .then((data) => {
        // fetching data
        console.info('fetching exchanges data:', data);
        setExchangesList(data);
      })
      .catch((error) => {
        console.error('Error fetching exchanges data:', error);
      });

      httpBackendService.fetchData("sectors")
      .then((data) => {
        // fetching data
        console.info('fetching sectors data:', data);
        setSectorsList(data);
      })
      .catch((error) => {
        console.error('Error fetching sectors data:', error);
      });

    // Create an instance of the GraphQLService
    const graphQLService = new GraphQLService();

    // Fetch data from the service when the component mounts
    graphQLService.fetchStocksData()
      .then((data) => {
        // fetching data
        console.info('fetching data:', data);
        setRowData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [editedStock]); // The empty array [] ensures this effect runs only once when the component mounts

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

  const handleSubmit = (event) => {

    console.log("handleSubmit() method called > ");
    setValidated(true);

    const form = event.currentTarget;
    form.checkValidity();
    event.preventDefault();
    event.stopPropagation();

    console.log("modalMode > ", modalMode);

    if (modalMode === 'Add') {

      var newStockJSON = {};

      console.log("handleSubmit() method called > modalMode", modalMode);
      // Generate a new UUID
      const newUUID = uuidv4();

      newStockJSON = {
        createinvestastocksinput: {
          id: newUUID,
          stockSymbol: form.elements["stockSymbol"].value,
          companyName: form.elements["companyName"].value,
          currencySymbol: form.elements["currencySymbol"].value,
          sectorName: form.elements["sectorName"].value,
          exchangeCode: form.elements["exchangeCode"].value,
          sharePrice: 10.0,
          status: 'new'
        }
      };


      console.log(newStockJSON);


      if (form.checkValidity() === true) {
        console.log(newStockJSON);
        setValidated(true);

        const graphQLService = new GraphQLService();

        // Fetch data from the service when the component mounts
        graphQLService.createStock(newStockJSON)
          .then((data) => {
            // Update the rowData state with the fetched data
            setRowData(data);
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

  return (
    <div className='ag-theme-alpine' style={{ height: '100%', width: '100%' }}>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Stocks</h1>
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
          id="stockForm"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{ modalMode === 'Add' ? 'New' : 'Edit' } Stock</Modal.Title>
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
                <Form.Label>Symbol</Form.Label>
                <Form.Control
                  name="stockSymbol"
                  required
                  type="text"
                  isValid={validated}
                />
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Company name</Form.Label>
                <Form.Control
                  name="companyName"
                  required
                  type="text"
                  placeholder=""
                />
              </Form.Group>

            </Row>

            <Row className="mb-4">

              <Form.Group as={Col} md="6" >
                <Form.Label>Currency</Form.Label>
                <Form.Select aria-label="currencySymbol" name="currencySymbol" required>
                  <option value="">Select</option>
                  {currenciesList.map((currency) => (
                    <option key={currency._id} value={currency.symbol}>
                      {currency.name} ({currency.symbol})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} md="6">
                <Form.Label>Stock exchange</Form.Label>
                <Form.Select aria-label="exchangeCode" name="exchangeCode" required>
                <option value="">Select</option>
                  {exchangesList.map((exchange) => (
                    <option key={exchange.code} value={exchange.code}>
                      {exchange.name} ({exchange.code})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

            </Row>            

            <Row className="mb-6">


                <Form.Group as={Col} md="6" >
                  <Form.Label>Sector</Form.Label>
                  <Form.Select aria-label="sectorName" name="sectorName" required>
                  <option value="">Select</option>
                    {sectorsList.map((currency) => (
                      <option key={currency.name} value={currency.name}>
                        {currency.name}
                      </option>
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

export default Stocks;