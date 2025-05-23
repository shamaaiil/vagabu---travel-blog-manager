import React from 'react';
import Chart from 'react-apexcharts';

const OrdersOverviewGraph = () => {
  const chartConfig = {
    type: "area",
    height: 300,
    series: [
      {
        name: "Orders",
        data: [2000, 2500, 2300, 2200, 2400, 2100, 2600, 2500, 2700, 2400, 2200, 2100],
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      colors: ['#03A7A7'], // Changed to teelclr
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 90, 100]
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      grid: {
        show: true,
        borderColor: '#f8fafc',
        strokeDashArray: 0,
        position: 'back',
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            colors: '#64748b',
            fontSize: '13px',
            fontFamily: 'inherit',
            fontWeight: 300,
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#64748b',
            fontSize: '13px',
            fontFamily: 'inherit',
            fontWeight: 300,
          },
        },
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Orders Overview</h3>
        <p className="text-sm text-gray-600">Monthly orders performance</p>
      </div>
      <Chart {...chartConfig} />
    </div>
  );
};

export default OrdersOverviewGraph; 