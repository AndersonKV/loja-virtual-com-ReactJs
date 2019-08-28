import React from 'react';
import ReactDOM from 'react-dom';
import './Styles.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { ProductProvider } from './context';
//import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
	<ProductProvider>
		<Router>
			<App />
		</Router>
	</ProductProvider>,
	document.getElementById('root'));

// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
