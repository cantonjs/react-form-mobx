import React, { Component } from 'react';
import Demon from './Demon';

export default class Form extends Component {
	render() {
		return (
			<Demon props={this.props}>
				{(props) => console.log('props', props) || <div {...props} />}
			</Demon>
		);
	}
}
