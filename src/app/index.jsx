import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch, Redirect, browserHistory} from 'react-router-dom';
import App from './app';
import ColorForm from './colorForm'
import BrightnessForm from './brightnessForm'
import ASwitch from './aswitch'

import './bundle.scss';


ReactDOM.render(
	<BrowserRouter>
	<App>
     <Redirect from="/" to="/rgb"/>
     <Route path="/rgb" component={ColorForm} />
     <Route path="/w" component={BrightnessForm} />
     <Route path="/airplay" component={ASwitch} />
     </App>
  	</BrowserRouter>,

	document.getElementById('react-root'))

