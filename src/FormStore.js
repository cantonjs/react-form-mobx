import { observable, action } from 'mobx';

export default class FormStore {
	@observable state = {};
	@observable parent = null;

	@action
	setParent(parent) {
		if (parent) this.parent = parent;
	}

	@action
	setState(state) {
		this.state = state;
	}

	@action
	set(key, value) {
		this.state[key] = value;
	}

	constructor(state) {
		this.state = state;
	}
}
