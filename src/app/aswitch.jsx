class ASwitch extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			status: false,
			locked: false
		}
		this.handleSwitch=this.handleSwitch.bind(this);
	}
	componentDidMount() {
		fetch("/switch", {
							method: 'GET'
						})
						.then(function(res) {
							return res.json();
						})
						.then( (data) => { this.setState({status: data.data})})

	}
	handleSwitch() {
		if(!this.state.locked) {
			fetch("/switch", {
								method: 'POST',
								headers: {
									'Accept': 'application/json, text/plain, */*',
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({
														airplay: !this.state.status,
													})
							})
							.then(function(res) {
								return res.text();
							})
							.then(function(data) {
							})
			this.setState({status: !this.state.status})
			if(!this.state.status) {
				this.state.locked = true;
				setTimeout(()=>this.setState({locked: false}), 10000);
			}
		}
	}

	render() {
		const locked = this.state.locked ? <p>Switch is locked, please wait</p> : null
		return (
			<div id="switch-container">
				{locked}
				<label className="switch">
					<input type="checkbox" checked={this.state.status} onChange={this.handleSwitch} disabled={this.state.locked}/>
					<span className="slider round"></span>
				</label>
			</div>
		)
	}
}

export default ASwitch