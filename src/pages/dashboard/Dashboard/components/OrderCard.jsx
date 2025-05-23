import React from 'react'

const OrderCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-pinkclr font-semibold ">{title}</p>
          <h3 className="text-2xl  mt-1">{value}</h3>
          <button className="text-pinkclr text-sm mt-1">View all</button>
        </div>
        <div className="bg-teelclr p-3 rounded-full">
          <div className="text-2xl text-white">
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderCard 