/* eslint-disable react/no-find-dom-node */

import { render, unmountComponentAtNode, findDOMNode } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';

let div;

export function mount(element) {
	div = document.createElement('div');
	render(element, div);
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
