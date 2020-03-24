import React, {useState, useEffect} from 'react';
import * as d3 from 'd3';
import { scaleQuantize } from 'd3-scale';
import { geoEqualEarth, geoAlbersUsa, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import { Row, Col, Form, Label, Input, Container} from 'reactstrap';
import covidCSV from '../assets/us_states_covid19_daily.csv';
import statesCoordsCSV from '../assets/statelatlong.csv';

const USAMap = () => {
    const width = 975;
    const height = 610;
    const [states, setStates] = useState([]);
    const [counties, setCounties] = useState([]);
    const [geography, setGeography] = useState([]);
    const [mapType, setType] = useState("states");
    const [covidData, setCovidData] = useState([]);
    const [statesCoords, setStatesCoords] = useState([]);
      
    const projection = geoAlbersUsa()
        .scale(1300)
        .translate([ width/2, height/2])

    const color = d3.scaleQuantize()
        .range(["rgb(237,248,233)", "rgb(186,228,179)",
        "rgb(116,196,118)", "rgb(49,163,84)","rgb(0,109,44)"]);

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

        fetch("https://covidtracking.com/api/states/daily")
          .then(response => {
                if (response.status !== 200) {
                    console.log("Error: ", response.status)
                    return;
                }
                response.json().then(data => {
                    console.log("response data daily traking = ", data)
                    setCovidData(data);
                })
            })


        d3.csv(statesCoordsCSV)
            .then((data) => {
                statesCoords.push(data);
            })
            .catch((err) => {
                throw err;
            })
            .finally(() => {
                console.log("d3.csv: statesCoords = ", statesCoords[0])
                setStatesCoords(statesCoords);

            })

        
    }, [])

    const handleClick = countryIndex => {
        console.log("geography = ", geography)
        console.log("covidData = ", covidData)
        statesCoords[0].map(s => {
            const res = projection([s.Longitude, s.Latitude]);
            console.log(`projection for ${s.Name} ---> ${s.Longitude}, ${s.Latitude} ========> ${res}`)
        })

        console.log("Clicked on state: ", geography[countryIndex].properties.name)
        console.log("Clicked on state object: ", geography[countryIndex])
    }

    const handleMarkerClick = i => {
        console.log("Marker: ", geography[i])
    }

    return (
        <Container className="mt-4">
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
                                fill={ `rgba(10,200,250,${ 1 / geography.length * i})` }
                                stroke="#FFFFFF"
                                strokeWidth={ 0.5 }
                                onClick={ () => handleClick(i) }
                            />
                            ))
                        }
                        </g>
             
                        <g className="markers">
                        {
                            statesCoords.length > 0 && statesCoords[0].map((s, i) => (
                                <circle
                                    key={ `marker-${i}` }
                                    cx={ projection([s.Longitude, s.Latitude])[0] }
                                    cy={ projection([s.Longitude, s.Latitude])[1] }
                                    r={ 10 }
                                    fill="#E91E63"
                                    stroke="#FFFFFF"
                                    // className="marker"
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