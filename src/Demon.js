import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { isFunction, warn } from './utils';
import Context from './Context';
import withFormStore from './withFormStore';

@withFormStore()
@observer
export default class Demon extends Component {
	static propTypes = {
		children: PropTypes.func.isRequired,
		formStore: PropTypes.object.isRequired,
		props: PropTypes.shape({
			name: PropTypes.string.isRequired,
		}).isRequired,
		mapValueOnChangeEvent: PropTypes.func,
		mapKeyOnKeyPressEvent: PropTypes.func,
		propOnChange: PropTypes.string,
		propOnKeyPress: PropTypes.string,
		propOnBlur: PropTypes.string,

		isObject: PropTypes.bool,
		isArray: PropTypes.bool,
	};

	static defaultProps = {
		props: {},
		mapValueOnChangeEvent(ev) {
			return ev.currentTarget.value;
		},
		mapKeyOnKeyPressEvent(ev) {
			return ev.key;
		},
		propOnChange: 'onChange',
		propOnKeyPress: 'onKeyPress',
		propOnBlur: 'onBlur',
		isObject: false,
		isArray: false,
	};

	constructor(props) {
		super(props);

		const { props: forwaredProps, formStore, isObject, isArray } = props;
		this.inputStore = formStore.attach(forwaredProps.name, {
			isObject,
			isArray,
		});
	}

	componentWillUnmount() {
		this.props.formStore.detach(this.inputStore.key);
	}

	handleChange = (...args) => {
		const { props, mapValueOnChangeEvent, propOnChange } = this.props;
		const onChange = props[propOnChange];
		if (isFunction(onChange)) onChange(...args);
		try {
			const value = mapValueOnChangeEvent(...args);
			this.inputStore.value = value;
		}
		catch (err) {
			warn(
				`Failed to map value from "${propOnChange}",`,
				'changing "props.mapValueOnChangeEvent" may resolve this problem.',
			);
			console.error(err);
		}
	};

	handleKeyPress = (...args) => {
		const {
			props,
			formStore,
			propOnKeyPress,
			mapKeyOnKeyPressEvent,
		} = this.props;
		const onKeyPress = props[propOnKeyPress];
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
		const { props, formStore, propOnBlur } = this.props;
		const onBlur = props[propOnBlur];
		if (isFunction(onBlur)) onBlur(...args);
		formStore.touch();
	};

	renderChildren() {
		const { inputStore, props } = this;
		const {
			props: { name, ...forwaredProps },
			propOnChange,
			propOnKeyPress,
			propOnBlur,
			children,
		} = props;
		forwaredProps[propOnChange] = this.handleChange;
		forwaredProps[propOnKeyPress] = this.handleKeyPress;
		forwaredProps[propOnBlur] = this.handleBlur;
		forwaredProps.value = inputStore.value;
		forwaredProps.isTouched = inputStore.isTouched;
		return Children.only(children(forwaredProps));
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
