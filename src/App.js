import React, { Component } from 'react';
import './stylesheet/App.scss';
import Header from './container/header/header'
import ContainerPage from './container/containerPage/containerPage'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }
  render() {
    return (
        <div className="App">
          <Header />
          <ContainerPage />
        </div>
    );
  }
}

export default App;
