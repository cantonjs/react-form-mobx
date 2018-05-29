import React, { Component } from 'react';
import Demon from './Demon';

export default class Checkbox extends Component {
	render() {
		return (
			<Demon forwardedProps={this.props} checkable>
				{(props) => <input {...props} type="checkbox" />}
			</Demon>
		);
	}
}
