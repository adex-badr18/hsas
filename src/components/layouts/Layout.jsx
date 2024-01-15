import React from 'react';
import {Outlet} from 'react-router-dom';

const Layout = () => {
  return (
    <div className='min-h-screen'>
        <main className=''>
            <Outlet />
        </main>

        {/* <Footer /> */}
    </div>
  )
}

export default Layout;