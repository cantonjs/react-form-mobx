import React, { Component } from 'react';
import DemonButton from './DemonButton';

export default class Reset extends Component {
	render() {
		return (
			<DemonButton forwardedProps={this.props} type="reset">
				{(forwardedProps) => <button {...forwardedProps} type="button" />}
			</DemonButton>
		);
	}
}
