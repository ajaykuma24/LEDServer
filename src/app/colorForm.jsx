import React from 'react';
import ColorInfo from './colorInfo';
import { SketchPicker } from 'react-color';
import NumInputs from './numInputs';

class ColorForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			color: {
				r: 0,
				g: 0,
				b: 0
			},
			transition: {val: "", err: false},
			wait: {val: "", err: false},
			rep: {val: "1", err: false},
			colors: [],
			inf: false,
			error1: "",
			error2: "",
			edit: false
		}

		this.handleColor = this.handleColor.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.handleTransition = this.handleTransition.bind(this);
		this.handleWait = this.handleWait.bind(this);
		this.handleRep = this.handleRep.bind(this);
		this.handleDel = this.handleDel.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleInf = this.handleInf.bind(this);
	}

	handleColor(color, event) {
		event.preventDefault();
		document.querySelectorAll('.button').forEach((button) => {button.style.backgroundColor = color.hex})
		if(color.hsl.l > 0.4) {
			document.querySelectorAll('.buttonText').forEach((text) => {text.style.color = '#000000'})
		}
		else {
			document.querySelectorAll('.buttonText').forEach((text) => {text.style.color = '#FFFFFF'})
		}
		this.setState({color: color.rgb});
	}
	handleTransition(val, err) {
		if(err || this.state.wait.err) {
			this.setState({error1 : "Please enter only positive values"})
		}
		else {
			this.setState({error1 : ""})
		}
		this.setState({transition: {
									val: val,
									err: err
									}
						})
	}
	handleWait(val, err) {
		if(err || this.state.transition.err) {
			this.setState({error1 : "Please enter only positive values"})
		}
		else {
			this.setState({error1 : ""})
		}
		this.setState({wait: {
									val: val,
									err: err
									}
						})
	}
	handleAdd(event) {
		event.preventDefault();
		if(this.state.transition.val === "") {
			this.setState({error1 : "You must specify a transition period"})
			return;
		}
		if(this.state.wait.val === "") {
			this.setState({error1 : "You must specify a wait period"})
			return;
		}
		if(this.state.transition.err || this.state.wait.err) {
			return;
		}
		if(this.state.rep.err && !this.state.inf) {
			this.setState({error2: "Please enter only positive values"})
		}
		else {
			this.setState({error2: ""})
		}
		var colors = this.state.colors
		colors.push({
						r: this.state.color.r,
						g: this.state.color.g,
						b: this.state.color.b,
						t: this.state.transition.val,
						w: this.state.wait.val
					})
		this.setState({	colors: colors})
	}
	handleDel(index) {
		var colors = this.state.colors
		colors.splice(index, 1)
		this.setState({colors: colors})
	}
	handleEdit(index) {
		//load
		const colors = this.state.colors
		const color = colors[index]
		this.setState({	color: {
							r: color.r,
							g: color.g,
							b: color.b
						},
						transition: {
									val: color.t,
									err: false
									},
						wait: {
									val: color.w,
									err: false
									},
						edit: true,
						editIndex: index
					})
	}
	handleSave(event) {
		event.preventDefault();
		if(this.state.transition.val === "") {
			this.setState({error1 : "You must specify a transition period"})
			return;
		}
		if(this.state.wait.val === "") {
			this.setState({error1 : "You must specify a transition period"})
			return;
		}
		if(this.state.transition.err || this.state.wait.err) {
			this.setState({error1 : "Please enter only positive values"})
			return;
		}
		var colors = this.state.colors
		colors[this.state.editIndex] = {
						r: this.state.color.r,
						g: this.state.color.g,
						b: this.state.color.b,
						t: this.state.transition.val,
						w: this.state.wait.val
					}
		this.setState({	colors: colors, edit: false})
		event.preventDefault();
	}
	handleRep(val, err) {
		if(err) {
			this.setState({error2 : "Please enter only positive values"})
		}
		else {
			this.setState({error2 : ""})
		}
		this.setState({rep: {
									val: val,
									err: err
									}
						})
	}
	handleInf(event) {
		if(this.state.rep.err && this.state.colors.length !== 0) {
			this.setState({error2: ""})

		}
		if(!this.state.inf)
			this.setState({rep: {
									val: "",
									err: false
								}
						})
		this.setState({inf: !this.state.inf})
	}
	handleSubmit(event) {
		event.preventDefault();
		if(this.state.colors.length === 0) {
			this.setState({error2: "You must add a color first"})
			return;
		}
		if(this.state.rep.val === "" && !this.state.inf) {
			this.setState({error2 : "You must specify a number of repetitions"})
			return;
		}
		if(this.state.rep.err && !this.state.inf) {
			return;
		}
		fetch("/colors", {
							method: 'POST',
							headers: {
								'Accept': 'application/json, text/plain, */*',
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
													colors: this.state.colors,
													reps: this.state.rep.val,
													inf: this.state.inf
												})
						})
						.then(function(res) {
							return res.text();
						})
						.then(function(data) {
							console.log('sent')
							console.log(data)
						})
		this.setState({colors: []})
	}

	render() {
		const colinfos = this.state.colors.map( (col, index) => 
						{return <ColorInfo key={index} r={col.r} g={col.g} b={col.b} t={col.t} w={col.w} index={index} clickHandle={this.handleDel} edit={this.handleEdit}/> })
		const error1 = this.state.error1 !== "" ? <div id="err"><p>{this.state.error1}</p></div> : null
		const error2 = this.state.error2 !== "" ? <div id="err"><p>{this.state.error2}</p></div> : null
		const changingButton = this.state.edit ? (<div className="add button" onClick={this.handleSave}>
													<p className="buttonText">Save</p>
												  </div>)
											   : (<div className="add button" onClick={this.handleAdd}>
													<p className="buttonText">Add</p>
												  </div>)
		return (
			<div id="form">
				<h1>Select a Color:</h1>
					<SketchPicker color={ this.state.color} onChange={ this.handleColor} width="30vw" disableAlpha={true}/>
					<div className="inputs">
						<NumInputs label="Transition Time (ms):" divclass="add" value={this.state.transition} change={this.handleTransition} min={0} />
						<NumInputs label="Wait Time (ms):" divclass="add" value={this.state.wait} change={this.handleWait} min={0} />
						{changingButton}
					</div>	
					{error1}
					<div id="colstosend">
						{colinfos}
					</div>
					<div className="inputs">
						<NumInputs label="Repetitions:" divclass="submit" value={this.state.rep} change={this.handleRep} min={1} disabled={this.state.inf}/>
						<div className="submit" id="check">
							<p>Infinite:</p>
							<input type="checkbox" className="check" onChange={this.handleInf}/>
						</div>
						<div className="submit button" onClick={this.handleSubmit}>
							<p className="buttonText">Submit</p>
						</div>
					</div>
					{error2}
			</div>
		);
	}
}

export default ColorForm;