import React, { Component } from 'react';
import AccessingArgumentsExample from './components/SimpleMapExample';
import LoginComponent from './components/FacebookComponents';

class App extends Component {
	state = {
	    loggedIn: localStorage.getItem('loggedIn') || false
	};

	updateLoginState = () => {
        this.setState({ loggedIn: true });
        localStorage.setItem('loggedIn', JSON.stringify(true));
    };

	render() {
		if(this.state.loggedIn) {
		    return (
			    <AccessingArgumentsExample />
			);
		}
		else {
			return (
				<LoginComponent fixLoginState={this.updateLoginState}/>
			);
		}
	}
}

export default App;
