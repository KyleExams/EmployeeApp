import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export class Employee extends Component {
    displayName = Employee.name

	constructor(props) {
		super(props);
		// component variables
		this.state = {
			employees: [],
			selectedEmployee: "",
			loading: true,
			redirectToAdd: false,
			redirectToEdit: false
		};

		// method bindings
        this.loadEmployees = this.loadEmployees.bind(this);
        this.addEmployee = this.addEmployee.bind(this);
        this.editEmployee = this.editEmployee.bind(this);
        this.deleteEmployee = this.deleteEmployee.bind(this);

		this.loadEmployees();
	}

	loadEmployees() {
        fetch('api/Employee/getemployees', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            this.setState({ employees: data, loading: false });
        });
	}

	addEmployee(e) {
		e.preventDefault();
		this.setState({ redirectToAdd: true });
	}

	editEmployee(guid) {
		this.setState({ selectedEmployee: guid, redirectToEdit: true });
	}

	deleteEmployee(guid) {
        fetch('api/Employee/deleteemployee/' + guid, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		}).then(() => {
			this.loadEmployees();
		});
	}

	renderEmployeesTable(employees) {
		if (employees && employees.length > 0) {
			return (
				<table className='table table-striped'>
					<thead>
						<tr>
							<th>ID</th>
                            <th>Employee</th>
                            <th>Position</th>
							<th>Created</th>
							<th>Updated</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{employees.map((employee) =>
							<tr key={employee.guid}>
								<td>{employee.guid}</td>
                                <td>{employee.fullName}</td>
                                <td>{employee.position.name}</td>
								<td>{employee.createDate ? new Date(employee.createDate).toLocaleDateString() + ' ' + new Date(employee.createDate).toLocaleTimeString() : ''}</td>
								<td>{employee.updateDate ? new Date(employee.updateDate).toLocaleDateString() + ' ' + new Date(employee.updateDate).toLocaleTimeString() : ''}</td>
								<td>
									<button type="button" className="btn btn-primary action-button" onClick={() => this.editEmployee(employee.guid)}>EDIT</button>
									<button type="button" className="btn btn-danger action-button" onClick={() => this.deleteEmployee(employee.guid)}>DELETE</button>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			);
		} else {
			return (
				<span>No employees available</span>
			);
		}
	}

	render() {
		let contents = this.state.loading
			? <p><em>Loading...</em></p>
			: this.renderEmployeesTable(this.state.employees);
		let redirectToAdd = this.state.redirectToAdd;
		let redirectToEdit = this.state.redirectToEdit;

		// redirect the 'SPA' way
		if (redirectToAdd) {
			return <Redirect to="/employeeadd" />;
		}

		if (redirectToEdit) {
			return <Redirect to={`/employeeedit/${this.state.selectedEmployee}`} />;
		}

		return (
			<div className="container">
				<div className="row">
					<h1 className="header">Employees</h1>
					<a className="btn btn-primary btn-xl js-scroll-trigger add-button" onClick={this.addEmployee}>Add Employee</a>
				</div>
				<div className="row">
					{contents}
				</div>
			</div>
		);
	}
}
