import React from 'react';
import { MaybePureComponent } from './utils';
import Demon from './Demon';

export default class TextArea extends MaybePureComponent {
	render() {
		return (
			<Demon forwardedProps={this.props}>
				{(props) => <textarea {...props} ref={(node) => (this.node = node)} />}
			</Demon>
		);
	}
}
