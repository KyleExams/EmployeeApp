import React, { Component } from 'react';
import { EmployeeData } from '../Models';
import { Redirect } from 'react-router-dom';

export class AddEditEmployee extends Component {
	displayName = AddEditEmployee.name

	constructor(props) {
		super(props);
		// component variables
		this.state = {
			isEdit: false,
			isFormValid: false,
			employee: new EmployeeData(),
			selectedEmployee: null,
			pristineEmployee: null,
			positions: [],
			loading: true,
			redirectToEmployee: false
		};

		// get parameter from route
		this.state.selectedEmployee = this.props.match.params["guid"];
		if (this.state.selectedEmployee) {
			fetch('api/Employee/getemployee/' + this.state.selectedEmployee)
				.then(response => response.json())
				.then(data => {
					//console.log(data);
					this.state.pristineEmployee = { ...data };
					this.setState({ isEdit: true, employee: data, loading: false });
				});
		} else {
			this.state.loading = false;
		}

		// method bindings
		this.loadPositions = this.loadPositions.bind(this);
		this.saveEmployee = this.saveEmployee.bind(this);
		this.cancelAddEdit = this.cancelAddEdit.bind(this);

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

	saveEmployee(e) {
		e.preventDefault();
		//console.log(this.state.employee);

		if (this.state.isEdit) {
			fetch('api/Employee/updateemployee/' + this.state.selectedEmployee, {
				method: 'PUT',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(this.state.employee)
			}).then(() => {
				this.setState({ redirectToEmployee: true });
			});
		} else {
			fetch('api/Employee/createemployee', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(this.state.employee)
			}).then(() => {
				this.setState({ redirectToEmployee: true });
			});
		}
	}

	cancelAddEdit(e) {
		e.preventDefault();
		this.setState({ redirectToEmployee: true });
	}

	handleNameChange(e) {
		e.preventDefault();
		var editing = { ...this.state.employee };
		editing.fullName = e.target.value;
		this.setState({ employee: editing }, () => this.validateForm());
	}

	handlePositionChange(e) {
		e.preventDefault();
		var editing = { ...this.state.employee };
		editing.positionGuid = e.target.value;
		this.setState({ employee: editing }, () => this.validateForm());
	}

	// dirty tracking sample
	validateForm() {
		console.log(this.state.employee);
		let valid = this.state.isEdit ?
			(this.state.pristineEmployee.fullName !== this.state.employee.fullName ||
			this.state.pristineEmployee.positionGuid !== this.state.employee.positionGuid) &&
			this.state.employee.fullName !== "" && this.state.employee.positionGuid !== "00000000-0000-0000-0000-000000000000"
			:
			this.state.employee.fullName !== "" && this.state.employee.positionGuid !== "00000000-0000-0000-0000-000000000000";
		console.log(valid);
		this.setState({ isFormValid: valid });
	}

	renderAddEditEmployeeForm(positions) {
		return (
			<div>
				<form onSubmit={this.saveEmployee} >
					<div className="form-group">
						<label htmlFor="employeeName">Name</label>
						<input type="text"
							className="form-control"
							id="employeeName"
							name="name"
							placeholder="Enter Employee"
							maxLength="50"
							required
							onChange={this.handleNameChange.bind(this)}
							value={this.state.employee.fullName} />
					</div>
					<div className="form-group">
						<label htmlFor="employeePosition">Position</label>
						<select className="form-control" id="employeePosition"
							onChange={this.handlePositionChange.bind(this)}
							value={this.state.employee.positionGuid}>
							<option value="00000000-0000-0000-0000-000000000000">-- Select Position --</option>
							{positions.map((position) =>
								<option key={position.guid} value={position.guid}>{position.name}</option>
							)}
						</select>
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
			: this.renderAddEditEmployeeForm(this.state.positions);
		let redirectToEmployee = this.state.redirectToEmployee;

		if (redirectToEmployee) {
			return <Redirect to="/employee" />;
		}

		return (
			<div>
				<h1>{this.state.isEdit ? "Edit" : "Add"} Employee</h1>
				{contents}
			</div>
		);
	}
}
