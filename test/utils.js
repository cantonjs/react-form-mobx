/* eslint-disable react/no-find-dom-node */

import React, { Component, cloneElement } from 'react';
import { render, unmountComponentAtNode, findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { Simulate } from 'react-dom/test-utils';

let div;

class Wrapper extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
	};

	state = {};

	render() {
		const { props, state } = this;
		return cloneElement(props.children, state);
	}
}

export function mount(element) {
	div = document.createElement('div');
	const instance = render(<Wrapper>{element}</Wrapper>, div);
	return {
		setProps: (props) => instance.setState(props),
		element,
	};
}

export function unmount() {
	if (div) {
		unmountComponentAtNode(div);
		div = null;
	}
}

class SimulatedRef {
	constructor(ref) {
		this.current = ref.current;
		this.node = findDOMNode(ref.current);
	}

	change(attribute, value) {
		this.node[attribute] = value;
		Simulate.change(this.node);
	}

	click() {
		Simulate.click(this.node);
	}
}

export function simulate(ref) {
	return new SimulatedRef(ref);
}
