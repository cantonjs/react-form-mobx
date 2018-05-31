import React, { Component } from 'react';
import DemonButton from './DemonButton';

export default class Clear extends Component {
	render() {
		return (
			<DemonButton forwardedProps={this.props} type="clear">
				{(forwardedProps) => <button {...forwardedProps} type="button" />}
			</DemonButton>
		);
	}
}
