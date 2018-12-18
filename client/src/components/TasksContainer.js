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
        axios.get('https://floating-earth-62539.herokuapp.com/api/v1/categories.json')
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