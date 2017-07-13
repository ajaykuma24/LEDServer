class NumInputs extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			err: false
		}
		this.onChange=this.onChange.bind(this)
	}
	onChange(event) {
		event.preventDefault();
		const str = event.target.value
		const num = parseInt(str);
		var err;
		if(this.props.max) {
			err = !(str === "" || (num.toString() === str && num >= this.props.min && num <= this.props.max))	
		}
		else {
			err = !(str === "" || (num.toString() === str && num >= this.props.min))
		}
		this.props.change(event.target.value, err)
	}

	render() {
		const label = this.props.label ? <p>{this.props.label}</p> : null
		const err = this.props.value.err ? " error" : ""
		return (
			<div className={this.props.divclass}>
				{label}
				<input type="text" disabled = {(this.props.disabled)? "disabled" : ""} className={"text" + err} value={this.props.value.val} onChange={this.onChange} />
			</div>
		)
	}
}

export default NumInputs;