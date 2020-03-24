import React, {useState, useEffect} from 'react';
import * as d3 from 'd3';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import moment from 'moment';
import { Row, Col, Container} from 'reactstrap';
import statesCoordsCSV from '../assets/data/statelatlong.csv';
import CurrentUSData from '../components/CurrentUSData';

// const today = moment.utc().toDate().local().format("MMM  DD, YYYY");

const USAMap = () => {
    const width = 975;
    const height = 610;
    const [geography, setGeography] = useState([]);
    const [mapType, setType] = useState("states");
    const [covidData, setCovidData] = useState([]);
    const [statesDailyData, setStatesDailyData] = useState([]);
    const [statesCurrentData, setStatesCurrentData] = useState([]);
    const [currentUSData, setCurrentUSData] = useState({});
    const [statesCoords, setStatesCoords] = useState([]);
      
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
                // statesCoords.push(data);
                console.log("d3.csv: statesCoords = ", statesCoords)
            })
            .catch((err) => {
                throw err;
            })
    }, [])

    const getLongLat = (state) => {
        const stateInfo = statesCoords.find(({State}) => State === state);
        if (!stateInfo) return null;
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
            <Row>
                {/* <h3> Covid-19 status as of: {today}</h3> */}
            </Row>
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
                                fill={ `rgba(10,200,200,${ 1 / geography.length * i})` }
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
                                <circle
                                    key={ `marker-${i}` }
                                    cx={ getLongLat(s.state) && projection(getLongLat(s.state))[0] }
                                    cy={ getLongLat(s.state) &&  projection(getLongLat(s.state))[1] }
                                    r={ 10 }
                                    fill="#E91E63"
                                    stroke="#FFFFFF"
                                    onClick={ () => handleMarkerClick(i) }
                                />
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