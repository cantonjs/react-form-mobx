import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { isFunction, isUndefined, warn } from './utils';
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
			dataType: PropTypes.oneOfType([
				PropTypes.oneOf(DataTypeKeys),
				PropTypes.func,
			]),
		}).isRequired,
		defaultValue: PropTypes.any,
		checkable: PropTypes.bool,
		mapValueOnChangeEvent: PropTypes.func,
		mapCheckOnChangeEvent: PropTypes.func,
		mapKeyOnKeyPressEvent: PropTypes.func,
		propOnChange: PropTypes.string,
		propOnKeyPress: PropTypes.string,
		propOnBlur: PropTypes.string,

		isObject: PropTypes.bool,
		isArray: PropTypes.bool,
	};

	static defaultProps = {
		forwardedProps: {},
		defaultValue: '',
		checkable: false,
		mapValueOnChangeEvent: (ev) => ev.currentTarget.value,
		mapCheckOnChangeEvent: (ev) => ev.currentTarget.checked,
		mapKeyOnKeyPressEvent: (ev) => ev.key,
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
			defaultValue,
			isObject,
			isArray,
		} = props;
		const {
			name,
			value,
			defaultValue: _defaultValue,
			required,
			validation,
			inputFilter,
			outputFilter,
			dataType,
		} = forwardedProps;
		this.inputStore = formStore.attach(name, {
			isObject,
			isArray,
			value,
			defaultValue: isUndefined(_defaultValue) ? defaultValue : _defaultValue,
			required,
			validation,
			inputFilter,
			outputFilter,
			dataType,
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
			mapValueOnChangeEvent,
			mapCheckOnChangeEvent,
			propOnChange,
			formStore,
		} = this.props;
		const onChange = forwardedProps[propOnChange];
		if (isFunction(onChange)) onChange(...args);
		try {
			const value = mapValueOnChangeEvent(...args);
			this.inputStore.setValue(value);

			if (checkable) {
				const checked = mapCheckOnChangeEvent(...args);
				this.inputStore.isChecked = checked;
			}
		}
		catch (err) {
			warn(
				`Failed to map value from "${propOnChange}",`,
				'changing "props.mapValueOnChangeEvent" may resolve this problem.',
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
			mapKeyOnKeyPressEvent,
		} = this.props;
		const onKeyPress = forwardedProps[propOnKeyPress];
		if (isFunction(onKeyPress)) onKeyPress(...args);
		try {
			const key = mapKeyOnKeyPressEvent(...args);
			if (key === 'Enter') formStore.submit();
		}
		catch (err) {
			warn(
				`Failed to map value from "${propOnKeyPress}",`,
				'changing "props.mapKeyOnKeyPressEvent" may resolve this problem.',
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
			inputStore: {
				value,
				isChecked,
				isTouched,
				isValid,
				isInvalid,
				errorMessage,
			},
			props: {
				forwardedProps: {
					defaultValue,
					name,
					validation,
					inputFilter,
					outputFilter,
					dataType,
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
		const helper = {
			isTouched,
			isValid,
			isInvalid,
			errorMessage,
		};
		if (checkable && !props.hasOwnProperty('checked')) {
			props.checked = isChecked;
		}
		return Children.only(children(props, helper));
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
