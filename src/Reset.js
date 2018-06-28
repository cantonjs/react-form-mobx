import React from 'react';
import { MaybePureComponent } from './utils';
import DemonButton from './DemonButton';

export default class Reset extends MaybePureComponent {
	render() {
		return (
			<DemonButton forwardedProps={this.props} type="reset">
				{(forwardedProps) => <button {...forwardedProps} type="button" />}
			</DemonButton>
		);
	}
}
