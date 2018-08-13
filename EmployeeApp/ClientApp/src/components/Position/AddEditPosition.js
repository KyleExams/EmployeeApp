import React, { Component } from 'react';
import { PositionData } from '../Models';

export class AddEditPosition extends Component {
    displayName = AddEditPosition.name

    constructor(props) {
        super(props);
        this.state = { position: new PositionData(), loading: true , title: "Add Position"};

        var positionId = this.props.match.params["guid"];

        if (positionId) {
            fetch('api/Position/getposition/' + positionId)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.setState({ position: data, loading: false });
                });
            this.state.title = "Edit Position";
        }
    }

    static renderAddEditPositionForm(position) {
        return (
            <form></form>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : AddEditPosition.renderAddEditPositionForm(this.state.position);

        return (
            <div>
                <h1>{this.state.title}</h1>
                {contents}
            </div>
        );
    }
}
