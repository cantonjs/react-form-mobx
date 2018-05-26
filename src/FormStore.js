import { observable, computed, action } from 'mobx';
import { isFunction, isArray, clone, getFieldName } from './utils';
import ObservableChildren from './ObservableChildren';

export default class FormStore {
	@observable pristineValue;

	@computed
	get value() {
		const { pristineValue } = this;
		if (!this.children) return pristineValue;
		const res = clone(pristineValue);
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
		const { key, noChildren, array, onSubmit } = options;
		this.key = key;
		this.pristineValue = pristineValue;
		if (!noChildren) {
			this.children = new ObservableChildren({ array });
			this._bus = { onSubmit };
			if (array) this._index = 0; // for array
		}
	}

	@action
	attach(name, options = {}) {
		const { pristineValue, children } = this;
		let key;
		if (isArray(pristineValue)) {
			const nextIndex = this._index++;
			if (nextIndex >= pristineValue.length) pristineValue.push('');
			key = nextIndex;
		}
		else {
			key = getFieldName(name);
		}
		const inputValue = pristineValue[key];
		console.log('inputValue', key, inputValue);
		options.key = key;

		const store = new FormStore(inputValue, options);
		children.set(key, store);
		return store;
	}

	@action
	detach(store) {
		const { children } = this;
		if (this._index) this._index--;
		children.delete(store.key);
	}

	submit = () => {
		const { onSubmit } = this._bus;
		if (isFunction(onSubmit)) onSubmit(this.value);
	};
}
