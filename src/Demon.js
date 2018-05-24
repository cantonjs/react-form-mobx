import { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { isObject, isFunction } from './utils';
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
	};

	static defaultProps = {
		props: {},
	};

	handleChange = (ev, ...args) => {
		const { props: { name, onChange }, formStore } = this.props;
		if (ev && isObject(ev.currentTarget)) {
			console.log('change', ev.currentTarget.value);
			formStore.set(name, ev.currentTarget.value);
		}
		if (isFunction(onChange)) onChange(ev, ...args);
	};

	handleKeyPress = (ev, ...args) => {
		const { props: { onKeyPress }, formStore } = this.props;
		if (ev && ev.key === 'Enter') {
			console.log('onEnter');
		}
		if (isFunction(onKeyPress)) onKeyPress(ev, ...args);
	};

	render() {
		const { props: { name, ...props }, formStore, children } = this.props;
		props.onChange = this.handleChange;
		props.onKeyPress = this.handleKeyPress;
		props.value = formStore.state[name];
		return Children.only(children(props));
	}
}
