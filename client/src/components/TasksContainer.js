import React, { Component } from 'react';
import axios from 'axios';

class TasksContainer extends Component {
		constructor(props){
        super(props)
        this.state = {
            tasks: []
        }
    }
    componentDidMount() {
        axios.get('http://localhost:3000/api/v1/categories.json')
        .then(response => {
            console.log(response)
            this.setState({
                tasks: response.data
            })
        })
        .catch(error => console.log(error))
    }

    render() {
        return (
            <div className="Lists-container">
                Lists
            </div>
        )
    }
}

export default TasksContainer;