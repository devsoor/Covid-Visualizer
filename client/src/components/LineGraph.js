import React from 'react';
import {Card, CardBody, Col} from 'reactstrap';
import {Line} from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

const LineGraph = (props) => {
    const {statesDailyData, statesCoords} = props;
    const randomColorGenerator = () => { 
      return '#' + (Math.random().toString(16) + '0000000').slice(4, 8); 
    };

    const confirmedCases = () => {
        const data = {
          labels: [],
        //   backgroundColor: randomColorGenerator(),
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
        <h3>Test results over past 3 weeks</h3>
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
                        'type': "logarithmic",
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
}

export default LineGraph;