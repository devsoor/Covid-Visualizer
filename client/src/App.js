import React from 'react';
import USAMap from './components/USAmap';
import { Container } from 'reactstrap';

function App() {
  return (
    <Container fluid className="bg-light text-dark">
      <USAMap/>
    </Container>
  );
}

export default App;
