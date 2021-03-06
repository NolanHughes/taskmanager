import React from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';
import update from 'immutability-helper';
import '../css/react-datetime.css';
import $ from 'jquery'

import { validations } from '../utils/validations';
import { FormErrors } from './FormErrors';

import '../css/Tasks.css'
import '../css/Form.css'

export default class TaskForm extends React.Component {
  constructor (props, railsContext) {
    super(props)
    this.state = {
      title: {value: '', valid: false},
      due_by: {value: new Date(), valid: false},
      assigned_to: '',
      categories: [],
      category_id: '',
      recurring: false,
      recurring_amount: 0,
      notes: '',
      formErrors: {},
      formValid: props.formValid,
      editing: props.editing
    }

    this.handleDropdown = this.handleDropdown.bind(this);
  }



  static formValidations = {
    title: [
      (string) => { return(validations.checkMinLength(string, 1)) }
    ],
    due_by: [
      (time) => { return(validations.timeShouldBeFuture(time)) }
    ]
  }

  handleDropdown(e) {
    this.setState({
      [e.target.name]: parseInt(e.target.value)
    });
  }

  componentDidMount() {
    if(this.props.editing) {
      $.ajax({
        type: "GET",
        url: `${this.props.apiUrl}/api/v1/tasks/${this.props.id}`,
        dataType: "JSON",
        headers: JSON.parse(sessionStorage.getItem('user'))
      }).done((data) => {
        this.setState({
          title: {value: data.title, valid: true},
          due_by: {value: data.due_by, valid: true},
          assigned_to: data.assigned_to_id,
          category_id: data.category_id,
          recurring: data.recurring,
          recurring_amount: data.recurring_amount,
          notes: data.notes
        });
      });

      $.ajax({
        type: "GET",
        url: `${this.props.apiUrl}/api/v1/categories`,
        dataType: "JSON"
      }).done((data) => {
        this.setState({
          categories: data
        })
      });
    } 
    else {
      let userEmail = JSON.parse(sessionStorage.getItem('user')).uid
      let id = this.props.users.find( user => user.uid === userEmail ).id

      $.ajax({
        type: "GET",
        url: `${this.props.apiUrl}/api/v1/categories`,
        dataType: "JSON"
      }).done((data) => {
        debugger
        this.setState({
          categories: data,
          category_id: data[0].id,
          assigned_to: id
        })
      });
    }
  }

  handleUserInput = (fieldName, fieldValue, validations) => {
    const newFieldState = {value: fieldValue, valid: this.state[fieldName].valid}

    this.setState({
      [fieldName]: newFieldState
    }, () => { 
         this.validateField(fieldName, fieldValue, validations)
       });
  }

  validateField (fieldName, fieldValue, validations) {
    let fieldValid;

    let fieldErrors = validations.reduce((errors, v) => {
      let e = v(fieldValue);
      if (e !== '') {
        errors.push(e);
      }
      return(errors);
    }, []);
    
    fieldValid = fieldErrors.length === 0;

    const newFieldState = {value: this.state[fieldName].value, valid: fieldValid}
    const newFormErrors = update(this.state.formErrors, {$merge: {[fieldName]: fieldErrors}});

    this.setState({
      [fieldName]: newFieldState,
      formErrors: newFormErrors
    }, this.validateForm);
  }

  validateForm () {
    this.setState({
      formValid: this.state.title.valid && this.state.due_by.valid
    });
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    this.state.editing ? this.updateTask() : this.addTask()
  }

  addTask() {
    const task = {
      title: this.state.title.value, 
      due_by: this.state.due_by.value,
      assigned_to_id: this.state.assigned_to,
      category_id: this.state.category_id,
      recurring: this.state.recurring,
      recurring_amount: this.state.recurring_amount,
      notes: this.state.notes
    };
    $.ajax({
      type: 'POST',
      url: `${this.props.apiUrl}/api/v1/tasks`,
      data: {task: task},
      headers: JSON.parse(sessionStorage.getItem('user'))
    })
    .done((data) => {
      this.resetFormErrors();
      this.props.handleAddingTask(data);      
    })
    .fail((response) => {
      console.log(response)
      this.setState({
        formErrors: response.responseJSON,
        formValid: false
      });
    });
  }

