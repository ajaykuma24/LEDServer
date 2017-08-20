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
							console.log(res)
							return res.blob();
						})
						.then( (data) => {console.log(data); this.setState({status: false})})

	}
	shouldComponentUpdate(nextProps, nextState) {
		return !nextState.status === this.state.status;
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
								console.log('sent')
								console.log(data)
							})
			this.setState({status: !this.state.status})
			if(!this.state.status) {
				this.state.locked = true;
				setTimeout(()=>this.setState({locked: false}), 5000);
			}
		}
	}

	render() {
		const locked = this.state.locked ? <p>Switch is locked, please wait</p> : null
		return (
			<div>
				{locked}
				<label className="switch">
					<input type="checkbox" checked={this.state.status} onChange={this.handleSwitch}/>
					<span className="slider round"></span>
				</label>
			</div>
		)
	}
}

export default ASwitch