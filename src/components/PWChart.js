import React from "react";
import ReactApexChart from "react-apexcharts";

class DemandesChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [
        {
          data: [props.nbrDemEnAtt, props.nbrDemVal, props.nbrDemRef],
        },
      ],
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
        colors: ["#008FFB", "#00FFFF", "#FF4560"],
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
          categories: ["en attente", "validées", "refusées"],
          labels: {
            style: {
              fontSize: "12px",
            },
          },
        },
      },
    };
  }

  render() {
    return (
      <ReactApexChart
        options={this.state.options}
        series={this.state.series}
        type="bar"
        width={380}
      />
    );
  }
}

export default DemandesChart;
