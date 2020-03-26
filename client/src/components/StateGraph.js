import React, {useState} from 'react';
import {Line} from 'react-chartjs-2';
import { CardTitle } from 'reactstrap';

const StateGraph = (props) => {
    const {stateClicked, statesDailyData} = props;
    console.log("statesDailyData: ", statesDailyData)
    console.log("State clicked", stateClicked )
    const confirmedCases = () => {
        const caseArr = []
        const dateArr = []
        statesDailyData.slice(0).reverse().map((daily, i) => {
            (stateClicked === daily.state) && caseArr.push(daily.positive) && dateArr.push(daily.date)
        })
        console.log("case array", caseArr)
        console.log("date", dateArr)
        return [caseArr, dateArr]
    }

    const data = {
        labels: confirmedCases()[1],
        datasets: [
        {
            label: '# of confirmed cases',
            data: confirmedCases()[0],
            fill: false,          // Fill area under the line?
            borderColor: 'red'  // Line color
        }
        ]
    }

    const options = {
        maintainAspectRatio: true	// Don't maintain w/h ratio
    }
    
    return (
        <div>
        <CardTitle className="bg-primary mt-3 mb-3 text-white">State: {stateClicked}</CardTitle>
            <header>
              <h1>Growth over past 21 days</h1>
            </header>
            <article className="canvas-container">
              <Line data={data} options={options}/>
            </article>
          </div>
    )
}

export default StateGraph;