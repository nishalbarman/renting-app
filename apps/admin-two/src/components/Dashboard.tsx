import React from "react";
import { Bar, Line, PolarArea, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
);

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

import TransactionsTable from "./TransactionsTable";

const data = {
  labels: ["July", "August", "September", "October", "November", "December"],
  datasets: [
    {
      label: "Revenue",
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(75,192,192,0.6)",
      hoverBorderColor: "rgba(75,192,192,1)",
      data: [65000, 59000, 80000, 81000, 56000, 55000, 40000],
    },
  ],
};

const Dashboard: React.FC<{ setNavbarToogle?: any }> = () => {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs(Date.now()));

  return (
    <div className="flex flex-col flex-1 p-6 bg-gray-100 ml-64 max-md:ml-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div>
          <input
            type="text"
            placeholder="Type anywhere to search"
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Revenue</h2>
          <p className="text-2xl font-semibold text-gray-900">Rs. 123,000</p>
          <p className="text-green-500 mt-2">+5% vs last month</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Weekly Sales
          </h2>
          <p className="text-2xl font-semibold text-gray-900">Rs. 24,000</p>
          <p className="text-red-500 mt-2">-71% of total goals</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Total Orders
          </h2>
          <p className="text-2xl font-semibold text-gray-900">23k</p>
          <p className="text-green-500 mt-2">+71% vs last month</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Total Users
          </h2>
          <p className="text-2xl font-semibold text-gray-900">10k</p>
          <p className="text-red-500 mt-2">-71% of total goals</p>
        </div>
      </div>
      <div className="grid grid-cols-1 grid-rows-flow lg:grid-cols-2  w-full gap-7">
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 w-full ">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Orders</h2>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={["year", "month"]}
                  value={value}
                  onChange={setValue}
                />
              </LocalizationProvider>
            </div>
          </div>
          <Bar data={data} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 w-full ">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Revenue
            </h2>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={["year", "month"]}
                  value={value}
                  onChange={setValue}
                />
              </LocalizationProvider>
            </div>
          </div>
          <Line data={data} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-6 w-full">
          <div className="flex justify-between mb-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Users</h2>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={["year", "month"]}
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                />
              </LocalizationProvider>
            </div>
          </div>
          <PolarArea data={data} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-6 w-full">
          <div className="flex justify-between mb-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Users</h2>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={["year", "month"]}
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                />
              </LocalizationProvider>
            </div>
          </div>
          <Pie data={data} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md aspect-[16/9] ">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Transactions
            </h2>
          </div>
          <div>
            <TransactionsTable />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md aspect-[16/9] ">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              New Registrations
            </h2>
          </div>
          <div>
            <TransactionsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
