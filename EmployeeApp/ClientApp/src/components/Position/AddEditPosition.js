import React, { Component } from 'react';
import { PositionData } from '../Models';
import { Redirect } from 'react-router-dom';
import './AddEditPosition.css';

export class AddEditPosition extends Component {
	displayName = AddEditPosition.name

	constructor(props) {
		super(props);
		// component variables
		this.state = {
			isEdit: false,
			isFormValid: false,
			position: new PositionData(),
			selectedPosition: null,
			pristinePosition: null,
			loading: true,
			redirectToPosition: false
		};

		// get parameter from route
		this.state.selectedPosition = this.props.match.params["guid"];
		if (this.state.selectedPosition) {
			fetch('api/Position/getposition/' + this.state.selectedPosition)
				.then(response => response.json())
				.then(data => {
					//console.log(data);
					this.state.pristinePosition = { ...data };
					this.setState({ isEdit: true, position: data, loading: false });
				});
		} else {
			this.state.loading = false;
		}

		// method bindings
		this.savePosition = this.savePosition.bind(this);
		this.cancelAddEdit = this.cancelAddEdit.bind(this);
	}

	savePosition(e) {
		e.preventDefault();
		//console.log(this.state.position);

		if (this.state.isEdit) {
			fetch('api/Position/updateposition/' + this.state.selectedPosition, {
				method: 'PUT',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(this.state.position)
			}).then(() => {
				this.setState({ redirectToPosition: true });
			});
		} else {
			fetch('api/Position/createposition', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(this.state.position)
			}).then(() => {
				this.setState({ redirectToPosition: true });
			});
		}
	}

	cancelAddEdit(e) {
		e.preventDefault();
		this.setState({ redirectToPosition: true });
	}

	handleNameChange(e) {
		e.preventDefault();
		var editing = { ...this.state.position };
		editing.name = e.target.value;
		this.setState({ position: editing });
	}

	// dirty tracking sample
	validateForm(e) {
		e.preventDefault();
		let valid = this.state.isEdit ?
			this.state.pristinePosition.name !== this.state.position.name && this.state.position.name !== "":
			this.state.position.name !== "";
		//console.log(valid);
		this.setState({ isFormValid: valid });
	}

	renderAddEditPositionForm(position) {
		return (
			<div>
				<form onSubmit={this.savePosition} >
					<div className="form-group">
						<label htmlFor="positionName">Name</label>
						<input type="text"
							className="form-control"
							id="positionName"
							name="name"
							placeholder="Enter Position"
							maxLength="50"
							required
							onChange={this.handleNameChange.bind(this)}
							onKeyUp={this.validateForm.bind(this)}
							value={this.state.position.name} />
					</div>
					<button type="submit" className="btn btn-primary add-edit-button" disabled={!this.state.isFormValid}>SAVE</button>
					<button type="button" className="btn btn-danger add-edit-button" onClick={this.cancelAddEdit}>CANCEL</button>
				</form>
			</div>
		);
	}

	render() {
		let contents = this.state.loading
			? <p><em>Loading...</em></p>
			: this.renderAddEditPositionForm(this.state.position);
		let redirectToPosition = this.state.redirectToPosition;

		if (redirectToPosition) {
			return <Redirect to="/position" />;
		}

		return (
			<div>
				<h1>{this.state.isEdit ? "Edit" : "Add"} Position</h1>
				{contents}
			</div>
		);
	}
}
