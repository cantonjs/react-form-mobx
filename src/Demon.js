import { Component, Children } from 'react';
import PropTypes from 'prop-types';

export default class Demon extends Component {
	static propTypes = {
		children: PropTypes.func.isRequired,
		props: PropTypes.object,
	};

	static defaultProps = {
		props: {},
	};

	render() {
		const { children, props } = this.props;
		return Children.only(children(props));
	}
}
