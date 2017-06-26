import React from 'react';
import ColorInfo from './colorInfo';
import { SketchPicker } from 'react-color';

class ColorForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			colorrgba: {
				r: 0,
				g: 0,
				b: 0,
				a: 1
			},
			transition: "",
			wait: "",
			colors: [],
			error: {
				type: 0,
				showMsg: false,
				Msg: ""
			},
			edit: false
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.addColor = this.addColor.bind(this);
		this.transitionChange = this.transitionChange.bind(this);
		this.waitChange = this.waitChange.bind(this);
		this.delColor = this.delColor.bind(this);
		this.editColor = this.editColor.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
	}

	handleChange(color, event) {
		var R = color.rgb.r
		var G = color.rgb.g
		var B = color.rgb.b
		document.querySelectorAll('.button').forEach((button) => {button.style.backgroundColor = color.hex})
		if(color.hsl.l > 0.4) {
			document.querySelectorAll('.buttonText').forEach((text) => {text.style.color = '#000000'})
		}
		else {
			document.querySelectorAll('.buttonText').forEach((text) => {text.style.color = '#FFFFFF'})
		}
		this.setState({colorrgba: color.rgb});
		event.preventDefault();
	}

	handleSubmit(event) {
		if(this.state.colors.length === 0) {
			this.setState({
				error: {
					type: 1,
					showMsg: true,
					Msg: "You must add a color first"
				}
			});
			return;
		}
		fetch("/colors", {
							method: 'POST',
							headers: {
								'Accept': 'application/json, text/plain, */*',
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(this.state.colors)
						})
						.then(function(res) {
							return res.text();
						})
						.then(function(data) {
							console.log('sent')
							console.log(data)
						})
		this.setState({colors: []})
		event.preventDefault();
	}
	addColor(event) {
		if(this.state.transition === "") {
			this.setState({
				error: {
					type: 2,
					showMsg: true,
					Msg: "You must specify a transition period"
				}
			});
			return
		}
		if(this.state.wait === "") {
			this.setState({
				error: {
					type: 3,
					showMsg: true,
					Msg: "You must specify a wait period"
				}
			});
			return
		}
		if(this.state.selectTransition || this.state.selectWait) {
			this.setState({
				error: {
					type: 4,
					showMsg: true,
					Msg: "Please only enter positive numbers"
				}})
			return
		}
		if(this.state.error.type === 1) {
			this.setState({
				error: {
					type: 0,
					showMsg: false,
					Msg: ""
				}
			});
		}
		var colors = this.state.colors
		colors.push({
						r: this.state.colorrgba.r,
						g: this.state.colorrgba.g,
						b: this.state.colorrgba.b,
						t: this.state.transition,
						w: this.state.wait
					})
		this.setState({	colors: colors})
		event.preventDefault();
	}
	transitionChange(event) {
		const str = event.target.value
		const num = parseInt(str);
		if(str === "" || (num.toString() === str && num >= 0)) {
			this.setState({
				selectTransition: false
			});
			if(!this.state.selectWait) {
				this.setState({
					error: {
						type: 0,
						showMsg: false,
						Msg: ""
				},
				})
			}

		}
		else {
			this.setState({
				error: {
					type: 4,
					showMsg: true,
					Msg: "Please only enter positive numbers"
				},
				selectTransition: true
			});
		}
		this.setState({transition: event.target.value})
		event.preventDefault();
	}
	waitChange(event) {
		const str = event.target.value
		const num = parseInt(str);
		if(str === "" || (num.toString() === str && num >= 0)) {
			this.setState({
				selectWait: false
			});
			if(!this.state.selectTransition) {
				this.setState({
					error: {
						type: 0,
						showMsg: false,
						Msg: ""
					},
				})
			}
		}
		else {
			this.setState({
				error: {
					type: 4,
					showMsg: true,
					Msg: "Please only enter positive numbers"
				},
				selectWait: true
			});
			
		}
		this.setState({wait: event.target.value})
		event.preventDefault();
	}
	delColor(index) {
		var colors = this.state.colors
		colors.splice(index, 1)
		this.setState({colors: colors})
	}
	editColor(index) {
		//load
		const colors = this.state.colors
		const color = colors[index]
		this.setState({	colorrgba: {
							r: color.r,
							g: color.g,
							b: color.b,
							a: this.state.colorrgba.a
						},
						transition: color.t,
						wait: color.w,
						edit: true,
						editIndex: index
					})
	}
	handleEdit(event) {
		if(this.state.transition === "") {
			this.setState({
				error: {
					type: 2,
					showMsg: true,
					Msg: "You must specify a transition period"
				}
			});
			return
		}
		if(this.state.wait === "") {
			this.setState({
				error: {
					type: 3,
					showMsg: true,
					Msg: "You must specify a wait period"
				}
			});
			return
		}
		if(this.state.selectTransition || this.state.selectWait) {
			this.setState({
				error: {
					type: 4,
					showMsg: true,
					Msg: "Please only enter positive numbers"
				}})
			return
		}
		if(this.state.error.type === 1) {
			this.setState({
				error: {
					type: 0,
					showMsg: false,
					Msg: ""
				}
			});
		}
		var colors = this.state.colors
		colors[this.state.editIndex] = {
						r: this.state.colorrgba.r,
						g: this.state.colorrgba.g,
						b: this.state.colorrgba.b,
						t: this.state.transition,
						w: this.state.wait
					}
		this.setState({	colors: colors, edit: false})
		event.preventDefault();
	}

	render() {
		const colinfos = this.state.colors.map( (col, index) => 
						{return <ColorInfo key={index} r={col.r} g={col.g} b={col.b} t={col.t} w={col.w} index={index} clickHandle={this.delColor} edit={this.editColor}/> })
		const errormsg = this.state.error.showMsg ? (<div id="err"><p>{this.state.error.Msg}</p></div>) : null
		const transitionerr = this.state.selectTransition ? " error" : ""
		const waiterr = this.state.selectWait ? " error" : ""
		const changingButton = this.state.edit ? (<div className="button" onClick={this.handleEdit}>
													<p className="buttonText">Save</p>
												  </div>)
											   : (<div className="button" onClick={this.addColor}>
													<p className="buttonText">Add</p>
												  </div>)
		return (
			<div id="form">
				<h1>Select a Color:</h1>
					<SketchPicker color={ this.state.colorrgba } onChange={ this.handleChange} />
					<div id="inputs">
						<div id="left">
							<p>Transition Time (ms):</p>
							<input type="text" className={"input" + transitionerr} value={this.state.transition} onChange={this.transitionChange} />
							{changingButton}
						</div>
						<div id="right">
							<p>Wait Time (ms):</p>
							<input type="text" className={"input" + waiterr} value={this.state.wait} onChange={this.waitChange} />
							<div className="button" onClick={this.handleSubmit}>
								<p className="buttonText">Submit</p>
							</div>
						</div>
					</div>
					{errormsg}
					<div id="colstosend">
						{colinfos}
					</div>
			</div>
		);
	}
}

export default ColorForm;