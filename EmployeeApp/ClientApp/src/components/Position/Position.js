import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export class Position extends Component {
	displayName = Position.name

	constructor(props) {
		super(props);
		// component variables
		this.state = {
			positions: [],
			selectedPosition: "",
			loading: true,
			redirectToAdd: false,
			redirectToEdit: false
		};

		// method bindings
		this.loadPositions = this.loadPositions.bind(this);
		this.addPosition = this.addPosition.bind(this);
		this.editPosition = this.editPosition.bind(this);
		this.deletePosition = this.deletePosition.bind(this);

		this.loadPositions();
	}

	loadPositions() {
		fetch('api/Position/getpositions')
			.then(response => response.json())
			.then(data => {
				//console.log(data);
				this.setState({ positions: data, loading: false });
			});
	}

	addPosition(e) {
		e.preventDefault();
		this.setState({ redirectToAdd: true });
	}

	editPosition(guid) {
		this.setState({ selectedPosition: guid, redirectToEdit: true });
	}

	deletePosition(guid) {
		fetch('api/Position/deleteposition/' + guid, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		}).then(() => {
			this.loadPositions();
		});
	}

	renderPositionsTable(positions) {
		if (positions && positions.length > 0) {
			return (
				<table className='table table-striped'>
					<thead>
						<tr>
							<th>ID</th>
							<th>Position</th>
							<th>Created</th>
							<th>Updated</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{positions.map((position) =>
							<tr key={position.guid}>
								<td>{position.guid}</td>
								<td>{position.name}</td>
								<td>{position.createDate ? new Date(position.createDate).toLocaleDateString() + ' ' + new Date(position.createDate).toLocaleTimeString() : ''}</td>
								<td>{position.updateDate ? new Date(position.updateDate).toLocaleDateString() + ' ' + new Date(position.updateDate).toLocaleTimeString() : ''}</td>
								<td>
									<button type="button" className="btn btn-primary action-button" onClick={() => this.editPosition(position.guid)}>EDIT</button>
									<button type="button" className="btn btn-danger action-button" onClick={() => this.deletePosition(position.guid)}>DELETE</button>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			);
		} else {
			return (
				<span>No positions available</span>
			);
		}
	}

	render() {
		let contents = this.state.loading
			? <p><em>Loading...</em></p>
			: this.renderPositionsTable(this.state.positions);
		let redirectToAdd = this.state.redirectToAdd;
		let redirectToEdit = this.state.redirectToEdit;

		// redirect the 'SPA' way
		if (redirectToAdd) {
			return <Redirect to="/positionadd" />;
		}

		if (redirectToEdit) {
			return <Redirect to={`/positionedit/${this.state.selectedPosition}`} />;
		}

		return (
			<div className="container">
				<div className="row">
					<h1 className="header">Positions</h1>
					<a className="btn btn-primary btn-xl js-scroll-trigger add-button" onClick={this.addPosition}>Add Position</a>
				</div>
				<div className="row">
					{contents}
				</div>
			</div>
		);
	}
}
