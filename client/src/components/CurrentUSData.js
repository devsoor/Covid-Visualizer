import React from 'react';
import { Col, Row, Card, CardBody } from 'reactstrap';

const CurrentUSData = (props) => {
    const data = props.currentUSData;
    const positiveTests = data.positive ? data.positive.toLocaleString() : 0;
    const negativeTests = data.negative ? data.negative.toLocaleString() : 0;
    const hospitalizedTests = data.hospitalized ? data.hospitalized.toLocaleString() : 0;
    const deaths = data.death ? data.death.toLocaleString() : 0;
    const totalCases = data.total ? data.total.toLocaleString() : 0;

    return (
        <Row>
          <Col>
            <Card className="bg-success">
              <CardBody>
                <div className="d-flex flex-row">
                  <div className="round align-self-center round-success">
                    <i className="mdi mdi-library-plus" />
                  </div>
                  <div className="ml-2 align-self-center">
                    <h4 className="mb-0 text-white">{positiveTests}</h4>
                    <h6 className="text-white op-5">Positive</h6>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
  
          <Col>
            <Card className="bg-danger">
              <CardBody>
                <div className="d-flex flex-row">
                  <div className="round align-self-center round-danger">
                    <i className="mdi mdi-cellphone-link" />
                  </div>
                  <div className="ml-2 align-self-center">
                    <h4 className="mb-0 text-white">{negativeTests}</h4>
                    <h6 className="text-white op-5">Negative</h6>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
  
          <Col>
            <Card className="bg-warning">
              <CardBody>
                <div className="d-flex flex-row">
                  <div className="round align-self-center round-warning">
                    <i className="mdi mdi-cart-outline" />
                  </div>
                  <div className="ml-2 align-self-center">
                    <h3 className="mb-0 text-white">{hospitalizedTests}</h3>
                    <h6 className="text-white op-5">Hospitialized</h6>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
  
          <Col>
            <Card className="bg-dark">
              <CardBody>
                <div className="d-flex flex-row">
                  <div className="round align-self-center round-dark">
                    <i className="mdi mdi-bullseye" />
                  </div>
                  <div className="ml-2 align-self-center">
                    <h4 className="mb-0 text-white">{deaths}</h4>
                    <h6 className="text-white op-5">Deaths</h6>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col>
            <Card className="bg-primary">
              <CardBody>
                <div className="d-flex flex-row">
                  <div className="round align-self-center round-primary">
                    <i className="mdi mdi-bullseye" />
                  </div>
                  <div className="ml-2 align-self-center">
                    <h4 className="mb-0 text-white">{totalCases}</h4>
                    <h6 className="text-white op-5">TOTAL</h6>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      );
}

export default CurrentUSData;