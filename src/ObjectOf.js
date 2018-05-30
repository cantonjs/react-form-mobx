import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Demon from './Demon';

export default class ObjectOf extends Component {
	static propTypes = {
		children: PropTypes.node,
		name: PropTypes.string.isRequired,
	};

	forwardedProps = {
		name: this.props.name,
	};

	defaultValue = {};

	render() {
		const { children, name, ...other } = this.props;
		return (
			<Demon
				{...other}
				forwardedProps={this.forwardedProps}
				defaultValue={this.defaultValue}
				isObject
			>
				{() => children}
			</Demon>
		);
	}
}
