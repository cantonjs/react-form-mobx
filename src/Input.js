import React, { Component } from 'react';
import Demon from './Demon';

export default class Input extends Component {
	render() {
		return (
			<Demon props={this.props}>
				{({ isTouched, ...props }) => <input {...props} />}
			</Demon>
		);
	}
}
