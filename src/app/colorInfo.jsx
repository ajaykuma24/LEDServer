import React from 'react';

class ColorInfo extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const color = 'rgb(' + this.props.r.toString() + ', ' + this.props.g.toString() + ', ' + this.props.b.toString() + ')';
		const style = {
			backgroundColor: color
		}
		return (
			<div className="colorInfo">
				<div className="colorBox" style={style}>
				</div>
				<div className="nums">
				<p className="infos">{this.props.t}</p>
    			<p className="infos">{this.props.w}</p>
    			</div>

			</div>
		);
	}
}

export default ColorInfo
