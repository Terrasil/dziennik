import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function Schedule() {
  return (
    <>
        <Router>
            <Switch>
                <Route path="/day">
                    day
                </Route>
                <Route exact path="/week">
                    week
                </Route>
                <Route path="/month">
                    month
                </Route>
            </Switch>
        </Router>
    </>
  );
}

export default Schedule;
