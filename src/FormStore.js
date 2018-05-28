import { observable, computed, action } from 'mobx';
import ObservableChildren from './ObservableChildren';
import {
	isFunction,
	isUndefined,
	isArray as isArrayType,
	createId,
} from './utils';

export default class FormStore {
	@observable pristineValue;
	@observable isChecked = true;
	@observable isTouched = false;

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
		this.pristineValue = newValue;
		if (!this.children) {
			return true;
		}

		const keysToBeDeleted = [];
		let keysToBeAdded = [];
		if (isArrayType(newValue)) {
			keysToBeAdded = newValue.slice(this.children.size);
		}
		else {
			// TODO: object
		}

		this.children.forEach((child, key) => {
			const value = newValue[key];
			if (isUndefined(value)) keysToBeDeleted.push(child.key);
			else child.value = value;
		});
		keysToBeDeleted.forEach((key) => this.children.delete(key));
		keysToBeAdded.forEach(() => {
			this.attach(createId(this.key), this._options);
		});
		return true;
	}

	constructor(pristineValue, options = {}) {
		const { key, isChecked = true, isObject, isArray, submit } = options;
		this.key = key;
		this.pristineValue = pristineValue;
		this.isChecked = isChecked;
		this.isArray = isArray;
		this._indexes = {};
		if (isObject) {
			this.children = new ObservableChildren({ isArray });
			this._bus = { submit };
			this._index = 0; // for array
		}
	}

	@action
	attach(key, options = {}) {
		const { pristineValue, children, isArray } = this;
		this._options = options;
		let value;
		if (isArray) {
			if (!this.children.has(key)) {
				const index = this._index++;
				value = index >= pristineValue.length ? '' : pristineValue[index];
			}
			else {
				value = this.children.get(key).value;
			}
		}
		else {
			value = pristineValue[key];
		}

		// enforce array type
		if (!options.isArray && isArrayType(value)) {
			let formStore;
			if (this.children.has(key)) {
				formStore = this.children.get(key);
			}
			else {
				formStore = this.attach(key, { isArray: true, isObject: true });
			}
			return formStore.attach(createId(key), {
				isChecked: ~value.indexOf(options.value),
			});
		}

		const inputStore = new FormStore(value, {
			...options,
			key,
			submit: this.submit,
		});
		children.set(key, inputStore);
		return inputStore;
	}

	@action
	detach(key) {
		this.children.delete(key);
	}

	@action
	touch() {
		this.isTouched = true;
	}

	submit = () => {
		const { submit } = this._bus;
		this.isTouched = true;
		if (isFunction(submit)) {
			const { value } = this;
			submit(value);
			return value;
		}
	};
}
