import React, { Component } from 'react';
import './Position.css';

export class Position extends Component {
    displayName = Position.name

    constructor(props) {
        super(props);
        this.state = { positions: [], loading: true };

        fetch('api/Position/getpositions')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({ positions: data, loading: false });
            });

        // This binding is necessary to make "this" work in the callback  
        //this.editPosition = this.editPosition.bind(this);
        //this.deletePosition = this.deletePosition.bind(this);
    }

    static editPosition(guid) {
        console.log('edit' + guid);
    } 

    static deletePosition(guid) {
        console.log('delete' + guid);
    } 

    static renderPositionsTable(positions) {
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
                                <button type="button" className="btn btn-primary action-button" onClick={() => Position.editPosition(position.guid)}>EDIT</button>
                                <button type="button" className="btn btn-danger action-button" onClick={() => Position.deletePosition(position.guid)}>DELETE</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Position.renderPositionsTable(this.state.positions);

        return (
            <div>
                <h1>Positions</h1>
                {contents}
            </div>
        );
    }
}
