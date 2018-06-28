import React from 'react';
import { MaybePureComponent } from './utils';
import Demon from './Demon';

export default class Select extends MaybePureComponent {
	componentDidMount() {
		this.demon.setValue(this.node.value);
	}

	render() {
		return (
			<Demon forwardedProps={this.props} ref={(demon) => (this.demon = demon)}>
				{(props) => <select {...props} ref={(node) => (this.node = node)} />}
			</Demon>
		);
	}
}
