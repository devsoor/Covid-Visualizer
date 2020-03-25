import React, {useState} from 'react';
import {Bar} from 'react-chartjs-2';
// import 'chartjs-plugin-datalabels';

const BarGraph = (props) => {
const {statesCurrentData, statesCoords} = props

const getStateName = () => {
  const nameArr=[]
  statesCoords.slice().sort().map((statename, i) => {nameArr.push(statename.Name)})
  return nameArr;
}

const getPosResults = () => {
  const posArr = []
  statesCoords.map((stateName, i) => {
    const stateInfo = statesCurrentData.find(({state}) => state === stateName.State)
    stateInfo && posArr.push(stateInfo.positive)

  })

  statesCurrentData.slice().sort().map((statenum, i) => {posArr.push(statenum.positive)})


  return posArr;
}


const data = {
  labels: getStateName(),
  datasets: [
    {
      label: 'Current Cases',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: getPosResults()
    }
  ]
};


    return (
      <div>
        <h2>CoVID-19 Comparison By State</h2>
        <Bar
          data={data}
          width={1200}
          height={500}
          options={{
          maintainAspectRatio: true
          }}
        />
      </div>
    );
  };

export default BarGraph;