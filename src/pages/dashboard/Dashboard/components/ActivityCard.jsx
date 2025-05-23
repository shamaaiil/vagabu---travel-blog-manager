import React from 'react';

const ActivityCard = ({ activities = [] }) => {
  const activityList = activities || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800">Activity</h3>
      <div className="mt-4">
        {activityList.length > 0 ? (
          activityList.map((activity, index) => (
            <div key={index} className="flex items-start mb-4">
              <div className="mr-4 flex items-center">
                <p className="text-gray-800">{activity.date}</p>
                <span className="text-teelclr ml-2">➔</span>
              </div>
              <div className="flex-1">
                <p className="text-pinkclr mb-1">{activity.title}</p>
                <p className="text-gray-800">
                  <span className="font-semibold">{activity.user}</span>{' '}
                  <span className="text-gray-500">{activity.description}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-4 text-center text-gray-500">
            No activities to display
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;