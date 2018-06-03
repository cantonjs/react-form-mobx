import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { isFunction, warn } from './utils';
import { DataTypeKeys } from './DataTypes';
import Context from './Context';
import withFormStore from './withFormStore';

@withFormStore()
@observer
export default class Demon extends Component {
	static propTypes = {
		children: PropTypes.func.isRequired,
		formStore: PropTypes.object.isRequired,
		forwardedProps: PropTypes.shape({
			name: PropTypes.string.isRequired,
			defaultValue: PropTypes.any,
			validation: PropTypes.oneOfType([
				PropTypes.arrayOf(PropTypes.func),
				PropTypes.func,
			]),
			required: PropTypes.bool,
			inputFilter: PropTypes.func,
			outputFilter: PropTypes.func,
			dataType: PropTypes.oneOf(DataTypeKeys),
			enforceSubmit: PropTypes.bool,

			enum: PropTypes.array,
			pattern: PropTypes.instanceOf(RegExp),
			maxLength: PropTypes.number,
			minLength: PropTypes.number,
			maximum: PropTypes.number,
			exclusiveMaximum: PropTypes.number,
			minimum: PropTypes.number,
			exclusiveMinimum: PropTypes.number,
		}).isRequired,
		checkable: PropTypes.bool,
		getValueFromChangeEvent: PropTypes.func,
		getCheckedFromChangeEvent: PropTypes.func,
		getKeyFromKeyPressEvent: PropTypes.func,
		propOnChange: PropTypes.string,
		propOnKeyPress: PropTypes.string,
		propOnBlur: PropTypes.string,

		isObject: PropTypes.bool,
		isArray: PropTypes.bool,
	};

	static defaultProps = {
		forwardedProps: {},
		checkable: false,
		getValueFromChangeEvent: (ev) => ev.currentTarget.value,
		getCheckedFromChangeEvent: (ev) => ev.currentTarget.checked,
		getKeyFromKeyPressEvent: (ev) => ev.key,
		propOnChange: 'onChange',
		propOnKeyPress: 'onKeyPress',
		propOnBlur: 'onBlur',
		isObject: false,
		isArray: false,
	};

	constructor(props) {
		super(props);

		const { forwardedProps, formStore, isObject, isArray } = props;
		const { name, ...otherForwardedProps } = forwardedProps;
		this.inputStore = formStore.attach(name, {
			isObject,
			isArray,
			...otherForwardedProps,
		});
		this.inputStore.dirty();
	}

	componentWillUnmount() {
		this.props.formStore.detach(this.inputStore.key);
	}

	handleChange = (...args) => {
		const {
			forwardedProps,
			checkable,
			getValueFromChangeEvent,
			getCheckedFromChangeEvent,
			propOnChange,
			formStore,
		} = this.props;
		const onChange = forwardedProps[propOnChange];
		if (isFunction(onChange)) onChange(...args);
		try {
			const value = getValueFromChangeEvent(...args);
			this.inputStore.value = value;

			if (checkable) {
				const checked = getCheckedFromChangeEvent(...args);
				this.inputStore.isChecked = checked;
			}

			this.inputStore.dirty();
		}
		catch (err) {
			warn(
				`Failed to map value from "${propOnChange}",`,
				'changing "props.getValueFromChangeEvent" may resolve this problem.',
			);
			console.error(err);
		}
		formStore.dirty();
	};

	handleKeyPress = (...args) => {
		const {
			forwardedProps,
			formStore,
			propOnKeyPress,
			getKeyFromKeyPressEvent,
		} = this.props;
		const onKeyPress = forwardedProps[propOnKeyPress];
		if (isFunction(onKeyPress)) onKeyPress(...args);
		try {
			const key = getKeyFromKeyPressEvent(...args);
			if (key === 'Enter') formStore.submit();
		}
		catch (err) {
			warn(
				`Failed to map value from "${propOnKeyPress}",`,
				'changing "props.getKeyFromKeyPressEvent" may resolve this problem.',
			);
			console.error(err);
		}
	};

	handleBlur = (...args) => {
		const { forwardedProps, propOnBlur } = this.props;
		const onBlur = forwardedProps[propOnBlur];
		if (isFunction(onBlur)) onBlur(...args);
		this.inputStore.touch();
	};

	renderChildren() {
		const {
			inputStore,
			inputStore: { value, isChecked },
			props: {
				forwardedProps: {
					defaultValue,
					name,
					validation,
					inputFilter,
					outputFilter,
					dataType,
					enforceSubmit,
					enum: enumeration,
					pattern,
					maxLength,
					minLength,
					maximum,
					exclusiveMaximum,
					minimum,
					exclusiveMinimum,
					...forwardedProps
				},
				propOnChange,
				propOnKeyPress,
				propOnBlur,
				checkable,
				children,
			},
		} = this;
		const props = {
			value,
			...forwardedProps,
			[propOnChange]: this.handleChange,
			[propOnKeyPress]: this.handleKeyPress,
			[propOnBlur]: this.handleBlur,
		};
		const validState = inputStore.getValidState();
		if (checkable && !props.hasOwnProperty('checked')) {
			props.checked = isChecked;
		}
		return Children.only(children(props, validState));
	}

	render() {
		const { inputStore, props: { children, isObject } } = this;
		return isObject ? (
			<Context.Provider value={inputStore}>{children()}</Context.Provider>
		) : (
			this.renderChildren()
		);
	}
}
