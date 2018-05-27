import { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { isFunction, warn } from './utils';
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
			return ev.currentTarget.value;
		},
		mapKeyOnKeyPressEvent(ev) {
			return ev.key;
		},
		propOnChange: 'onChange',
		propOnKeyPress: 'onKeyPress',
	};

	constructor(props) {
		super(props);

		const { props: forwaredProps, formStore } = props;
		this.inputStore = formStore.attach(forwaredProps.name, {
			noChildren: true,
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
