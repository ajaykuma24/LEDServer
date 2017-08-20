import {NavLink} from 'react-router-dom';

function App ({ children }) {
    return (
      	<div id='content'>
      		<title>LED Server</title>
      		<ul>
      		<li><NavLink to={'/rgb'} activeClassName="active">RGB</NavLink></li>
      		<li><NavLink to={'/w'} activeClassName="active">W</NavLink></li>
          <li><NavLink to={'/airplay'} activeClassName="active">Airplay</NavLink></li>
      		</ul>
      		{children}
      	</div>
    )
}

export default App
