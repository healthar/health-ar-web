import React from 'react';
import './App.scss';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from './Login';
import Map from './Map';
import ReviewForm from './ReviewForm';
import Signup from './Signup';

function App() {
  return (
    <BrowserRouter>
        <Switch>
          <Route
            exact={true}
            path="/review"
            component={ReviewForm}
          />
           <Route
            exact={true}
            path="/map"
            component={Map}
          />
          <Route
            exact={true}
            path="/"
            component={Login}
          />
          <Route
            exact={true}
            path="/signup"
            component={Signup}
          />
        </Switch>
      </BrowserRouter>
  );
}

export default App;
