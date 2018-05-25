import { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { isFunction, getFieldName } from './utils';
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
	};

	static defaultProps = {
		props: {},
		mapValueOnChangeEvent(ev) {
			// TODO: should improve error handling
			return ev.currentTarget.value;
		},
		mapKeyOnKeyPressEvent(ev) {
			// TODO: should improve error handling
			return ev.key;
		},
		propOnChange: 'onChange',
		propOnKeyPress: 'onKeyPress',
	};

	constructor(props) {
		super(props);

		const { props: forwaredProps, formStore } = props;
		this.fieldName = getFieldName(forwaredProps.name);
		this.inputStore = formStore.attach(this.fieldName, {
			noChildren: true,
		});
	}

	componentWillUnmount() {
		this.props.formStore.detach(this.fieldName);
	}

	handleChange = (...args) => {
		const { props, mapValueOnChangeEvent } = this.props;
		const onChange = props[props.propOnChange];
		const value = mapValueOnChangeEvent(...args);
		this.inputStore.value = value;
		if (isFunction(onChange)) onChange(...args);
	};

	handleKeyPress = (...args) => {
		const {
			props,
			props: { propOnKeyPress },
			formStore,
			mapKeyOnKeyPressEvent,
		} = this.props;
		const onKeyPress = props[propOnKeyPress];
		const key = mapKeyOnKeyPressEvent(...args);
		if (key === 'Enter') formStore.submit();
		if (isFunction(onKeyPress)) onKeyPress(...args);
	};

	render() {
		const { inputStore, props } = this;
		const {
			props: { name, ...forwaredProps },
			propOnChange,
			propOnKeyPress,
			children,
		} = props;
		forwaredProps[propOnChange] = this.handleChange;
		forwaredProps[propOnKeyPress] = this.handleKeyPress;
		forwaredProps.value = inputStore.value;
		return Children.only(children(forwaredProps));
	}
}
