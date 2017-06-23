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
			colors: []
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.addColor = this.addColor.bind(this);
		this.transitionChange = this.transitionChange.bind(this);
		this.waitChange = this.waitChange.bind(this);
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
		if(this.state.colors.length === 0)
			return;
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
		if(this.state.transition === "" || this.state.wait === "")
			return;
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
		this.setState({transition: this.checknum(event.target.value, this.state.transition)})
		event.preventDefault();
	}
	waitChange(event) {
		this.setState({wait: this.checknum(event.target.value, this.state.wait)})
		event.preventDefault();
	}
	checknum(str, prev) {
		var num = parseInt(str);
		if(str === "" || (num.toString() === str && num >= 0))
			return str
		else return prev;
	}

	render() {
		const colinfos = this.state.colors.map( (col, index) => {return <ColorInfo key={index} r={col.r} g={col.g} b={col.b} t={col.t} w={col.w}/> })
		return (
			<div id="form">
				<h1>Select a Color:</h1>
					<SketchPicker color={ this.state.colorrgba } onChange={ this.handleChange} />
					<div id="inputs">
						<div id="left">
							<p>Transition Time (ms):</p>
							<input type="text" className="input" value={this.state.transition} onChange={this.transitionChange} />
							<div className="button" onClick={this.addColor}>
							<p className="buttonText">Add</p>
							</div>
						</div>
						<div id="right">
							<p>Wait Time (ms):</p>
							<input type="text" className="input" value={this.state.wait} onChange={this.waitChange} />
							<div className="button" onClick={this.handleSubmit}>
							<p className="buttonText">Submit</p>
							</div>
						</div>
					</div>
					<div id="colstosend">
					{colinfos}
					</div>
			</div>
		);
	}
}

export default ColorForm;