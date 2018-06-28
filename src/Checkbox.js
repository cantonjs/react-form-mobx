import React from 'react';
import { MaybePureComponent } from './utils';
import Demon from './Demon';

export default class Checkbox extends MaybePureComponent {
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
