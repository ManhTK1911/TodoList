import React, { Component} from 'react';
import './App.css';
import AddWork from './components/AddWork';
import Control from './components/Control';
import TaskList from './components/TaskList';
import _ from 'lodash';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      isDisplayForm : false,
      taskEditting : null,
      filter : {
        name : "",
        status : -1
      },
      keywork : "",
      sortBy : "name",
      sortValue : 1
    }
  }

  componentDidMount() {
    if (localStorage && localStorage.getItem("tasks")) {
      var tasks = JSON.parse(localStorage.getItem("tasks"));
      this.setState({
        tasks : tasks
      })
    }
  }

  generateData = () => {
    var tasks = [
      {
        id : this.makeId(),
        name : "Learn ReactJS",
        status : true
      }, 
      {
        id : this.makeId(),
        name : "Listen to music",
        status : true
      }, 
      {
        id : this.makeId(),
        name : "Dinner",
        status : false
      } 
    ];
    this.setState ({
      tasks : tasks
    });
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }

  randomStr() {
    return Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1)
  }

  makeId() {
    return this.randomStr() + "-" + this.randomStr() + "-" + this.randomStr() + "-" + this.randomStr() + "-" + this.randomStr()
  }
  
  onAddWorkForm = () => {
    if (this.state.isDisplayForm && this.state.taskEditting) {
      this.setState({
        isDisplayForm : true,
        taskEditting : null
    })} else {
      this.setState({
        isDisplayForm : !this.state.isDisplayForm,
        taskEditting : null
    })
    }
  }

  onTaskForm = () => {
    this.setState({
      isDisplayForm : true
    })
  }

  closeAddForm =() => {
    this.setState({
      isDisplayForm : false
    })
  }

  onSubmit = (data) => {
    var {tasks} = this.state
    if (data.id === "") {
      data.id = this.makeId()
      tasks.push(data)
    } else {
      var index = this.findIndex(data.id);
      tasks[index] = data;
    }

    this.setState({
      tasks :tasks,
      taskEditting : null
    })

    localStorage.setItem("tasks", JSON.stringify(tasks))
  }

  onUpdateStatus =(id) => {
    var {tasks} = this.state
    const newTasks = tasks.map(task => {
        if (task.id === id) {
          task.status = !task.status
        }
        return task;
      })
      this.setState({tasks: newTasks})    

      localStorage.setItem("tasks", JSON.stringify(newTasks))    
  }

  onDelete = (id) => {
    var {tasks} = this.state
    var result = tasks.filter(task => task.id !== id)
    this.setState({
      tasks: result
    })
    localStorage.setItem('tasks', JSON.stringify(result));
    this.closeAddForm()
  }

  findIndex = (id) => {
    var {tasks} = this.state;
    var result = -1;
    tasks.forEach((task, index) => {
      if (task.id === id) {
        result = index;
      }
    });
    return result;
  }

  onEdit = (id) => {
    var {tasks} = this.state;
    var index = this.findIndex(id);
    var taskEditting = tasks[index]
    
    this.setState({
      taskEditting : taskEditting 
    })

    this.onTaskForm()
  }

  onFilter = (filterName, filterStatus) => {
    filterStatus = +filterStatus;
    this.setState({
      filter : {
        name : filterName.toLowerCase(),
        status : filterStatus
      }
    })
  }

  onSearch = (keyword) => {
    this.setState({
      keyword : keyword
    })
  }

  onSort = (sortBy, sortValue) => {
    this.setState({
      sortBy : sortBy,
      sortValue : sortValue
    })
  }

  render() {
    var {tasks,
         isDisplayForm,
         taskEditting,
         filter, 
         keyword,
         sortBy,
         sortValue
        } = this.state;

    if (filter) {
      if (filter.name) {
        tasks = tasks.filter((task) => {
          return task.name.toLowerCase().indexOf(filter.name) !==-1;
        });
      }

        tasks = tasks.filter((task) => {
          if (filter.status === -1) {
            return task;
          } else {
            return task.status === (filter.status === 1 ? true : false)
          }
        })
    }

    if (keyword) {
      tasks = tasks.filter((task) => {
        return task.name.toLowerCase().indexOf(keyword) !==-1;
      });
    }

    if (sortBy === "name") {
      tasks.sort((a, b) => {
        if (a.name > b.name) return sortValue;
        else if (a.name < b.name) return -sortValue;
        else return 0;
      })
    } else {
      tasks.sort((a, b) => {
        if (a.status > b.status) return -sortValue;
        else if (a.status < b.status) return sortValue;
        else return 0;
      })
    }
    

    return (
      <div className="container mt-50">
        <div className="text-center">
            <h1>___ TODO LIST ___</h1>
            <br/><hr/>< br/>
        </div>
        <div className="row">
            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                {isDisplayForm ? <AddWork 
                                      onSubmit={this.onSubmit}
                                      closeAddForm={this.closeAddForm}
                                      task={taskEditting}
                                  /> : ""}
            </div>
            <div className={isDisplayForm ? "col-xs-8 col-sm-8 col-md-8 col-lg-8" : "col-xs-12 col-sm-12 col-md-12 col-lg-12"}>
                <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={this.onAddWorkForm}

                >
                    <span className="fa fa-plus mr-5"></span>Add Work
                </button>
                <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={this.generateData }
                >
                    Generate Data
                </button>
                <Control 
                  onSearch = {this.onSearch}
                  onSort = {this.onSort}
                  sortBy={sortBy}
                  sortValue={sortValue}
                />
            <TaskList 
                tasks = {tasks}
                onUpdateStatus = {this.onUpdateStatus}
                onDelete = {this.onDelete}
                onEdit = {this.onEdit}
                onFilter = {this.onFilter}
            />
            </div>
        </div>
    </div>
      
    );
  }
}

export default App;
