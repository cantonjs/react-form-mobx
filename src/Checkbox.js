import React, { Component } from 'react';
import Demon from './Demon';

export default class Checkbox extends Component {
	render() {
		return (
			<Demon forwardedProps={this.props} checkable>
				{(props) => (
					<input
						{...props}
						type="checkbox"
						ref={(node) => (this.node = node)}
					/>
				)}
			</Demon>
		);
	}
}
