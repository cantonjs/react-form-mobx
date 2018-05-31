import React, { Component } from 'react';
import DemonButton from './DemonButton';

export default class Submit extends Component {
	render() {
		return (
			<DemonButton forwardedProps={this.props}>
				{(forwardedProps) => <button {...forwardedProps} type="button" />}
			</DemonButton>
		);
	}
}
