import { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { isFunction, warn } from './utils';
import withFormStore from './withFormStore';

@withFormStore()
export default class DemonButton extends Component {
	static propTypes = {
		children: PropTypes.func.isRequired,
		type: PropTypes.oneOf(['submit', 'reset', 'clear']),
		formStore: PropTypes.object.isRequired,
		forwardedProps: PropTypes.object,
		getKeyFromKeyPressEvent: PropTypes.func,
		propOnClick: PropTypes.string,
		propOnKeyPress: PropTypes.string,
	};

	static defaultProps = {
		forwardedProps: {},
		type: 'submit',
		getKeyFromKeyPressEvent: (ev) => ev.key,
		propOnClick: 'onClick',
		propOnKeyPress: 'onKeyPress',
	};

	constructor(props) {
		super(props);

		this.inputStore = props.formStore;
	}

	handleClick = (...args) => {
		const { forwardedProps, propOnClick } = this.props;
		const onClick = forwardedProps[propOnClick];
		if (isFunction(onClick)) onClick(...args);
		this.emit();
	};

	handleKeyPress = (...args) => {
		const {
			forwardedProps,
			propOnKeyPress,
			getKeyFromKeyPressEvent,
		} = this.props;
		const onKeyPress = forwardedProps[propOnKeyPress];
		if (isFunction(onKeyPress)) onKeyPress(...args);
		try {
			const key = getKeyFromKeyPressEvent(...args);

			/* istanbul ignore else */
			if (key === 'Enter') this.emit();
		}
		catch (err) /* istanbul ignore next */ {
			warn(
				`Failed to get value from "${propOnKeyPress}",`,
				'changing "props.getKeyFromKeyPressEvent" may resolve this problem.',
			);
			console.error(err);
		}
	};

	emit() {
		const { formStore, type } = this.props;
		formStore[type]();
	}

	render() {
		const {
			forwardedProps,
			propOnClick,
			propOnKeyPress,
			children,
		} = this.props;
		const props = {
			...forwardedProps,
			[propOnClick]: this.handleClick,
			[propOnKeyPress]: this.handleKeyPress,
		};
		return Children.only(children(props));
	}
}
