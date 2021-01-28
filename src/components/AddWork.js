import React, { Component} from 'react';

class AddWork extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id : "",
            name : "",
            status : false
        }  
    }

    componentDidMount() {
        if (this.props.task) {
            this.setState({
                id : this.props.task.id,
                name : this.props.task.name,
                status : this.props.task.status
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.task) {
            this.setState({
                id : nextProps.task.id,
                name : nextProps.task.name,
                status : nextProps.task.status
            });
        }else if (!nextProps.task) {
            this.setState({
                id : "",
                name : "",
                status : false
            })
        }
    }

    closeAddForm = () => {
        this.props.closeAddForm();     
    }

    onChange = (e) => {
        var target = e.target;
        var name = target.name;
        var value = target.value;
        if (name === "status") {
            value = target.value === "true" ? true : false
        }
        this.setState({
            [name] : value
        })
    }

    onSubmit = (e) => { 
        e.preventDefault();     
        this.props.onSubmit(this.state);
        this.onCancel();
        this.closeAddForm();
    }

    onCancel =() => {
        this.closeAddForm();
    }

    render() {
        var {id} = this.state;
        return (
                <div className="panel panel-warning">
                    <div className="panel-heading">
                        <h3 className="panel-title off-add">
                            {id !== "" ? "Update Work" : "Add Work"}
                                <span className="fa fa-times x-right" onClick={this.closeAddForm}></span>
                        </h3>
                    </div>
                    <div className="panel-body">
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label>Name :</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="name"
                                    value={this.state.name} 
                                    onChange={this.onChange}      
                                />
                            </div>
                            <label>Status :</label>
                            <select 
                                className="form-control"
                                name="status"
                                value={this.state.status}
                                onChange={this.onChange}
                            >
                                <option value={true}>Active</option>
                                <option value={false}>Hidden</option>
                            </select>
                            <br/>
                            <div className="text-center">
                                <button type="submit" className="btn btn-warning"><span className="fa fa-plus mr-5"></span>Save</button>&nbsp;
                                <button 
                                    type="button" 
                                    className="btn btn-danger"
                                    onClick = {this.onCancel}
                                ><i className="fa fa-times mr-5"></i>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
        )
    }
}

export default AddWork;