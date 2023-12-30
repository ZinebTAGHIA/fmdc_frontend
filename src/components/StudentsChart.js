import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
const ComptesChart = (props) => {
  const [series, setSeries] = useState([
    props.nbrComptesAct,
    props.nbrComptesDesact,
  ]);

  const options = {
    chart: {
      width: 380,
      type: "pie",
      toolbar: {
        show: true,
      },
    },
    fill: {
      colors: ["#008FFB", "#FF4560"],
      opacity: 0.9,
    },
    labels: ["activés", "désactivés"],
    legend: {
      position: "top",
      markers: {
        fillColors: ["#008FFB", "#FF4560"],
      },
    },
    tooltip: {
      fillSeriesColor: false,
      marker: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <ReactApexChart options={options} series={series} type="pie" width={380} />
  );
};

export default ComptesChart;
