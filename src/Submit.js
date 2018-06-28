import React from 'react';
import { MaybePureComponent } from './utils';
import DemonButton from './DemonButton';

export default class Submit extends MaybePureComponent {
	render() {
		return (
			<DemonButton forwardedProps={this.props}>
				{(forwardedProps) => <button {...forwardedProps} type="button" />}
			</DemonButton>
		);
	}
}
