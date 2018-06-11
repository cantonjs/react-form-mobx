import React, { Component } from 'react';
import Demon from './Demon';

export default class Input extends Component {
	render() {
		return (
			<Demon forwardedProps={this.props}>
				{(props) => <input {...props} ref={(node) => (this.node = node)} />}
			</Demon>
		);
	}
}
