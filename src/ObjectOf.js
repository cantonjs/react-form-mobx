import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Demon from './Demon';

export default class ObjectOf extends Component {
	static propTypes = {
		children: PropTypes.node,
		name: PropTypes.string.isRequired,
	};

	constructor(props) {
		super(props);
		const { children, ...forwardedProps } = props;
		this.forwardedProps = forwardedProps;
	}

	render() {
		const { children } = this.props;
		return (
			<Demon forwardedProps={this.forwardedProps} isObject>
				{() => children}
			</Demon>
		);
	}
}
