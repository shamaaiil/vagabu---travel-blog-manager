import React from 'react'
import { FaUsers } from 'react-icons/fa'

const StatCard = ({ icon, title, value, iconBgColor, iconColor }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col items-center justify-center text-center gap-4">
        {icon && (
          <div className={`${iconBgColor} p-3 rounded-full`}>
            <div className={`text-2xl text-white`}>
              {icon}
            </div>
          </div>
        )}
        <div>
          <h3 className="text-2xl font-semibold">
            {value}
          </h3>
          <p className="text-gray-600 text-sm mt-1">{title}</p>
        </div>
      </div>
    </div>
  )
}

export default StatCard 