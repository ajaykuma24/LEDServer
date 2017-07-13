class ColorInfo extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.contextMenu = this.contextMenu.bind(this);
	}
	contextMenu(event) {
		event.preventDefault();
		this.props.edit(this.props.index);
	}
	handleClick(event) {
		event.preventDefault();
		this.props.clickHandle(this.props.index);
	}
	render() {
		const color = 'rgb(' + this.props.r.toString() + ', ' + this.props.g.toString() + ', ' + this.props.b.toString() + ')';
		const style = {
			backgroundColor: color
		}
		return (
			<div className="colorInfo" onClick={this.handleClick} onContextMenu={this.contextMenu}>
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
