import React, {useState, useEffect} from 'react';
import * as d3 from 'd3';
import { geoEqualEarth, geoAlbersUsa, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import { Row, Col, Form, Label, Input, Container} from 'reactstrap';
import data from '../assets/us_states_covid19_daily.csv';

// d3.csv(data, function(data) { console.log(data); });

d3.csv(data).then((data) => {
    console.log(data)
}).catch(function(err) {
    throw err;
})

const USAMap = () => {
    const [states, setStates] = useState([]);
    const [counties, setCounties] = useState([]);
    const [geography, setGeography] = useState([]);
    const [mapType, setType] = useState("states");
      
    const projection = geoAlbersUsa()
        .scale(1000)
        .translate([ 800 / 2, 450 / 2 ])

    useEffect(() => {
        fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json")
            .then(response => {
                if (response.status !== 200) {
                    console.log("Error: ", response.status)
                    return;
                }
                response.json().then(us => {
                    setStates(feature(us, us.objects.states).features)
                    setCounties(feature(us, us.objects.counties).features)
                    setGeography(states);
                })
            })
    }, [])

    const handleClick = countryIndex => {
        console.log("Clicked on state: ", geography[countryIndex].properties.name)
        console.log("Clicked on state object: ", geography[countryIndex])
    }

    const handleChange = e => {
        console.log("handleChange: e.target", e.target.name)
        console.log("handleChange: e.target", e.target.value)
        setType({...mapType, [e.target.name]: e.target.value})
        e.target.value == "states" ? setGeography(states) : setGeography(counties); 
    }

    const ShowMap = () => {
        return (
            <g className="country">
            {
                geography.map((d,i) => (
                <path
                    key={ `path-${ i }` }
                    d={ geoPath().projection(projection)(d) }
                    className={mapType}
                    fill={ `rgba(38,50,56,${ 1 / geography.length * i})` }
                    stroke="#FFFFFF"
                    strokeWidth={ 0.5 }
                    onClick={ () => handleClick(i) }
                />
                ))
            }
            </g>
        )
    }

    return (
        <Container className="mt-4">
            <Row>
                <Col sm={2}><Label>Select map type: </Label></Col>
                <Col sm={4}>
                    <Input type="select" name="mapType" onChange={handleChange}>
                        <option value="">- Select State or County map -</option>
                        <option value="states">State</option>
                        <option value="counties">County</option>
                    </Input>
                </Col>
            </Row> 
            <Row>
                <Col>
                    <svg width={ 800 } height={ 450 } className="choropleth Blues" viewBox="0 0 800 450">
                        <ShowMap/>
    
                    </svg>
                </Col>
            </Row>
        </Container>
    )
}

export default USAMap;