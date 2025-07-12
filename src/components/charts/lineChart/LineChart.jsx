import React, { PureComponent } from "react";
import "./LineChart.scss";
import { data } from "../../../data/PaymentTrendData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={7}
          textAnchor="middle"
          fill="white"
          transform="rotate(0)"
          fontSize={7}
        >
          {payload.value}
        </text>
      </g>
    );
  }
}
const LineChartAnalytics = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={500}
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          height={20}
          tick={<CustomizedAxisTick />}
          stroke="white"
        />
        <YAxis stroke="white" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="pv" stroke="orange" />
        <Line type="monotone" dataKey="uv" stroke="red" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartAnalytics;
