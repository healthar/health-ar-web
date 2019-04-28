import React from 'react';
import './App.scss';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from './Login';

function App() {
  return (
    <BrowserRouter>
        <Switch>
          <Route
            exact={true}
            path="/"
            component={Login}
          />
        </Switch>
      </BrowserRouter>
  );
}

export default App;
