'use client'

import React, { useState, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { GraphQLService } from '../graphql/graphql.service';

const Currencies = () => {
  const [rowData, setRowData] = useState([]);

  const [columnDefs, setColumnDefs] = useState([
    { field: 'symbol', sortable: true, filter: true },
    { field: 'code', sortable: true },
    { field: 'name', sortable: true },
    { field: 'country', sortable: true },
    { field: 'ACTIONS', sortable: true }
  ]);

  useEffect(() => {
    // Create an instance of the GraphQLService
    const graphQLService = new GraphQLService();

    // Fetch data from the service when the component mounts
    graphQLService.fetchCurrenciesData()
      .then((data) => {
        // Update the rowData state with the fetched data
        setRowData(data.listCurrencies.items);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []); // The empty array [] ensures this effect runs only once when the component mounts




  return (
    <div className='ag-theme-alpine' style={{ height: 500 }}>
      <br></br><br></br>
      <h1 style={{ height: 50, backgroundColor: 'turquoise', fontFamily: 'Arial, Helvetica, sans-serif' }}>Currencies Listings</h1>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs} />
    </div>
  );

};

export default Currencies;