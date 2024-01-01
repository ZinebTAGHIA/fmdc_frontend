import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";

class StudentTPsChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        xaxis: {
          categories: [],
        },
      },
      series: [
        {
          name: "note",
          data: [],
        },
      ],
    };
  }

  componentDidMount() {
    this.updateChartData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.pws !== this.props.pws) {
      this.updateChartData();
    }
  }

  updateChartData = () => {
    const { pws } = this.props;
    if (pws && pws.length > 0) {
      const categories = pws.map((pw) => pw.pw.title);
      const data = pws.map((pw) => (pw.noteFront + pw.noteSide) / 2);

      this.setState({
        options: {
          ...this.state.options,
          xaxis: {
            categories,
          },
        },
        series: [
          {
            ...this.state.series[0],
            data,
          },
        ],
      });
    }
  };

  render() {
    const { pws } = this.props;

    if (!pws || pws.length === 0) {
      return <div>No data available for this student</div>;
    }

    return (
      <div className="app">
        <div className="row">
          <div className="mixed-chart">
            <ReactApexChart
              options={this.state.options}
              series={this.state.series}
              type="line"
              width={500}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default StudentTPsChart;
