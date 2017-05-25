import React from 'react';

class ColorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {R: 0, G: 0, B: 0, value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    var R = parseInt(event.target.value.slice(1, 3), 16)
    var G = parseInt(event.target.value.slice(3, 5), 16) 
    var B = parseInt(event.target.value.slice(5, 7), 16)
    document.getElementById('submit').style.backgroundColor = event.target.value;
    this.setState({R: R, G: G, B: B, value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: R: ' + this.state.R.toString() + ' G: ' + this.state.G.toString() +' B: ' + this.state.B.toString() );
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Select a Color:</label>
          <input type="color" value={this.state.value} onChange={this.handleChange} />
        <div id="submit" onClick={this.handleSubmit}>
          <p>Submit</p>
        </div>
      </form>
    );
  }
}

export default ColorForm;