import { observable, computed, action } from 'mobx';
import { isFunction } from './utils';

class InputStore {
	@observable state = {};

	@computed
	get value() {
		return this.state.value;
	}
	set value(value) {
		const { state } = this;
		if (state.value === value) return false;
		state.value = value;
		this.state = state;
		return true;
	}

	constructor(value) {
		this.state = { value };
	}

	@action
	setState(state) {
		this.state = { ...this.state, ...state };
	}
}

export default class FormStore {
	@observable isValid = true;
	@observable parent = null;

	constructor(data, bus) {
		this._data = data;
		this.inputs = observable.map();
		this._bus = bus;
	}

	@action
	setParent(parent) {
		if (parent) this.parent = parent;
	}

	@action
	setData(data) {
		this._data = data;
		for (const [key, inputStore] of this.inputs) {
			inputStore.value = data[key];
		}
	}

	@action
	set(name, state) {
		const inputStore = this.inputs.get(name);
		if (!inputStore) return false;
		inputStore.setState(state);
		return true;
	}

	get(name) {
		return this.inputs.get(name);
	}

	getValue(name) {
		const inputStore = this.inputs.get(name);
		if (inputStore) return inputStore.value;
	}

	@action
	setValue(name, value) {
		const inputStore = this.inputs.get(name);
		if (!inputStore) return false;
		inputStore.value = value;
		return true;
	}

	@action
	attach(name) {
		const value = this._data[name];
		this.inputs.set(name, new InputStore(value));
	}

	@action
	detach(name) {
		this.inputs.delete(name);
	}

	submit() {
		const { onSubmit } = this._bus;
		const data = {};
		for (const [key, inputStore] of this.inputs) {
			data[key] = inputStore.value;
		}
		this._data = data;
		if (isFunction(onSubmit)) onSubmit(this._data);
	}
}
