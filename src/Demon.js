import { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { isFunction } from './utils';
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
		changeListenerProp: PropTypes.string,
		keyPressListenerProp: PropTypes.string,
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
		changeListenerProp: 'onChange',
		keyPressListenerProp: 'onKeyPress',
	};

	constructor(props) {
		super(props);

		const { props: forwaredProps, formStore } = props;
		formStore.attach(forwaredProps.name);
	}

	handleChange = (...args) => {
		const {
			props,
			props: { name, changeListenerProp },
			formStore,
			mapValueOnChangeEvent,
		} = this.props;
		const onChange = props[changeListenerProp];
		const value = mapValueOnChangeEvent(...args);
		formStore.setValue(name, value);
		if (isFunction(onChange)) onChange(...args);
	};

	handleKeyPress = (...args) => {
		const {
			props,
			props: { keyPressListenerProp },
			formStore,
			mapKeyOnKeyPressEvent,
		} = this.props;
		const onKeyPress = props[keyPressListenerProp];
		const key = mapKeyOnKeyPressEvent(...args);
		if (key === 'Enter') formStore.submit();
		if (isFunction(onKeyPress)) onKeyPress(...args);
	};

	render() {
		const {
			props: { name, ...props },
			formStore,
			changeListenerProp,
			keyPressListenerProp,
			children,
		} = this.props;
		props[changeListenerProp] = this.handleChange;
		props[keyPressListenerProp] = this.handleKeyPress;
		props.value = formStore.getValue(name);
		return Children.only(children(props));
	}
}
