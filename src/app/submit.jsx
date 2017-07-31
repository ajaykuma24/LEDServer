import NumInputs from './numInputs';

class Submit extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			rep: {val: "1", err: false},
			inf: false,
			error: ""
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInf = this.handleInf.bind(this);
		this.handleRep = this.handleRep.bind(this)
	}
	handleRep(val, err) {
		if(err) {
			this.setState({error : "Please enter only positive values"})
		}
		else {
			this.setState({error : ""})
		}
		this.setState({rep: {
									val: val,
									err: err
									}
						})
	}
	handleInf(event) {
		if(this.state.rep.err && this.props.toSubmit.length !== 0) {
			this.setState({error: ""})

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
		if(this.props.toSubmit.length === 0) {
			this.setState({error: "You must add a color first"})
			return;
		}
		if(this.state.rep.val === "" && !this.state.inf) {
			this.setState({error : "You must specify a number of repetitions"})
			return;
		}
		if(this.state.rep.err && !this.state.inf) {
			return;
		}
		fetch("/" + this.props.url, {
							method: 'POST',
							headers: {
								'Accept': 'application/json, text/plain, */*',
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
													data: this.props.toSubmit,
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
	}


	render() {
		const error = this.state.error !== "" ? <div id="err"><p>{this.state.error}</p></div> : null
		return (
			<div id="submitcontainer">
				<div className="inputs">
					<NumInputs label="Repetitions:" divclass="submit" value={this.state.rep} change={this.handleRep} min={1} disabled={this.state.inf}/>
					<div className="submit" id="check">
						<p>Infinite:</p>
						<input type="checkbox" className="check" onChange={this.handleInf}/>
					</div>
					<div className="submit button change" onClick={this.handleSubmit}>
						<p className="buttonText change">Submit</p>
					</div>
				</div>
				{error}
			</div>
		)
	}
}

export default Submit;