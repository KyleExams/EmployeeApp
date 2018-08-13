import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Position } from './components/Position/Position';
import { AddEditPosition } from './components/Position/AddEditPosition';
import { Counter } from './components/Counter';

export default class App extends Component {
	displayName = App.name

	render() {
		return (
			<Layout>
				<Route exact path='/' component={Home} />
				<Route path='/counter' component={Counter} />
				<Route path='/position' component={Position} />
				<Route path='/positionadd' component={AddEditPosition} />
				<Route path='/positionedit/:guid' component={AddEditPosition} />
			</Layout>
		);
	}
}
