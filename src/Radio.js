import React from 'react';
import { MaybePureComponent } from './utils';
import Demon from './Demon';

export default class Radio extends MaybePureComponent {
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
