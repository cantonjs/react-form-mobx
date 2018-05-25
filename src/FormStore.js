import { observable, computed, action } from 'mobx';
import { isFunction } from './utils';
import ObservableChildren from './ObservableChildren';

export default class FormStore {
	@observable pristineValue;

	@computed
	get value() {
		const { pristineValue } = this;
		if (!this.children) return pristineValue;
		const res = this._isArray ? pristineValue.slice() : { ...pristineValue };
		this.children.forEach((child, key) => {
			res[key] = child.value;
		});
		return res;
	}
	set value(value) {
		this.pristineValue = value;
		if (!this.children) return true;
		this.children.forEach((child, key) => {
			// TODO: should handle when `key` is not in `value`
			child.value = value[key];
		});
		return true;
	}

	constructor(pristineValue, options = {}) {
		const { noChildren, isArray, onSubmit } = options;
		this.pristineValue = pristineValue;
		this._isArray = isArray;
		if (!noChildren) {
			this.children = new ObservableChildren({ isArray });
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
