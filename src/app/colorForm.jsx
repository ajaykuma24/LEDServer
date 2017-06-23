import React from 'react';
import { SketchPicker } from 'react-color';
import ColorInfo from './colorInfo';

class ColorForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {colorrgba: {
				 r: 0,
				 g: 0,
				 b: 0,
				 a: 1
			 }
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(color, event) {
		var R = color.rgb.r
		var G = color.rgb.g
		var B = color.rgb.b
		document.getElementById('submit').style.backgroundColor = color.hex
		if(color.hsl.l > 0.4) {
			document.getElementById('submitText').style.color = '#000000'
		}
		else {
			document.getElementById('submitText').style.color = '#FFFFFF'
		}
		this.setState({colorrgba: color.rgb});
	}

	handleSubmit(event) {
		fetch("/colors", {
								method: 'POST',
								headers: {
										'Accept': 'application/json, text/plain, */*',
										'Content-Type': 'application/json'
								},
								body: JSON.stringify(this.state.colorrgba)
						})
						.then(function(res) {
								return res.text();
						})
						.then(function(data) {
								console.log('sent')
								console.log(data)
						})
		event.preventDefault();
	}

	render() {
		return (
			<div id="form">
				<h1>Select a Color:</h1>
					<SketchPicker color={ this.state.colorrgba } onChange={ this.handleChange} />
					<div id="buttons">
						<div id="Add" onClick={this.handleSubmit}>
							<p id="addText">Add</p>
						</div>
					
						<div id="submit" onClick={this.handleSubmit}>
							<p id="submitText">Submit</p>
						</div>
					</div>
					<div id="colstosend">
					</div>
			</div>
		);
	}
}

export default ColorForm;