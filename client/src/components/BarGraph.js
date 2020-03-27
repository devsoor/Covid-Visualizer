import React from 'react';
import {Card, CardBody, Col} from 'reactstrap';
import {Bar} from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';


const BarGraph = (props) => {
  const {statesCurrentData, statesCoords} = props
  
  const getStateName = () => {
    const nameArr=[]
    statesCoords.slice().sort().map((statename, i) => {nameArr.push(statename.Name)});
    return nameArr;
  }
  
  const getPosResults = () => {
    const posArr = []
    statesCoords.map((stateName, i) => {
      const stateInfo = statesCurrentData.find(({state}) => state === stateName.State);
      stateInfo && posArr.push(stateInfo.positive);
      
    })
    
    statesCurrentData.slice().sort().map((statenum, i) => {posArr.push(statenum.positive)});
    return posArr;
  }

    const data = {
        labels: getStateName(),
        datasets: [
            {
              label: 'Current Cases',
              backgroundColor: 'rgba(26, 94, 255, 1)',
              borderColor: 'rgba(26, 94, 255, 1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(26, 94, 255, 1)',
              hoverBorderColor: 'rgba(26, 94, 255, 1)',
              data: getPosResults()
            }
        ]
      };


    return <Col>
      <Card>
        <CardBody>
        <h2>Comparison By State</h2>
        <Bar
            data={data}
            width={1200}
            height={500}
            options={{
                plugins: {
                  labels: false,
                  clamp: true,
                  datalabels: {
                    align: 'end',
                    anchor: 'end',
                    rotation: 270,
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
        </CardBody>
      </Card>
      </Col>
  };

export default BarGraph;