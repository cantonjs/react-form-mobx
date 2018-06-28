import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { isFunction, isEmpty, warn } from './utils';
import { FormatTypesKeys } from './FormatTypes';
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
			value: PropTypes.any,
			defaultValue: PropTypes.any,
			preValidate: PropTypes.func,
			validation: PropTypes.oneOfType([
				PropTypes.arrayOf(PropTypes.func),
				PropTypes.func,
			]),
			required: PropTypes.bool,
			inputFilter: PropTypes.func,
			outputFilter: PropTypes.func,
			preFormat: PropTypes.func,
			format: PropTypes.oneOf(FormatTypesKeys),
			formatFunc: PropTypes.func,
			withEmpty: PropTypes.oneOf(['auto', true, false]),

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
		isRadio: PropTypes.bool,

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
		isRadio: false,
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

		const {
			forwardedProps,
			formStore,
			isObject,
			isArray,
			checkable,
			isRadio,
			propOnChange,
		} = props;
		const { name, ...otherForwardedProps } = forwardedProps;
		const options = {
			isObject,
			isArray,
			checkable,
			isRadio,
			...otherForwardedProps,
		};

		if (checkable && isEmpty(forwardedProps.value)) {
			options.value = true;
			if (!forwardedProps.format) options.format = 'boolean';
		}

		if (isObject) {
			options.onChange = otherForwardedProps[propOnChange];
		}

		this.inputStore = formStore.attach(name, options);
		this.inputStore.validate();
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
		} = this.props;
		const onChange = forwardedProps[propOnChange];
		if (isFunction(onChange)) onChange(...args);

		if (checkable) {
			try {
				const checked = getCheckedFromChangeEvent(...args);
				this.inputStore.isChecked = checked;
			}
			catch (err) {
				warn(
					`Failed to get checked from "${propOnChange}",`,
					'changing "props.getCheckedFromChangeEvent" may resolve this problem.',
				);
				console.error(err);
			}
		}
		else {
			try {
				const value = getValueFromChangeEvent(...args);
				this.inputStore.value = value;
			}
			catch (err) {
				warn(
					`Failed to get value from "${propOnChange}",`,
					'changing "props.getValueFromChangeEvent" may resolve this problem.',
				);
				console.error(err);
			}
		}

		this.inputStore.emitChange();
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
		let key;
		try {
			key = getKeyFromKeyPressEvent(...args);
		}
		catch (err) {
			warn(
				`Failed to get key from "${propOnKeyPress}",`,
				'changing "props.getKeyFromKeyPressEvent" may resolve this problem.',
			);
			console.error(err);
		}
		if (key === 'Enter') formStore.submit();
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
					defaultChecked,
					name,
					preValidate,
					validation,
					inputFilter,
					outputFilter,
					preFormat,
					format,
					formatFunc,
					withEmpty,
					enum: enumeration,
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
