import React, { useState, useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
import Controller from '../components/Controller/Controller'



import { render } from 'react-dom'
// Import react-circular-progressbar module and styles
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles
} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
// Animation
import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from '../components/Speedometer/AnimatedProgressProvider'
import ChangingProgressProvider from '../components/Speedometer/ChangingProgressProvider'
// Radial separators
import RadialSeparators from '../components/Speedometer/RadialSeparators'



// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

// core components
import {
  chartExample1,
  chartExample2,
  rearScannerChart,
  chartExample4,
} from "variables/charts.js";



function Dashboard(props) {
  const useEventSource = (url) => {
    const [data, updateData] = useState(null);

    useEffect(() => {
      const source = new EventSource(url);

      source.onmessage = function logEvents(event) {
        updateData(JSON.parse(event.data));
      }
    }, [])

    return data;
  }
  const [bigChartData, setbigChartData] = React.useState("data1");
  const setBgChartData = (name) => {
    setbigChartData(name);
  }

  return (
    <>
      <div className="content">
        <Row>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Movements</h5>
                <CardTitle tag="h3"> <i className="tim-icons icon-delivery-fast text-primary" />{" "} Controller </CardTitle>
              </CardHeader>
              <CardBody>
                <Controller />
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Movements</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-delivery-fast text-primary" />{" "}
                  Velocity
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: 221 }}>
                    <ChangingProgressProvider
                      easingFunction={easeQuadInOut}>
                      {value => (
                        <CircularProgressbar
                          value={value}
                          text={`${value} km/h`}
                          maxValue={12}
                          circleRatio={0.75}
                          strokeWidth={4}
                          styles={buildStyles({
                            rotation: 1 / 2 + 1 / 8,
                            strokeLinecap: "butt",
                            textColor: "#2375c6",
                            pathColor: "#2375c6",
                            trailColor: "#13406c",
                            textSize: '100%'
                          })}
                        />
                      )}
                    </ChangingProgressProvider>
                  </div>

                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Front Scanner</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-send text-info" />
                  Distance
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={chartExample4.data}
                    options={chartExample4.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Movements</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-sound-wave text-info" />
                  Velocity
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={chartExample1.data}
                    options={chartExample1.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Diagnostic</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-delivery-fast text-primary" />{" "}
                  Voltage
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Bar
                    data={chartExample4.data}
                    options={chartExample4.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Rear Scanner</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-send text-info" />
                  Distance
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={rearScannerChart.data}
                    options={rearScannerChart.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

      </div>
    </>
  );
}

export default Dashboard;
