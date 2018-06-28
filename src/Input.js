import React from 'react';
import { MaybePureComponent } from './utils';
import Demon from './Demon';

export default class Input extends MaybePureComponent {
	render() {
		return (
			<Demon forwardedProps={this.props}>
				{(props) => <input {...props} ref={(node) => (this.node = node)} />}
			</Demon>
		);
	}
}
