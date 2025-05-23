import React from 'react'

const DashboardCard = ({ icon, title, value, subtext, iconBgColor, iconColor }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        {icon && (
          <div className={`${iconBgColor || 'bg-gray-100'} p-3 rounded-full`}>
            <div className={`text-2xl ${iconColor || 'text-pink-500'}`}>
              {icon}
            </div>
          </div>
        )}
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">
            {value.startsWith('$') ? value : `${value}`}
          </h3>
          {subtext && (
            <p className="text-sm text-gray-500 mt-1">{subtext}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardCard
