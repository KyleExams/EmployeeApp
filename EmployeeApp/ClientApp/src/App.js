import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Position } from './components/Position/Position';
import { AddEditPosition } from './components/Position/AddEditPosition';
import { Employee } from './components/Employee/Employee';
import { AddEditEmployee } from './components/Employee/AddEditEmployee';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class App extends Component {
	displayName = App.name

	render() {
		return (
			<Layout>
				<Route exact path='/' component={Home} />
				<Route path='/position' component={Position} />
				<Route path='/positionadd' component={AddEditPosition} />
				<Route path='/positionedit/:guid' component={AddEditPosition} />
				<Route path='/employee' component={Employee} />
				<Route path='/employeeadd' component={AddEditEmployee} />
				<Route path='/employeeedit/:guid' component={AddEditEmployee} />
				<ToastContainer />
			</Layout>
		);
	}
}
