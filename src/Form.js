import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormStore from './FormStore';
import Context from './Context';

export default class Form extends Component {
	static propTypes = {
		value: PropTypes.object,
	};

	static defaultProps = {
		value: {},
	};

	constructor(props) {
		super(props);
		this.formStore = new FormStore(props.value);
	}

	render() {
		const { value, ...other } = this.props;
		return (
			<Context.Provider value={this.formStore}>
				<div {...other} />
			</Context.Provider>
		);
	}
}
