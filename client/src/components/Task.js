import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery'

import {formatDate} from '../utils/format';

import '../css/Tasks.css'

export default class Task extends React.Component {


  static propTypes = {
		task: PropTypes.object.isRequired
	}

	static defaultProps = { 
		task: {}
	}

	handleEditClick = (id) => {
		this.props.openTaskForm(id)
	}

  addRecurringTask(task) {
    var date = new Date()
    date.setDate(date.getDate() + task.recurring_amount);
    
    let newTask = {
      title: task.title, 
      due_by: date,
      assigned_to_id: task.assigned_to_id,
      category_id: task.category_id,
      recurring: task.recurring,
      recurring_amount: task.recurring_amount,
      notes: task.notes
    };

    $.ajax({
      type: 'POST',
      url: `${this.props.apiUrl}/api/v1/tasks`,
      data: {task: newTask},
      headers: JSON.parse(sessionStorage.getItem('user'))
    })
    .done((data) => {
      this.props.handleAddingTask(data);
      alert("Your recurring task will be updated.")      
    })
    .fail((response) => {
      this.setState({
        formErrors: response.responseJSON,
        formValid: false
      });
    });
  }

	deleteTask = () => {
    const task = this.props.task

    if(window.confirm("Are you sure you want to complete this task?")) {
      if (task.recurring) {
        this.addRecurringTask(task)
      }

      $.ajax({
        type: "DELETE",
        url: `${this.props.apiUrl}/api/v1/tasks/${task.id}`,
        headers: JSON.parse(sessionStorage.getItem('user'))
      })
      .done(() => {
        console.log('deleted')
        this.props.handleDeletingTask(task.id);
      })
      .fail((response) => {
        console.log('task deleting failed!');
      });
    }
  }

	render() {
    let createdBy = this.props.users.find( user => user.id === this.props.task.user_id).name

		return(
		  <div className='task'>
        <svg className="check-icon" focusable="false" viewBox="0 0 32 32" onClick={this.deleteTask}>
          <path d="M10.9,26.2c-0.5,0-1-0.2-1.4-0.6l-6.9-6.9c-0.8-0.8-0.8-2,0-2.8c0.8-0.8,2-0.8,2.8,0l5.4,5.4L26.8,5.4c0.8-0.8,2-0.8,2.8,0s0.8,2,0,2.8L12.3,25.6C11.9,26,11.4,26.2,10.9,26.2z"></path>
        </svg>
        <div className="clickable-task-portion" onClick={() => this.handleEditClick(this.props.task.id)}>
  		    <span className="title">{this.props.task.title}</span>
  		   	<p>{formatDate(this.props.task.due_by)} | </p>
          {this.props.assigned_user ? 
            <p>Assigned To: {this.props.assigned_user.name}</p> :
            <p>Created By: {createdBy}</p>
          }
        </div>
		  </div>
	  )
	}
}

Task.defaultProps = {
  // apiUrl: 'http://localhost:3000'
  apiUrl: 'https://thetaskmanager.herokuapp.com'
};