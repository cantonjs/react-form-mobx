import { observable, computed, action, keys } from 'mobx';
import { isFunction, isUndefined } from './utils';
import ObservableChildren from './ObservableChildren';

export default class FormStore {
	@observable pristineValue;

	@computed
	get value() {
		const { pristineValue, isArray } = this;
		if (!this.children) return pristineValue;
		const res = isArray ? [] : {};
		this.children.forEach((child, key) => {
			res[key] = child.value;
		});
		return res;
	}
	set value(newValue) {
		if (!this.children) {
			this.pristineValue = newValue;
			return true;
		}
		this.children.forEach((child, key) => {
			const value = newValue[key];
			if (isUndefined(value)) this.children.delete(child.key);
			else child.value = value;
		});
		return true;
	}

	constructor(pristineValue, options = {}) {
		const { key, noChildren, isArray, onSubmit } = options;
		this.key = key;
		this.pristineValue = pristineValue;
		this.isArray = isArray;
		if (!noChildren) {
			this.children = new ObservableChildren({ isArray });
			this._bus = { onSubmit };
			this._index = 0; // for array
		}
	}

	@action
	attach(key, options = {}) {
		const { pristineValue, children, isArray } = this;
		let inputValue;
		if (isArray) {
			const index = this._index++;
			inputValue = index >= pristineValue.length ? '' : pristineValue[index];
		}
		else {
			inputValue = pristineValue[key];
		}
		options.key = key;
		const store = new FormStore(inputValue, options);
		children.set(key, store);
		return store;
	}

	@action
	detach(key) {
		this.children.delete(key);
	}

	submit = () => {
		const { onSubmit } = this._bus;
		if (isFunction(onSubmit)) onSubmit(this.value);
	};
}
