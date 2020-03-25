import React, {useState} from 'react';
import {Line} from 'react-chartjs-2';
import { CardTitle } from 'reactstrap';

const StateGraph = (props) => {
    const {stateClicked, statesDailyData} = props;
    console.log("statesDailyData: ", statesDailyData)
    return (
        <CardTitle className="bg-primary mt-3 mb-3 text-white">State: {stateClicked}</CardTitle>
    )
}

export default StateGraph;