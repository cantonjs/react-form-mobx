import React from 'react';
import { MaybePureComponent } from './utils';
import PropTypes from 'prop-types';
import Demon from './Demon';

export default class ObjectOf extends MaybePureComponent {
	static propTypes = {
		children: PropTypes.node,
		name: PropTypes.string.isRequired,
	};

	constructor(props) {
		super(props);
		const { children, ...forwardedProps } = props;
		this.forwardedProps = forwardedProps;
	}

	getValue() {
		return this.demon.getValue();
	}

	setValue(value) {
		this.demon.setValue(value);
	}

	getPristineValue() {
		return this.demon.getPristineValue();
	}

	setPristineValue(value) {
		this.demon.setPristineValue(value);
	}

	getValidState() {
		return this.demon.getValidState();
	}

	render() {
		const { children } = this.props;
		return (
			<Demon
				forwardedProps={this.forwardedProps}
				isObject
				ref={(demon) => (this.demon = demon)}
			>
				{() => children}
			</Demon>
		);
	}
}
