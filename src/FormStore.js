import { observable, computed, action } from 'mobx';
import { isFunction } from './utils';

export default class FormStore {
	@observable pristineValue;

	@computed
	get value() {
		if (!this.children) return this.pristineValue;
		const value = {};
		for (const [key, child] of this.children) {
			value[key] = child.value;
		}
		return { ...this.pristineValue, ...value };
	}
	set value(value) {
		this.pristineValue = value;
		if (!this.children) return true;
		for (const [key, child] of this.children) {
			// TODO: should handle when `key` is not in `value`
			child.value = value[key];
		}
		return true;
	}

	constructor(value, options = {}) {
		const { noChildren, onSubmit } = options;
		this.pristineValue = value;
		if (!noChildren) {
			this.children = observable.map();
			this._bus = { onSubmit };
		}
	}

	getInput(name) {
		return this.children.get(name);
	}

	@action
	attach(name, options) {
		const inputValue = this.pristineValue[name];
		const store = new FormStore(inputValue, options);
		this.children.set(name, store);
		return store;
	}

	@action
	detach(name) {
		this.children.delete(name);
	}

	submit = () => {
		const { onSubmit } = this._bus;
		if (isFunction(onSubmit)) onSubmit(this.value);
	};
}
