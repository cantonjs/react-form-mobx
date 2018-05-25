import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NestedProvider from './NestedProvider';

export default class ObjectOf extends Component {
	static propTypes = {
		children: PropTypes.node,
		name: PropTypes.string.isRequired,
	};

	render() {
		const { children, ...other } = this.props;
		return <NestedProvider {...other}>{children}</NestedProvider>;
	}
}
