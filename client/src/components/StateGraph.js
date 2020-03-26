import React, {useState} from 'react';
import {Line} from 'react-chartjs-2';
import { CardTitle, Card, CardBody, Col} from 'reactstrap';
import 'chartjs-plugin-datalabels';

const StateGraph = (props) => {
    const {stateClicked, statesDailyData} = props;
    const [numDays, setNumDays] = useState();

    const confirmedCases = () => {
        const caseArr = []
        const dateArr = []
        statesDailyData.slice(0).reverse().map((daily, i) => {
            if (stateClicked === daily.state) {
                caseArr.push(daily.positive);
                const year = daily.date.toString().slice(0,4);
                const month = daily.date.toString().slice(4,6);
                const day = daily.date.toString().slice(6,8);
                const dateString = `${month}-${day}-${year}`
                dateArr.push(dateString)
            }
        })
        return [caseArr, dateArr];
    }

    const randomColorGenerator = function () { 
        return '#' + (Math.random().toString(16) + '0000000').slice(2, 8); 
    };

    const data = {
        labels: confirmedCases()[1],
        backgroundColor: randomColorGenerator(),
        datasets: [
        {
            label: '# of confirmed cases',
            data: confirmedCases()[0],
            fill: true,          // Fill area under the line?
            borderColor: randomColorGenerator()  // Line color
        }
        ]
    }

    const options = {
        maintainAspectRatio: true	// Don't maintain w/h ratio
    }
    
    return <Col>
                <h3>{stateClicked}: Growth over past 3 weeks</h3>
                <Line data={data}
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
        </Col>
}

export default StateGraph;