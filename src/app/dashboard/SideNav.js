// SideNav.js
import React, { useState }  from 'react';
import { Nav } from 'react-bootstrap';
import "./dashboard.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUser, faArrowTrendUp, faList, faRotate, faDollarSign, faSubscript, faHeart, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import SplitButton from 'react-bootstrap/SplitButton';

function SideNav({ setActiveItem }) {

  const [selectedItem, setSelectedItem] = useState(null);

  const handleNavItemClick = (item) => {
    setActiveItem(item);
    setSelectedItem(item);
  };

  return (
    <>
    <div class=" col-md-2 col-lg-1 p-0 text-center">
        <div class="fs-6 py-3 menuFn">MENU</div>
        <ul class="sideMenuIc ">
          <li  className={selectedItem === 'dashboardPage' ? 'menuSelected' : ''} onClick={() => handleNavItemClick('dashboardPage')}>         
            <a ><img src="../meni-ic-1.png" /></a>
            <div class="mainMenu1">Dashboard</div>
          </li>
          <li className={selectedItem === 'business' ? 'menuSelected' : ''}  onClick={() => handleNavItemClick('business')}>
            <a href="#"><img src="../meni-ic-3.png" /></a>
            <div class="mainMenu1">Business</div>
          </li>
          <li className={selectedItem === 'customers' ? 'menuSelected' : ''}  onClick={() => handleNavItemClick('customers')}>
            <a href="#"><img src="../meni-ic-2.png" /></a>
            <div class="mainMenu1">Customers</div>
          </li>
 
          <li className={selectedItem === 'settings' ? 'menuSelected' : ''}  onClick={() => handleNavItemClick('settings')}>
            <a href="#"><img src="../meni-ic-4.png" /></a>
            <div class="mainMenu1">Settings</div>
          </li>
          <li>
            <a href="/"><img src="../meni-ic-6.png" /></a>
            <div class="mainMenu1">Logout</div>
          </li>
          <li>
          
    <div className='text-center' style={{paddingLeft:33}}>
      {/* <img src="../meni-ic-4.png" /> */}
    </div>
        <div class="mainMenu1"></div>
            {/* <SplitButton
              key="end"
              id={'dropdown-button-drop-end'}
              drop="end"
              variant=""
              title=""
              style={{marginLeft:-20, textAlign:'left'}}
            >
              <Dropdown.Item style={{textAlign:'left'}} eventKey="1" onClick={() => handleNavItemClick('sectors')}>Sectors</Dropdown.Item>
              <Dropdown.Item style={{textAlign:'left'}} eventKey="2" onClick={() => handleNavItemClick('exchanges')}>Exchanges</Dropdown.Item>
              <Dropdown.Item style={{textAlign:'left'}} eventKey="3" onClick={() => handleNavItemClick('currencies')}>Currencies</Dropdown.Item>
              <Dropdown.Item style={{textAlign:'left'}} eventKey="4" onClick={() => handleNavItemClick('subscriptions')}>Subscriptions</Dropdown.Item>
          </SplitButton>       */}
      
            
          </li>
          
        </ul>
      </div>
    </>
    
  );
}

export default SideNav;
