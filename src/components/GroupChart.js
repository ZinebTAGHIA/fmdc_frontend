import axios from "../api/axios";
import React from "react";
import ReactApexChart from "react-apexcharts";

class GroupChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [],
      options: {
        chart: {
          height: 350,
          type: "bar",
          events: {
            click: function (chart, w, e) {
              // console.log(chart, w, e)
            },
          },
          toolbar: {
            show: true,
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "45%",
            distributed: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: true,
          position: "top",
        },
        xaxis: {
          categories: props.pws.map((pw) => pw.title),
          labels: {
            style: {
              fontSize: "12px",
            },
          },
        },
      },
    };
  }
  componentDidMount() {
    this.fetchChartData();
  }

  fetchChartData = () => {
    const { pws } = this.props;

    const requests = pws.map((pw) =>
      axios
        .get(`/api/pws/nbrGroup/${pw.id}`)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error);
          return null;
        })
    );

    Promise.all(requests)
      .then((responseData) => {
        const seriesData = [
          {
            name: "groupes",
            data: responseData.filter(Boolean),
          },
        ];

        this.setState({ series: seriesData });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  render() {
    const { options, series } = this.state;

    return (
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        width={380}
      />
    );
  }
}

export default GroupChart;
