'use client'

import React, { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import SideNav from './SideNav';
import ContentPanel from './ContentPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUser } from '@fortawesome/free-solid-svg-icons';


export default function DashboardPage() {
  const [activeItem, setActiveItem] = useState(null);

  return (
    <div>
      <header className="navbar flex-md-nowrap p-0 py-3" style={{ background: "#f2f2f2 !important" }} data-bs-theme="dark">
        <a className="col-md-3 col-lg-2 me-0 px-3 fs-6 text-white" href="#">
          <img src='../../logo.png' style={{ height: 32 }} />
        </a>

        <ul className="navbar-nav flex-row d-md-none">
          <li className="nav-item text-nowrap">
            <button className="nav-link px-3 text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSearch" aria-controls="navbarSearch" aria-expanded="false" aria-label="Toggle search">
            </button>
          </li>
          <li className="nav-item text-nowrap">
            <button className="nav-link px-3 text-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
            </button>
          </li>
        </ul>
        <div className="d-flex mt-3 mt-lg-0" role="search" style={{ marginRight: "24px" }}>
          <span className=''><FontAwesomeIcon icon={faUser} /></span>
        </div>

        <div id="navbarSearch" className="navbar-search w-100 collapse">

        </div>
      </header>
      <div className="container-fluid">
        <div className="row">
          <SideNav setActiveItem={setActiveItem} />
          <ContentPanel activeItem={activeItem} />
        </div >
      </div >
    </div >


  );
}
