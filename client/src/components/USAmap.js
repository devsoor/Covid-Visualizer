import React, {useState, useEffect} from 'react';
import * as d3 from 'd3';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import moment from 'moment';
import {Card, CardBody, Container, Input, Row, Col, Button, ButtonGroup, UncontrolledTooltip} from 'reactstrap';

import statesCoordsCSV from '../assets/data/statelatlong.csv';
import CurrentUSData from '../components/CurrentUSData';
import BarGraph from '../components/BarGraph';
import LineGraph from '../components/LineGraph';
import StateGraph from '../components/StateGraph';

const USAMap = () => {
    const today = moment().format("MMM  DD, YYYY");
    const width = 975;
    const height = 610;
    const [geography, setGeography] = useState([]);
    const [mapType, setType] = useState("states");
    const [statesDailyData, setStatesDailyData] = useState([]);
    const [statesCurrentData, setStatesCurrentData] = useState([]);
    const [currentUSData, setCurrentUSData] = useState({});
    const [statesCoords, setStatesCoords] = useState([]);
    const [stateClicked, setStateClicked] = useState("WA");
    const [stateListAbbr, setStateListAbbr] = useState([]);
    const [graphType, setGraphType] = useState("bar");
    
    const randomColorGenerator = () => { 
        return '#' + (Math.random().toString(16) + '0000000').slice(4, 8); 
    };

    const projection = geoAlbersUsa()
        .scale(1300)
        .translate([ width/2, height/2])

    useEffect(() => {
        fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json")
            .then(response => {
                if (response.status !== 200) {
                    console.log("Error: ", response.status)
                    return;
                }
                response.json().then(us => {
                    console.log("response data = ", us)
                    setGeography(feature(us, us.objects.states).features);
                    
                })
            })

        fetch("https://covidtracking.com/api/states")
          .then(response => {
                if (response.status !== 200) {
                    console.log("Error: ", response.status)
                    return;
                }
                response.json().then(data => {
                    console.log("states current data = ", data)
                    setStatesCurrentData(data);
                })
            })

        fetch("https://covidtracking.com/api/states/daily")
          .then(response => {
                if (response.status !== 200) {
                    console.log("Error: ", response.status)
                    return;
                }
                response.json().then(data => {
                    console.log("states daily data = ", data)
                    setStatesDailyData(data);
                })
            })

        fetch("https://covidtracking.com/api/us")
          .then(response => {
                if (response.status !== 200) {
                    console.log("Error: ", response.status)
                    return;
                }
                response.json().then(data => {
                    console.log("current US data = ", data)
                    setCurrentUSData(data[0]);
                })
            })


            d3.csv(statesCoordsCSV)
            .then((data) => {
                setStatesCoords(data);
                data.map(s => {
                    stateListAbbr.push(s.State);
                    setStateListAbbr(stateListAbbr);
                })
                console.log("stateListAbbr: ", stateListAbbr)
            })
            .catch((err) => {
                throw err;
            })
    }, [])

    const normalize = (min, max, value) => {
        // console.log("normalize: min, max, value = ", min, max, value)
        const result = ((value - min) / (max - min));
        // console.log("normalize result = ", result)
        return result;
    }

    const normlaizeLog = (state, value) => {
        if (Math.log2(value) == "-Infinity") {
            // console.log("normlaizeLog: -Infinity found for state ", state)
        } else {
            return Math.log2(value);
        }
    }

    const validateState = (state) => {
        const stateInfo = statesCoords.find(({State}) => State === state)
        if (!stateInfo) {
            // console.log(`validateState: long lat not found for ${state}. Returning null`)
            return false;
        } else {
            return true;
        }
    }

    const getLongLat = (state) => {
        const stateInfo = statesCoords.find(({State}) => State === state);
        if (!stateInfo) {
            return null;
        }
        return [stateInfo.Longitude, stateInfo.Latitude];
    }
    
    const handleClick = countryIndex => {
        const stateName = (geography[countryIndex].properties.name);
        const stateAbbr = statesCoords.find(({Name}) => Name === stateName)
        setStateClicked(stateAbbr.State);
    }

    const handleMarkerClick = countryIndex => {
        const stateName = (geography[countryIndex].properties.name);
        const stateAbbr = statesCoords.find(({Name}) => Name === stateName)
        setStateClicked(stateAbbr.State);
    }

    const handleChange = (e) => {
        setStateClicked(e.target.value)
    } 

    return (
        <Container>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                                <Row className="justify-content-center">
                                    <h3 className="text-dark  p-3">
                                        COVID-19 Tests and Results as of {today}
                                    </h3>
                                    <CurrentUSData currentUSData={currentUSData}/>
                                </Row>
                        </CardBody>
                    </Card>                 
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <Row>
                            <Col sm={10}>
                            <svg width={ width } height={ height } viewBox="0 0 975 610">
                                <g className="state-boundary">
                                {
                                    geography.map((d,i) => (
                                    <path
                                        key={ `path-${ i }` }n
                                        d={ geoPath().projection(projection)(d) }
                                        className={mapType}
                                        fill={ `rgba(100,120,180,${ 1 / geography.length * i})` }
                                        stroke="#FFFFFF"
                                        strokeWidth={ 0.5 }
                                        onClick={ () => handleClick(i) }
                                    />
                                    ))
                                }
                                </g>
                    
                                <g className="markers">
                                {
                                    statesCoords.length > 0 && statesCurrentData.map((s, i) => (
                                        validateState(s.state) && <circle
                                            key={ `marker-${i}` }
                                            cx={  projection(getLongLat(s.state))[0] }
                                            cy={ projection(getLongLat(s.state))[1] }
                                            r={ normlaizeLog(s.state, s.positive) }
                                            fill="#E91E63"
                                            stroke="#FFFFFF"
                                            onClick={ () => handleMarkerClick(i) }
                                        />
                                        ))
                                }
                                </g>
                                <g className="markers">
                                {
                                    statesCoords.length > 0 && statesCurrentData.map((s, i) => (
                                        <text key={i}
                                            fontSize="smaller"
                                            x={ getLongLat(s.state) && projection(getLongLat(s.state))[0] }
                                            y={ getLongLat(s.state) && projection(getLongLat(s.state))[1] }
                                        >
                                            <tspan>{s.state}-</tspan><tspan>{s.positive}</tspan>
                                        </text>
                                    ))
                                }
                                </g>
                            </svg> 
                            </Col>  
                            <Col sm={2}>
                                <Input type="select" name="stateClicked" onChange={handleChange}>
                                <option value="">Select State</option>
                                    {stateListAbbr.map(option => <option key={option} value={option}>{option}</option>)}
                                </Input>
                            </Col>
                            </Row>
                        </CardBody>
                    </Card>                 
                </Col>
            </Row>
            <Row>
                <StateGraph stateClicked={stateClicked} statesDailyData={statesDailyData}/>
            </Row>
            <Row className="justify-content-center">
               <ButtonGroup className="pull-right" >
                    <UncontrolledTooltip placement="top" target="showBarGraph">
                        One State
                    </UncontrolledTooltip>
                    <UncontrolledTooltip placement="top" target="showLineGraph">
                    All States
                    </UncontrolledTooltip>

                    <Button id="showBarGraph" className="bg-primary text-white" outline style={{border:1}} onClick={()=> setGraphType("bar")}>Bar Graph</Button>
                    <Button id="showLineGraph"  className="bg-success text-white" outline style={{border:1}} onClick={()=>setGraphType("line")}>Line Graph</Button>
                </ButtonGroup>
            </Row>
            <Row>
                {
                    graphType == "bar" && <BarGraph statesCurrentData={statesCurrentData} statesCoords={statesCoords}/>
                }
                {
                    graphType == "line" && <LineGraph statesCurrentData={statesCurrentData} statesCoords={statesCoords}/>
                }
                
            </Row>
        </Container>
    )
}

export default USAMap;