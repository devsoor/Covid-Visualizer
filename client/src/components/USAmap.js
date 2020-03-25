import React, {useState, useEffect} from 'react';
import * as d3 from 'd3';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import moment from 'moment';
import { Row, Col, Container, Nav, Navbar, NavbarBrand} from 'reactstrap';
import statesCoordsCSV from '../assets/data/statelatlong.csv';
import CurrentUSData from '../components/CurrentUSData';

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
    
    const randomColorGenerator = () => { 
        return '#' + (Math.random().toString(16) + '0000000').slice(4, 8); 
    };

    const projection = geoAlbersUsa()
        .scale(1300)
        .translate([ width/2, height/2])

    const color = d3.scaleQuantize([1, 10], d3.schemeBlues[9])

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
                // statesCoords.push(data);
                console.log("d3.csv: statesCoords = ", statesCoords)
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
            // console.log(`getLongLat: long lat not found for ${state}. Returning null`)
            return null;
        }
        return [stateInfo.Longitude, stateInfo.Latitude];
    }
    
    const handleClick = countryIndex => {
        console.log("geography = ", geography)
        console.log("handleClick: statesCoords = ", statesCoords)
        console.log("Clicked on state: ", geography[countryIndex].properties.name)
        console.log("Clicked on state object: ", geography[countryIndex])
    }

    const handleMarkerClick = i => {
        console.log("Marker: ", geography[i])
    }

    return (
        <Container className="mt-4">
            <Navbar light expand="md">
                <NavbarBrand className="text-grey">COVID-19 Status as of {today}</NavbarBrand>
            </Navbar>
        
            <Row>
                <CurrentUSData currentUSData={currentUSData}/>
            </Row>
            <Row>
                <Col>
                    <svg width={ width } height={ height } viewBox="0 0 975 610">
                        <g className="state-boundary">
                        {
                            geography.map((d,i) => (
                            <path
                                key={ `path-${ i }` }
                                d={ geoPath().projection(projection)(d) }
                                className={mapType}
                                fill={ `rgba(135,206,250,${ 1 / geography.length * i})` }
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
                                    {/* <tspan x={ getLongLat(s.state) && projection(getLongLat(s.state))[0] } dy="1.2em">{s.state}</tspan>
                                    <tspan x={ getLongLat(s.state) && projection(getLongLat(s.state))[0] } dy="1.2em">{s.positive}</tspan> */}
                                    <tspan>{s.state}-</tspan><tspan>{s.positive}</tspan>
                                </text>
                            ))
                        }
                        </g>
                    </svg>                    
                </Col>
            </Row>
        </Container>
    )
}

export default USAMap;