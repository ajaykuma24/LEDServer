import NumInputs from './numInputs';
import ColorInfo from './colorInfo';

class BrightnessForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: {val: "", err: false},
			transition: {val: "", err: false},
			wait: {val: "", err: false},
			rep: {val: "1", err: false},
			values: [],
			inf: false,
			error1: "",
			error2: "",
			edit: false,
			saveName: "",
			saved: []
		}

		this.handleVal = this.handleVal.bind(this);
		this.handleSlider = this.handleSlider.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.handleTransition = this.handleTransition.bind(this);
		this.handleWait = this.handleWait.bind(this);
		this.handleRep = this.handleRep.bind(this);
		this.handleDel = this.handleDel.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleInf = this.handleInf.bind(this);
		this.handleValSave = this.handleValSave.bind(this);
		this.handlesaveName = this.handlesaveName.bind(this);
	}
	componentDidMount() {
		fetch("/save", {
							method: 'GET'
						})
						.then(function(res) {
							return res.json();
						})
						.then( (data) => {if(!data.msg) this.setState({saved: data.values})})

	}
	componentWillUnmount() {
		fetch("/save", {
							method: 'POST',
							headers: {
								'Accept': 'application/json, text/plain, */*',
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
													values: this.state.saved,
												})
						})
						.then(function(res) {
							return res.text();
						})
						.then(function(data) {
							console.log('sent')
							console.log(data)
						})

	}
	handleVal(val, err) {
		if(err) {
			this.setState({error1 : "Please enter a number between 0 and 255"})
		}
		else {
			this.setState({error1 : ""})
			document.getElementById('slider').value=val
		}
		this.setState({value: {
									val: val,
									err: err
								}
						})

	}
	handleSlider(event) {
		this.setState({value: {
								val: event.target.value,
								err: false
								}
		})
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
		if(this.state.value.err) {
			return;
		}
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
		var values = this.state.values
		values.push({
						value: this.state.value.val,
						t: this.state.transition.val,
						w: this.state.wait.val
					})
		this.setState({	values: values})
	}
	handleDel(index) {
		var values = this.state.values
		values.splice(index, 1)
		this.setState({values: values})
	}
	handleEdit(index) {
		//load
		const values = this.state.values
		const value = values[index]
		this.setState({	value: {
							val: value.value,
							err: false
						},
						transition: {
									val: value.t,
									err: false
									},
						wait: {
									val: value.w,
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
		var values = this.state.values
		values[this.state.editIndex] = {
						value: this.state.value.val,
						t: this.state.transition.val,
						w: this.state.wait.val
					}
		this.setState({	values: values, edit: false})
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
		if(this.state.rep.err && this.state.values.length !== 0) {
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
		if(this.state.values.length === 0) {
			this.setState({error2: "You must add a value first"})
			return;
		}
		if(this.state.rep.val === "" && !this.state.inf) {
			this.setState({error2 : "You must specify a number of repetitions"})
			return;
		}
		if(this.state.rep.err && !this.state.inf) {
			return;
		}
		fetch("/bright", {
							method: 'POST',
							headers: {
								'Accept': 'application/json, text/plain, */*',
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
													values: this.state.values,
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
		this.setState({values: []})
	}
	handleValSave(event) {
		event.preventDefault();
		if(this.state.values.length === 0) {
			this.setState({error2: "You must add a value first"})
			return;
		}
		var saved = this.state.saved
		saved.push({values: JSON.parse(JSON.stringify(this.state.values)), name: this.state.saveName})
		this.setState({saved: saved})
	}
	handlesaveName(event) {
		event.preventDefault();
		this.setState({saveName: event.target.value});
	}
	handleValDel(index, event) {
		event.preventDefault();
		var saved = this.state.saved
		saved.splice(index, 1)
		this.setState({saved: saved})

	}
	handleValLoad(index, event) {
		event.preventDefault();
		this.setState({values: this.state.saved[index].values})
		
	}

	render() {
		const valinfos = this.state.values.map( (val, index) => 
						{return <ColorInfo key={index} r={val.value} g={val.value} b={val.value} t={val.t} w={val.w} 
												index={index} clickHandle={this.handleEdit} del={this.handleDel}/> })
		const error1 = this.state.error1 !== "" ? <div id="err"><p>{this.state.error1}</p></div> : null
		const error2 = this.state.error2 !== "" ? <div id="err"><p>{this.state.error2}</p></div> : null
		const changingButton = this.state.edit ? (<div className="add button" onClick={this.handleSave}>
													<p className="buttonText">Save</p>
												  </div>)
											   : (<div className="add button" onClick={this.handleAdd}>
													<p className="buttonText">Add</p>
												  </div>)
		const saved = this.state.saved ? (this.state.saved.map((val, index) =>
						{return <div className="button saved" key={index} onClick={this.handleValLoad.bind(this, index)} onContextMenu={this.handleValDel.bind(this, index)}> 
							<p className="buttonText">{val.name}</p>
						</div>})) : null
		return (
			<div id="form">
				<h1>Enter a Value:</h1>
				<NumInputs label="" divclass="add" value={this.state.value} change={this.handleVal} min={0} max={255} />
				<input id="slider" type="range" list="steps" name="val" min="0" max="255" defaultValue={0}  step="1" onChange={this.handleSlider} />
				<datalist id="steps">
				    <option value="0" />
				    <option value="25" />
				    <option value="50" />
				    <option value="75" />
				    <option value="100" />
				    <option value="125" />
				    <option value="150" />
				    <option value="175" />
				    <option value="200" />
				    <option value="225" />
				    <option value="250" />
				</datalist> 
					<div className="inputs">
						<NumInputs label="Transition Time (ms):" divclass="add" value={this.state.transition} change={this.handleTransition} min={0} />
						<NumInputs label="Wait Time (ms):" divclass="add" value={this.state.wait} change={this.handleWait} min={0} />
						{changingButton}
					</div>	
					{error1}
					<div id="tosend">
					{valinfos}
					</div>
					<input type="text" className="text" id="saveName" value={this.state.saveName} onChange={this.handlesaveName} />
					<div className="button" id="patternSave" onClick={this.handleValSave}>
						<p className="buttonText">Save</p>
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
					{saved}
			</div>
		);
	}
}

export default BrightnessForm;