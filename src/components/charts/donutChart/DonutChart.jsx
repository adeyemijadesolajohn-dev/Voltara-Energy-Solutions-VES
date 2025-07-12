import React, { useMemo } from "react";
import "./DonutChart.scss";
import PropTypes from "prop-types";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const DonutChart = ({ colors, percentFillValue, cardInfo }) => {
  const FULL_CIRCLE = 360;

  const filled = useMemo(
    () => (percentFillValue / 100) * FULL_CIRCLE,
    [percentFillValue]
  );
  const remained = FULL_CIRCLE - filled;

  const data = useMemo(
    () => [
      { name: "Remained", value: remained },
      { name: "Used", value: filled },
    ],
    [filled, remained]
  );

  const formatTooltip = (value) =>
    `${((value / FULL_CIRCLE) * 100).toFixed(1)}%`;

  return (
    <div className="donutChart">
      <div className="donutInfo">
        <h5 className="infoTitle">{cardInfo?.title || "Untitled"}</h5>
        <div className="infoValue">{cardInfo?.value || "--"}</div>
        <p className="infoText">
          {cardInfo?.text || "No description provided."}
        </p>
      </div>

      <div className="areaCardChart">
        <PieChart width={200} height={200} position="center">
          <Pie
            data={data}
            cx={70}
            cy={88}
            innerRadius={35}
            outerRadius={70}
            startAngle={-270}
            endAngle={150}
            dataKey="value"
            stroke="none"
            paddingAngle={0}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={formatTooltip} />
        </PieChart>
      </div>
    </div>
  );
};

DonutChart.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  percentFillValue: PropTypes.number.isRequired,
  cardInfo: PropTypes.shape({
    title: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    text: PropTypes.string,
  }).isRequired,
};

export default DonutChart;
