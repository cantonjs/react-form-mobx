import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observe } from 'mobx';
import { observer } from 'mobx-react';
import FormStore from './FormStore';
import Context from './Context';
import { noop } from './utils';

@observer
export default class Form extends Component {
	static propTypes = {
		value: PropTypes.object,
		onSubmit: PropTypes.func,
		onValidChange: PropTypes.func,
		onValid: PropTypes.func,
		onInvalid: PropTypes.func,
	};

	static defaultProps = {
		value: {},
		onSubmit: noop,
		onValidChange: noop,
		onValid: noop,
		onInvalid: noop,
	};

	constructor(props) {
		super(props);

		const { onSubmit, onValidChange, onValid, onInvalid, value } = props;
		const formStore = new FormStore(value, {
			submit: onSubmit,
			isObject: true,
		});
		this.formStore = formStore;

		this.removeValidListener = observe(
			formStore,
			'isValid',
			({ type, newValue }) => {
				if (type === 'update') {
					onValidChange(newValue);
					newValue ? onValid() : onInvalid();
				}
			},
		);
	}

	componentDidUpdate(prevProps) {
		const { value } = this.props;
		if (prevProps.value !== value) {
			this.formStore.setPristineValue(value);
			this.formStore.touch(false);
		}
	}

	componentWillUnmount() {
		this.removeValidListener();
	}

	blockNativeSubmit = (ev) => {
		ev.preventDefault();
	};

	submit() {
		return this.formStore.submit();
	}

	reset() {
		return this.formStore.reset();
	}

	clear() {
		return this.formStore.clear();
	}

	render() {
		const { value, onValidChange, onValid, onInvalid, ...other } = this.props;
		return (
			<Context.Provider value={this.formStore}>
				<form {...other} onSubmit={this.blockNativeSubmit} />
			</Context.Provider>
		);
	}
}
