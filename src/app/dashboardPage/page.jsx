'use client'

import React, { useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import './dashboard.css';
import { GraphQLService } from '../graphql/graphql.service';


function CurrentDate() {
  // Create a new Date object to get the current date
  const currentDate = new Date();

  // Define months array for formatting
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Get the day, month, and year from the Date object
  const day = currentDate.getDate();
  const month = months[currentDate.getMonth()]; // Use months array to get the abbreviated month
  const year = currentDate.getFullYear();

  // Format the date as "20 Sep 2023"
  const formattedDate = `${day} ${month} ${year}`;

  return (
    formattedDate
  );
}



// Traffic Chart
const dataPie = {
  type: 'pie',
  data: {
    labels: ['Android', 'iPhone', 'Tablet', 'Desktop', 'Others'],
    datasets: [
      {
        label: 'Traffic',
        data: [2112, 2343, 2545, 3423, 2365],
        backgroundColor: [
          'rgba(63, 81, 181, 0.5)',
          'rgba(77, 182, 172, 0.5)',
          'rgba(66, 133, 244, 0.5)',
          'rgba(156, 39, 176, 0.5)',
          'rgba(233, 30, 99, 0.5)'
        ],
      },
    ],
  },
};

// Trading Chart
const dataLine = {
  type: 'line',
  data: {
    labels: ['Monday', 'Tuesday' , 'Wednesday' , 'Thursday' , 'Friday' , 'Saturday' , 'Sunday '],
    datasets: [
      {
        label: 'Trading',
        data: [2112, 3343, 2545, 3423, 2365, 1985, 987],
      },
    ],
  },
};




const DashboardScreen = () => {

  const [stocksList, setStocksList] = useState([]);

  useEffect(() => {


    const init = async () => {
      const { Chart, initTE } = await import("tw-elements");
      initTE({ Chart });

      new Chart(document.getElementById('pie-chart'), dataPie);
      new Chart(document.getElementById('line-chart'), dataLine);
      document.getElementById('line-chart').height = 210;

    };

    init();
      
    
    

      // Create an instance of the GraphQLService
      const graphQLService = new GraphQLService();

      // Fetch data from the service when the component mounts
      graphQLService.fetchStocksData()
        .then((data) => {
          // fetching data
          console.info('fetching data:', data);
          setStocksList(data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
       

  }, []);


  return (
    <div className=''>
      <main className="">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h3 className="h4">Dashboard</h3>
          <div className="btn-toolbar mb-2 mb-md-0">
            <button type="button" className="btn btn-outline-primary borderRadiusb1 mx-3">
              Import Stock
            </button>
            <button type="button" className="btn btn-primary borderRadiusb1  d-flex  align-items-center" onClick={() => {navigateTo('stocks') }}>
                <span ><img src="../add-ic.png" className="addIcheight" /></span>  <span>Add Stock</span>              
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
          <div className="row mb-3">
              <div className="col-md-3">
                <div className="borderColor py-3 p-3">
                  <div className="d-flex">
                    <div>
                      <img src="../icon-1.png" className='iconSize' />
                    </div>
                    <div className="mx-3">
                      <div className="">
                        <h6 className="p-0 m-0 fw-bold">Customers</h6>
                        <p className="pm0 dulCol fs14">{CurrentDate()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <h3 className="pm0">24.4k</h3>
                    <span>
                      <img src="../icon-5.png" className='iconSize2'/>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="borderColor py-3 p-3">
                  <div className="d-flex">
                    <div>
                      <img src="../icon-2.png" className='iconSize'/>
                    </div>
                    <div className="mx-3">
                      <div className="">
                        <h6 className="p-0 m-0 fw-bold">Stocks</h6>
                        <p className="pm0 dulCol fs14">{CurrentDate()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <h3 className="pm0">346</h3>
                    <span>
                      <img src="../icon-5.png" className='iconSize2'/>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="borderColor py-3 p-3">
                  <div className="d-flex">
                    <div>
                      <img src="../icon-3.png" className='iconSize'/>
                    </div>
                    <div className="mx-3">
                      <div className="">
                        <h6 className="p-0 m-0 fw-bold">Trades</h6>
                        <p className="pm0 dulCol fs14">{CurrentDate()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <h3 className="pm0">£45.8k</h3>
                    <span>
                      <img src="../icon-5.png" className='iconSize2'/>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="borderColor py-3 p-3">
                  <div className="d-flex">
                    <div>
                      <img src="../icon-4.png" className='iconSize'/>
                    </div>
                    <div className="mx-3">
                      <div className="">
                        <h6 className="p-0 m-0 fw-bold">Members</h6>
                        <p className="pm0 dulCol fs14">{CurrentDate()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <h3 className="pm0">450</h3>
                    <span>
                      <img src="../icon-5.png" className='iconSize2'/>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="borderColor py-3 p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-2">Trading Overview</h5>
                </div>
                <div>
                  <button type="button" className="btn borderRadiusb btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1">
                    <span><img src="../calendar_ic.png" height={20} /></span>
                    This week
                  </button>
                </div>
              </div>
              <div>
                  <div class="mx-auto w-5/5 overflow-hidden">
                      <canvas id="line-chart"></canvas>
                  </div>
              </div>
            </div>
            
          </div>
          <div className="col-md-4">
            <div className="borderColor py-3 p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="mb-2">New Stocks</h5>
                </div>
                <div>
                  <button type="button" className="btn btn-light bottomMore  btn-sm">View more</button>
                </div>
              </div>
              <div className="row">

              {stocksList.slice(0, 4).map((stock, index) => (

                <div className="col-md-6 mt-2"  key={index}>
                  <div className="borderColor py-3 p-3">
                    <div className="d-flex justify-content-between align-items-center">
                    <div className="mb-2"><img src={`https://do1r04b5laugk.cloudfront.net/${stock.stockSymbol}.png`} alt={stock.stockSymbol} /> </div>
                      <span className="badge bg-secondary ic11 ">{stock.currencySymbol}{stock.sharePrice}</span>
                    </div>
                    <div className="">
                      <h6 className="p-0 m-0 fw-bold">{stock.stockSymbol}</h6>
                      <p className="pm0 dulCol fs14">{stock.companyName}</p>
                    </div>
                  </div>
                </div>

                ))}        

              </div>

            </div>
            <div className="borderColor py-3 p-4 mt-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="mb-2">Traffic Overview</h5>
                </div>
              </div>
              <div class="mx-auto w-4/5 overflow-hidden">
                <canvas id="pie-chart"></canvas>
              </div>
            </div>
          </div>
        </div>


      </main> 
    </div>    
  );
}

export default DashboardScreen;
