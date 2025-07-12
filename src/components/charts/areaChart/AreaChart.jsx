import React from "react";
import "./AreaChart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Sun", uv: 4000, pv: 2400, total: 2400 },
  { day: "Mon", uv: 3000, pv: 1398, total: 2210 },
  { day: "Tues", uv: 2000, pv: 9800, total: 2290 },
  { day: "Wed", uv: 2780, pv: 3908, total: 2000 },
  { day: "Thur", uv: 1890, pv: 4800, total: 2181 },
  { day: "Fri", uv: 2390, pv: 3800, total: 2500 },
  { day: "Sat", uv: 3490, pv: 4300, total: 2100 },
];

const Chart = () => (
  <ResponsiveContainer width="100%" height={200}>
    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="5%"
            stopColor="var(--secondaryColor)"
            stopOpacity={0.8}
          />
          <stop
            offset="95%"
            stopColor="var(--secondaryColor)"
            stopOpacity={0}
          />
        </linearGradient>
      </defs>

      <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
      <XAxis dataKey="day" stroke="white" />
      <YAxis stroke="white" />
      <Tooltip />
      <Area
        type="monotone"
        dataKey="total"
        stroke="#003b6d"
        fill="url(#total)"
        fillOpacity={1}
      />
    </AreaChart>
  </ResponsiveContainer>
);

export default Chart;
