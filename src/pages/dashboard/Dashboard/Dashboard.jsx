import React from 'react'
import DashboardCard from './components/DashboardCard'
import StatCard from './components/StatCard'
import SalesOverviewGraph from './components/SalesOverviewGraph'
import OrdersOverviewGraph from './components/OrdersOverviewGraph'
import { FaDollarSign } from "react-icons/fa";
import { LiaSignalSolid } from "react-icons/lia";
import OrderCard from './components/OrderCard'
import { MdOutlinePendingActions } from "react-icons/md"; 
import { MdLocalShipping } from "react-icons/md";
import { FaStore } from "react-icons/fa";
import { MdDoneAll } from "react-icons/md";
import { FaUsers, FaUserPlus } from "react-icons/fa";
import DynamicTable from '../../../ui/DynamicTable';
import { Typography } from "@material-tailwind/react";
import ActivityCard from './components/ActivityCard';
import RecentCustomersCard from './components/RecentCustomersCard';
import SupportTicketsCard from './components/SupportTicketsCard';

const Dashboard = () => {
  // New stat cards data
  const statCardsData = [
    {
      value: '3,200',
      title: 'New Customers',
      icon: <FaUserPlus />,
      iconBgColor: 'bg-teelclr',
      iconColor: ''
    },
    {
      value: '33,245',
      title: 'All Customers',
      icon: <FaUsers />,
      iconBgColor: 'bg-pinkclr',
      
    },
    {
      value: '320',
      title: 'New Seller',
      icon: <FaStore />,
      iconBgColor: 'bg-teelclrclr',
    },
    {
      value: '3,200',
      title: 'All Seller',
      icon: <FaUsers />,
      iconBgColor: 'bg-orangeclr',
    }
  ]

  // Existing dashboard data
  const dashboardData = [
    {
      icon: <LiaSignalSolid className="text-pinkclr" />,
      title: 'Revenue',
      value: '$25054',
    },
    {
      icon: <FaDollarSign className="text-pinkclr" />,
      title: 'Refund',
      value: '$37802',
    },
    {
      title: 'Current Sales',
      value: '287',
      subtext: '+23% since last month'
    },
    {
      title: 'Recurring Sales',
      value: '$2284',
    }
  ]

  const orderData = [
    {
      title: 'Orders Pending',
      value: '58',
      icon: <MdOutlinePendingActions className="text-white" />,
      bgColor: 'bg-teelclr'
    },
    {
      title: 'Orders Processing',
      value: '22',
      icon: <MdLocalShipping className="text-white" />,
      bgColor: 'bg-teelclr'
    },
    {
      title: 'Orders Completed',
      value: '924',
      icon: <FaStore className="text-white" />,
      bgColor: 'bg-teelclr'
    }
  ]

  // Sample recent orders data
  const recentOrdersColumns = ['Customer Name', 'Date', 'Revenue', 'Order Status'];
  const recentOrdersData = [
    {
      customer_name: 'Kristin Watson',
      date: '2024-02-05',
      revenue: '253.43',
      order_status: 'Pending'
    },
    {
      customer_name: 'Kristin Watson',
      date: '2024-02-08',
      revenue: '558.24',
      order_status: 'Pending'
    },
    // Add more sample data as needed
  ];

  // Sample activity data
  const activityData = [
    { date: '22 Nov 2025', title: 'Returns Request', user: 'andri Jokall', description:"okay"},
    { date: '22 Nov 2025', title: 'Affiliate Withdrawal Requests', user: 'andri Jokall', description:"okay"},
    // Add more activities as needed
  ];
  const customersData = [
    {
      name: "Kristin Watson",
      userId: "# 1130",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      name: "Kristin Watson",
      userId: "# 1130",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    }
  ];
  
  

  // Sample support tickets data
  const supportTicketsData = [
    {
      name: "Chris Adam",
      description: "sdsdsdsdd...",
      date: "04 Sep 2025",
      status: "Resolved",
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      name: "Chris Adam",
      description: "sdsdsdsdd...",
      date: "04 Sep 2025",
      status: "Open",
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      name: "Chris Adam",
      description: "sdsdsdsdd...",
      date: "04 Sep 2025",
      status: "Unresolved",
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      name: "Chris Adam",
      description: "sdsdsdsdd...",
      date: "04 Sep 2025",
      status: "Unresolved",
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      name: "Chris Adam",
      description: "sdsdsdsdd...",
      date: "04 Sep 2025",
      status: "Resolved",
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    }
  ];

  return (
    <div className="p-6  bg-[#F2F7FB] text-textclr">
      {/* Activity Card */}
      

      {/* Dashboard Cards - Moved to top */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.map((item, index) => (
          <DashboardCard
            key={index}
            icon={item.icon}
            title={item.title}
            value={item.value}
            subtext={item.subtext}
          />
        ))}
      </div>
      
      {/* Order Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {orderData.map((item, index) => (
          <OrderCard
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
            bgColor={item.bgColor}
          />
        ))}
      </div>

      {/* Sales Overview Graph */}
      <div className="mt-6">
        <SalesOverviewGraph />
      </div>

      {/* Stat Cards - Moved after graph */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {statCardsData.map((item, index) => (
          <StatCard
            key={index}
            icon={item.icon}
            title={item.title}
            value={item.value}
            iconBgColor={item.iconBgColor}
            iconColor={item.iconColor}
          />
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="mt-6">
        <Typography variant="h6" className="text-xl font-semibold mb-4">
          Recent Orders
        </Typography>
        <DynamicTable
          columns={recentOrdersColumns}
          data={recentOrdersData}
          onEdit={(row) => ('Edit:', row)}
          onDelete={(row) => ('Delete:', row)}
          tableType="orders"
        />
      </div>

      {/* Orders Overview Graph - Moved after table */}
      <div className="mt-6">
        <OrdersOverviewGraph />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <ActivityCard activities={activityData} />
        <RecentCustomersCard customers={customersData} />
        <SupportTicketsCard tickets={supportTicketsData} />
      </div>
    </div>
  )
}

export default Dashboard
