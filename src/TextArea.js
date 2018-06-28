import React, { Component } from 'react';
import Demon from './Demon';

export default class TextArea extends Component {
	render() {
		return (
			<Demon forwardedProps={this.props}>
				{(props) => <textarea {...props} ref={(node) => (this.node = node)} />}
			</Demon>
		);
	}
}
