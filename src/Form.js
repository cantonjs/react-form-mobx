import React, { Component } from 'react';
import { object, func, string, oneOfType } from 'prop-types';
import { observe } from 'mobx';
import { observer } from 'mobx-react';
import FormStore from './FormStore';
import Context from './Context';
import { noop } from './utils';

@observer
export default class Form extends Component {
	static propTypes = {
		value: object,
		onSubmit: func,
		onValidChange: func,
		onValid: func,
		onInvalid: func,
		onChange: func,
		inputFilter: func,
		outputFilter: func,
		component: oneOfType([func, string, object]),
	};

	static defaultProps = {
		value: {},
		onSubmit: noop,
		onValidChange: noop,
		onValid: noop,
		onInvalid: noop,
		component: 'div',
	};

	constructor(props) {
		super(props);

		const {
			onSubmit,
			onValidChange,
			onValid,
			onInvalid,
			onChange,
			value,
			inputFilter,
			outputFilter,
		} = props;
		const formStore = new FormStore(value, {
			submit: onSubmit,
			change: onChange,
			isObject: true,
			inputFilter,
			outputFilter,
		});
		this.formStore = formStore;

		this.removeValidListener = observe(
			formStore,
			'isValid',
			({ type, newValue }) => {
				/* istanbul ignore else */
				if (type === 'update') {
					onValidChange(newValue);
					newValue ? onValid() : onInvalid();
				}
			},
		);
	}

	componentDidUpdate(prevProps) {
		const { value } = this.props;

		/* istanbul ignore else */
		if (prevProps.value !== value) {
			this.formStore.setPristineValue(value);
			this.formStore.touch(false);
		}
	}

	componentWillUnmount() {
		this.removeValidListener();
	}

	submit() {
		return this.formStore.submit();
	}

	reset() {
		return this.formStore.reset();
	}

	clear() {
		return this.formStore.clear();
	}

	getValidState() {
		return this.formStore.getValidState();
	}

	render() {
		const {
			component: Comp,
			value,
			onValidChange,
			onValid,
			onInvalid,
			onChange,
			inputFilter,
			outputFilter,
			...other
		} = this.props;
		return (
			<Context.Provider value={this.formStore}>
				<Comp {...other} />
			</Context.Provider>
		);
	}
}
