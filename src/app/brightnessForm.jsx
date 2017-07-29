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
			saved: []
		}

		this.handleVal = this.handleVal.bind(this);
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
	}
	componentWillMount() {
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
		}
		this.setState({value: {
									val: val,
									err: err
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
		this.setState({	value: value.value,
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
		if(this.state.colors.length === 0) {
			this.setState({error2: "You must add a value first"})
			return;
		}
		var saved = this.state.saved
		saved.push({values: JSON.parse(JSON.stringify(this.state.values))})
		this.setState({saved: saved})
	}
	handleValDel(index, event) {
		event.preventDefault();
		var saved = this.state.saved
		saved.splice(index, 1)
		this.setState({saved: saved})

	}
	handleValLoad(index, event) {
		event.preventDefault();
		this.setState({colors: this.state.saved[index].colors})
		
	}

	render() {
		const valinfos = this.state.values.map( (val, index) => 
						{return <ColorInfo key={index} r={val.value} g={val.value} b={val.value} t={val.t} w={val.w} index={index} clickHandle={this.handleDel} edit={this.handleEdit}/> })
		const error1 = this.state.error1 !== "" ? <div id="err"><p>{this.state.error1}</p></div> : null
		const error2 = this.state.error2 !== "" ? <div id="err"><p>{this.state.error2}</p></div> : null
		const changingButton = this.state.edit ? (<div className="add button" onClick={this.handleSave}>
													<p className="buttonText">Save</p>
												  </div>)
											   : (<div className="add button" onClick={this.handleAdd}>
													<p className="buttonText">Add</p>
												  </div>)
		const saved = this.state.saved ? (this.state.saved.map((val, index) =>
						{return <div className="button" key={index} onClick={this.handleColLoad.bind(this, index)} onContextMenu={this.handleColDel.bind(this, index)}> 
							<p className="buttonText">Pattern {index + 1}</p>
						</div>})) : null
		return (
			<div id="form">
				<h1>Enter a Value:</h1>
				<NumInputs label="" divclass="add" value={this.state.value} change={this.handleVal} min={0} max={255} />
					<div className="inputs">
						<NumInputs label="Transition Time (ms):" divclass="add" value={this.state.transition} change={this.handleTransition} min={0} />
						<NumInputs label="Wait Time (ms):" divclass="add" value={this.state.wait} change={this.handleWait} min={0} />
						{changingButton}
					</div>	
					{error1}
					<div id="tosend">
					{valinfos}
					</div>
					<div className="button" onClick={this.handleColSave}>
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