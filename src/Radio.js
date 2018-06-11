import React, { Component } from 'react';
import Demon from './Demon';

export default class Radio extends Component {
	render() {
		return (
			<Demon forwardedProps={this.props} checkable isRadio>
				{(props) => (
					<input {...props} type="radio" ref={(node) => (this.node = node)} />
				)}
			</Demon>
		);
	}
}
