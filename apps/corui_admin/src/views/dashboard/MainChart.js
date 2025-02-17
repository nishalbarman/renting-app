import React, { useEffect, useMemo, useRef, useState } from 'react'

import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import { useSelector } from 'react-redux'

import axios from 'axios'

const MainChart = ({ activeMonth, chartData }) => {
  const chartRef = useRef(null)

  return (
    <>
      <CChartLine
        ref={chartRef}
        style={{ height: '300px', marginTop: '40px' }}
        data={{
          labels: chartData?.map((item) => `${item.date}`),
          datasets: [
            {
              label: 'Joined Users',
              backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, .1)`,
              borderColor: getStyle('--cui-info'),
              pointHoverBackgroundColor: getStyle('--cui-info'),
              borderWidth: 2,
              data: chartData?.map((item) => +item.count),
              fill: true,
            },
            // {
            //   label: 'My Second dataset',
            //   backgroundColor: 'transparent',
            //   borderColor: getStyle('--cui-success'),
            //   pointHoverBackgroundColor: getStyle('--cui-success'),
            //   borderWidth: 2,
            //   data: [
            //     random(50, 200),
            //     random(50, 200),
            //     random(50, 200),
            //     random(50, 200),
            //     random(50, 200),
            //     random(50, 200),
            //     random(50, 200),
            //   ],
            // },
            // {
            //   label: 'My Third dataset',
            //   backgroundColor: 'transparent',
            //   borderColor: getStyle('--cui-danger'),
            //   pointHoverBackgroundColor: getStyle('--cui-danger'),
            //   borderWidth: 1,
            //   borderDash: [8, 5],
            //   data: [65, 65, 65, 65, 65, 65, 65],
            // },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                color: getStyle('--cui-border-color-translucent'),
                drawOnChartArea: false,
              },
              ticks: {
                color: getStyle('--cui-body-color'),
              },
            },
            y: {
              beginAtZero: true,
              border: {
                color: getStyle('--cui-border-color-translucent'),
              },
              grid: {
                color: getStyle('--cui-border-color-translucent'),
              },
              // max: 250,
              ticks: {
                color: getStyle('--cui-body-color'),
                maxTicksLimit: 5,
                stepSize: Math.ceil(250 / 5),
              },
            },
          },
          elements: {
            line: {
              tension: 0.4,
            },
            point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 4,
              hoverBorderWidth: 3,
            },
          },
        }}
      />
    </>
  )
}

export default MainChart
