import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "../api/axios";

const StudentChart = (props) => {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requests = props.groups.map((group) =>
          axios.get(`/api/groups/nbrStudent/${group.id}`)
        );

        const responses = await Promise.all(requests);

        const data = responses.map((response) => response.data);

        setSeries(data);
      } catch (error) {}
    };

    fetchData();
  }, [props.groups]);

  const options = {
    chart: {
      width: 380,
      type: "pie",
      toolbar: {
        show: true,
      },
    },
    fill: {
      opacity: 0.9,
    },
    labels: props.groups.map((group) => group.code),
    legend: {
      position: "top",
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

export default StudentChart;
