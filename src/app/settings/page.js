'use client'
import React, { useState, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button, Modal, Badge, Form, Dropdown, Col, Row } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

import { GraphQLService } from '../graphql/graphql.service';

import { HttpBackendService } from '../services/httpbackend.service';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import BusinessCategories from "./business-categories/page";
import BusinessSubCategories from "./business-sub-categories/page";
import BannerCategories from "./banner-categories/page";
import BannerSubCategories from "./banner-sub-categories/page";
import BannerSubCategoryItems from "./banner-sub-category-items/page";

const Settings = () => {
    return (

        <div className='ag-theme-alpine' style={{ height: '100%', width: '100%' }}>

            <div>
                <Tabs   defaultActiveKey="business-categories"
                        id="uncontrolled-tab-example"
                        className="mb-3" >

                        <Tab eventKey="business-categories" title="Business Categories">
                                <BusinessCategories />
                        </Tab>

                        <Tab eventKey="business-sub-categories" title="Business Sub Categories">
                                <BusinessSubCategories />
                        </Tab>

                        <Tab eventKey="banner-categories" title="Banner Categories">
                                <BannerCategories />
                        </Tab>

                        <Tab eventKey="banner-sub-categories" title="Banner Sub Categories">
                                <BannerSubCategories />
                        </Tab>

                        <Tab eventKey="banner-sub-category-items" title="Banner Items">
                                <BannerSubCategoryItems />
                        </Tab>
        
                </Tabs>

            </div>

            {}
        
        </div>
    );
}

export default Settings