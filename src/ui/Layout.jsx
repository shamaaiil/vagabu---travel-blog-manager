import Navbar from '@/components/Navbar'
import ResponsiveNavbar from '@/components/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

function Layout() {
  return (
    <div>
          <div className="min-h-screen flex flex-col">
      <Navbar/>
      
      <main className="flex-grow p-4">
        <Outlet /> 
      </main>

      {/* <Footer /> */}
      <Footer/>
    </div>
      
    </div>
  )
}

export default Layout