  updateTask() {
    const task = {
      title: this.state.title.value,
      due_by: this.state.due_by.value,
      assigned_to_id: this.state.assigned_to,
      category_id: this.state.category_id,
      recurring: this.state.recurring,
      recurring_amount: this.state.recurring_amount,
      notes: this.state.notes
    };
    
    $.ajax({
      type: "PATCH",
      url: `${this.props.apiUrl}/api/v1/tasks/${this.props.id}`,
      data: {task: task},
      headers: JSON.parse(sessionStorage.getItem('user'))
    })
    .done((data) => {
      this.setState({
        editing: false
      })
      this.props.handleUpdatingTask(data);
    })
    .fail((response) => {
      this.setState({
        formErrors: response.responseJSON,
        formValid: false
      });
    });  
  }

  resetFormErrors () {
    this.setState({formErrors: {}})
  }

  handleChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    this.handleUserInput(
      fieldName, 
      fieldValue,
      TaskForm.formValidations[fieldName]
    );
  }

  setDueBy = (e) => {
    const fieldName = 'due_by';
    const fieldValue = e.toDate();
    this.handleUserInput(
      fieldName, 
      fieldValue,
      TaskForm.formValidations[fieldName]
    );
  }

  closeForm = () => {
    if (window.confirm("Are you sure you want to close this task before saving?")) {
      this.props.handleFormUnmount()
    } 
  }

  handleRecurringChange = () => {
    this.setState({
      recurring: !this.state.recurring
    })
  }

  handleRecurringDaysChange = (e) => {
    if (e.target.value !== "") {
      this.setState({
        recurring_amount: parseInt(e.target.value)
      })
    }
  }

  handleNotesChange = (e) => {
    this.setState({
      notes: e.target.value
    })
  }

	render() {
		const inputProps = {
      name: 'due_by'
    };

    let users = this.props.users.map( user => {
      return(<option key={user.id} value={user.id}>{user.name}</option>)
    })

    let categories = this.state.categories.map( category => {
      return(<option key={category.id} value={category.id}>{category.name}</option>)
    })

		return(
			<div className="task-form-container">
      <button className="close-button" onClick={() => this.closeForm()}>X</button>
				<FormErrors formErrors = {this.state.formErrors} />

	      <form onSubmit={this.handleFormSubmit} id="task-form">
	        <input 
            name='title' 
            id="task-title" 
            placeholder='Task Title'
	          value={this.state.title.value}
	          onChange={this.handleChange} 
          />
          
          <div className="date-row">
            <div>
              Due Date
              <Datetime 
  	         	input={true}
  	         	inputProps={inputProps}
              value={moment(this.state.due_by.value)}
              onChange={this.setDueBy} 
              className="datetime" 
              />
            </div>

            <div>
              <div>
                <label>Recurring: </label>
                <input type="checkbox" checked={this.state.recurring} onChange={this.handleRecurringChange}/>
              </div>
              <div>
                <span>Repeat every </span>
                <input value={this.state.recurring_amount} className='recurring-amount' name='recurring-amount' type="number" onChange={this.handleRecurringDaysChange}/>
                <span> days</span>
              </div>
            </div>
          </div>

          <div className="assigned-to-row">
            <div>
              <label>Assigned To: </label>
              <select value={this.state.assigned_to} onChange={this.handleDropdown} name="assigned_to">
                {users}
              </select>
            </div>

            <div>
              <label>Category: </label>
              <select value={this.state.category_id} onChange={this.handleDropdown} name="category_id">
                {categories}
              </select>
            </div>
          </div>

          <div>
            <textarea className="notes" value={this.state.notes} name='notes' onChange={this.handleNotesChange} placeholder="Notes"/>
          </div>

	        <input 
            type='submit'
	          value={this.state.editing ? 'Update Task' : 'Make Task'}
	          className='submit-button'
	          disabled={!this.state.formValid} 
          />

	      </form>
      </div>
		)    
	}
}

TaskForm.defaultProps = {
  // apiUrl: 'http://localhost:3000'
  apiUrl: 'https://thetaskmanager.herokuapp.com'
};
