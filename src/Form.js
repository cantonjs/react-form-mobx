import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import FormStore from './FormStore';
import Context from './Context';
import { noop } from './utils';

@observer
export default class Form extends Component {
	static propTypes = {
		value: PropTypes.object,
		onSubmit: PropTypes.func,
	};

	static defaultProps = {
		value: {},
		onSubmit: noop,
	};

	constructor(props) {
		super(props);

		const { onSubmit, value } = props;
		const formStore = new FormStore(value, {
			submit: onSubmit,
			isObject: true,
		});
		this.formStore = formStore;
	}

	componentDidUpdate(prevProps) {
		const { value } = this.props;
		if (prevProps.value !== value) {
			this.formStore.setValue(value);
		}
	}

	blockNativeSubmit = (ev) => {
		ev.preventDefault();
	};

	submit() {
		return this.formStore.submit();
	}

	render() {
		const { value, ...other } = this.props;
		return (
			<Context.Provider value={this.formStore}>
				<form {...other} onSubmit={this.blockNativeSubmit} />
			</Context.Provider>
		);
	}
}
