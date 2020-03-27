import React, {useState} from 'react';
import {Row, Col, Card, CardBody, Button, ButtonGroup} from 'reactstrap';
import {Line} from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

const LineGraph = (props) => {
    const [gtype, setGtype] = useState("linear");

    const {statesDailyData, statesCoords} = props;
    const randomColorGenerator = () => { 
      return '#' + (Math.random().toString(16) + '0000000').slice(4, 8); 
    };

    const confirmedCases = () => {
        const data = {
          labels: [],
          datasets: []
      } 

      const dateArr = [];
      statesDailyData.slice(0).reverse().map((daily) => {
            
            const year = daily.date.toString().slice(0,4);
            const month = daily.date.toString().slice(4,6);
            const day = daily.date.toString().slice(6,8);
            const dateString = `${month}-${day}-${year}`
            if (!dateArr.includes(dateString)) {
              dateArr.push(dateString);
            }
      })
      data["labels"] = [...dateArr];


      statesCoords.map((item) => {
          const caseArr = [];  
          const dataSetObj = {
            label: "",
            data: [],
            fill: false,          // Fill area under the line?
            borderColor: randomColorGenerator()  
          }
          statesDailyData.slice(0).reverse().map(daily => {
              if (item.State === daily.state) {
                  caseArr.push(daily.positive);
              }
          })
          dataSetObj["label"] = item.State;
          dataSetObj["data"] = [...caseArr];
          data["datasets"] = [...data["datasets"], dataSetObj]
        });
        
      return data;
    }

    return <Col>
                <Card>
                    <CardBody>
                        <Row className="p-4">
                                <Col sm={8}>
                                    <h3>Test results over past 3 weeks</h3>
                                </Col>
                                <Col sm={4}>
                                <ButtonGroup className="pull-right" >
                                    <Button className="bg-warning text-white" outline style={{border:1}} onClick={()=> setGtype("linear")}>Linear</Button>
                                    <Button  className="bg-danger text-white" outline style={{border:1}} onClick={()=>setGtype("logarithmic")}>Logarithmic</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Line data={confirmedCases}
                            options={{
                                plugins: {
                                    labels: false,
                                    clamp: true,
                                    datalabels: {
                                        display: false,
                                        align: 'end',
                                        fontColor: 'red',
                                        anchor: 'end',
                                        // rotation: 270,
                                        formatter: function(value, context) {
                                                return (value.toLocaleString());
                                        },
                                    },
                                    borderRadius: 4,
                                    color: 'white',
                                    font: {
                                        weight: 'bold'
                                    },
                                },
                                maintainAspectRatio: true,
                                'scales': {
                                    'xAxes': [
                                        {
                                            'gridLines': { 'display': false },
                                            'ticks': { 'fontFamily': 'Poppins', autoSkip: false },
                                
                                        }
                                    ],
                                    'yAxes': [
                                        {
                                            'type':`${gtype}`,
                                            'gridLines': { 'display': true },
                                            'ticks': { 
                                                'fontFamily': 'Poppins',
                                                callback: function(value, index, values) {
                                                    return (value.toLocaleString());
                                                }
                                            }
                                        }
                                    ]
                                },
                            }}
                            />
                        </Row>
                    </CardBody>
        </Card>
    </Col>
}

export default LineGraph;