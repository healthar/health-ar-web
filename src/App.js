import React from 'react';
import './App.scss';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from './Login';
import Map from './Map';

function App() {
  return (
    <BrowserRouter>
        <Switch>
          <Route
            exact={true}
            path="/"
            component={Login}
          />
           <Route
            exact={true}
            path="/map"
            component={Map}
          />
        </Switch>
      </BrowserRouter>
  );
}

export default App;
