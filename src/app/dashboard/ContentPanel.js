// ContentPanel.js
import React from 'react';

import Business from '../business/page';
import DashboardScreen from '../dashboardPage/page';
import Customers from '../customers/page';
import BusinessSubCategories from '../settings/business-sub-categories/page';
import BusinessCategories from '../settings/business-categories/page';
import BannerSubCategories from '../settings/banner-sub-categories/page';
import BannerCategories from '../settings/banner-categories/page';
import BannerSubCategoryItems from '../settings/banner-sub-category-items/page';
import Settings from '../settings/page';

function ContentPanel({ activeItem }) {

  if (!activeItem) {
    activeItem = 'dashboardPage'; // Set the default activeItem to 'dashboardPage'
  }

  return (
    <main className="col-md-10 ms-sm-auto col-lg-11 px-md-4 px-lg-5 py-lg-3 mainContainer">
      {activeItem === 'dashboardPage' && <div><DashboardScreen></DashboardScreen></div>}      
      {activeItem === 'business' && <div><Business></Business></div>}
      {activeItem === 'customers' && <div><Customers></Customers></div>}
      {activeItem === 'settings' && <div><Settings></Settings></div>}
      {activeItem === 'business-categories' && <div><BusinessCategories></BusinessCategories></div>}
      {activeItem === 'business-sub-categories' && <div><BusinessSubCategories></BusinessSubCategories></div>}
      {activeItem === 'banner-categories' && <div><BannerCategories></BannerCategories></div>}
      {activeItem === 'banner-sub-categories' && <div><BannerSubCategories></BannerSubCategories></div>}
      {activeItem === 'banner-sub-category-items' && <div><BannerSubCategoryItems></BannerSubCategoryItems></div>}
    </main>
  );
}

export default ContentPanel;
