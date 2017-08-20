import ColorInfo from './colorInfo';
import { SketchPicker } from 'react-color';
import NumInputs from './numInputs';
import Submit from './submit';

class ColorForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			color: {
				r: 0,
				g: 0,
				b: 0
			},
			transition: {val: "5000", err: false},
			wait: {val: "100", err: false},
			colors: [],
			error1: "",
			edit: false,
			saveName: "",
			saved: [],
			airplay: false
		}
		this.updateSaved = this.updateSaved.bind(this);
		this.handleColor = this.handleColor.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.handleTransition = this.handleTransition.bind(this);
		this.handleWait = this.handleWait.bind(this);
		this.handleDel = this.handleDel.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleColSave = this.handleColSave.bind(this);
		this.handlesaveName = this.handlesaveName.bind(this);
	}

	componentDidMount() {
	 document.querySelectorAll('.button.change').forEach((button) => {button.style.backgroundColor='black'})
		fetch("/save", {
							method: 'GET'
						})
						.then(function(res) {
							return res.json();
						})
						.then( (data) => {if(!data.msg) this.setState({saved: data.colors})})
		fetch("/switch", {
							method: 'GET'
						})
						.then(function(res) {
							return res.json();
						})
						.then( (data) => { this.setState({airplay: data.data})})

	}
	componentWillUnmount() {
		this.updateSaved();
	}
	updateSaved() {
		fetch("/save", {
							method: 'POST',
							headers: {
								'Accept': 'application/json, text/plain, */*',
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
													colors: this.state.saved,
												})
						})
						.then(function(res) {
							return res.text();
						})
						.then(function(data) {
						})
	}
	handleColor(color, event) {
		event.preventDefault();
		document.querySelectorAll('.button.change').forEach((button) => {button.style.backgroundColor = color.hex})
		if(color.hsl.l > 0.4) {
			document.querySelectorAll('.buttonText.change').forEach((text) => {text.style.color = '#000000'})
		}
		else {
			document.querySelectorAll('.buttonText.change').forEach((text) => {text.style.color = '#FFFFFF'})
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
	
	handleColSave(event) {
		event.preventDefault();
		if(this.state.colors.length === 0) {
			this.setState({error1: "You must add a color first"})
			return;
		}
		var saved = this.state.saved
		saved.push({colors: JSON.parse(JSON.stringify(this.state.colors)), name: this.state.saveName})
		this.setState({saved: saved})
		this.updateSaved();
	}
	handlesaveName(event) {
		event.preventDefault();
		this.setState({saveName: event.target.value});
	}
	handleColDel(index, event) {
		event.preventDefault();
		var saved = this.state.saved
		saved.splice(index, 1)
		this.setState({saved: saved})

	}
	handleColLoad(index, event) {
		event.preventDefault();
		this.setState({colors: this.state.saved[index].colors})
		
	}
	render() {
		const colinfos = this.state.colors.map( (col, index) => 
						{return <ColorInfo key={index} r={col.r} g={col.g} b={col.b} t={col.t} w={col.w} index={index} clickHandle={this.handleEdit} del={this.handleDel}/> })
		const error1 = this.state.error1 !== "" ? <div id="err"><p>{this.state.error1}</p></div> : null
		const changingButton = this.state.edit ? (<div className="add button change" onClick={this.handleSave}>
													<p className="buttonText change">Save</p>
												  </div>)
											   : (<div className="add button change" onClick={this.handleAdd}>
													<p className="buttonText change">Add</p>
												  </div>)
		const saved = this.state.saved ? (this.state.saved.map((col, index) =>
						{return <div className="button saved" key={index} onClick={this.handleColLoad.bind(this, index)} onContextMenu={this.handleColDel.bind(this, index)}> 
							<p className="buttonText">{col.name}</p>
						</div>})) : null
		if(this.state.airplay) {
			return (<h4>Changing color will not work while Airplay is enabled</h4>)
		}
		else {
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
						<div id="tosend">
							{colinfos}
						</div>
						<input type="text" className="text" id="saveName" value={this.state.saveName} onChange={this.handlesaveName} />
						<div className="button" id="patternSave" onClick={this.handleColSave}>
							<p className="buttonText">Save</p>
						</div>
						<Submit url="colors" toSubmit={this.state.colors} />
						{saved}
				</div>
			);
		}
	}
}

export default ColorForm;