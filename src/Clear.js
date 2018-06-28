import React from 'react';
import { MaybePureComponent } from './utils';
import DemonButton from './DemonButton';

export default class Clear extends MaybePureComponent {
	render() {
		return (
			<DemonButton forwardedProps={this.props} type="clear">
				{(forwardedProps) => <button {...forwardedProps} type="button" />}
			</DemonButton>
		);
	}
}
