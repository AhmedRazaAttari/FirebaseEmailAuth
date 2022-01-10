import React, { useEffect, useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from "react-router-dom";

import Signup from './Screens/Signup';
import Home from './Screens/Home';
import Dashboard from './Screens/Admindashboard';

export default function App() {

  return (
    <Router>
      <Route exact path='/' component={Signup} />
      <Route path='/Signup' component={Signup} />
      <Route path='/home' component={Home} />
      <Route path='/Dashboard' component={Dashboard} />

    </Router>

  );
}