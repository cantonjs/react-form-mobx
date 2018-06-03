import { observable, computed, action } from 'mobx';
import PrimitiveStore from './PrimitiveStore';
import { isFunction } from '../utils';

export default class ObjectStore extends PrimitiveStore {
	@computed
	get isValid() {
		if (this.error) return false;

		let isValid = true;
		this.eachChildren((child) => {
			if (!isValid || !child.isValid) isValid = false;
		});
		return isValid;
	}

	constructor(pristineValue, options = {}) {
		super(pristineValue, options);
		this.children = observable.map();
		this._handleChange = options.onChange;
	}

	getDefaultStoreValue() {
		return {};
	}

	applyGetValue() {
		const res = this.getDefaultStoreValue();
		this.eachChildren((child, key) => {
			res[key] = child.value;
		});
		return res;
	}

	@action
	applySetValue(newValue) {
		// TODO: should handle deleted and added keys
		this.actual.value = newValue;
		this.eachChildren((child, key) => {
			child.value = this.value[key];
		});
	}

	@action
	setPristineValue(value) {
		const finalValue = this.getInputValue(value);
		this.actual.pristineValue = finalValue;
		this.sourceValue = finalValue;
		this.eachChildren((child, key) => {
			const value = this.sourceValue[key];
			child.setPristineValue(value);
		});
		this.value = finalValue;
		this.dirty();
	}

	getFormData() {
		const res = this.getDefaultStoreValue();
		this.eachChildren((child, key) => {
			const val = child.getFormData();
			if (!child.shouldIgnore(val)) res[key] = val;
		});
		const value = this.getOutputValue(res);
		return this.shouldIgnore(value) ? undefined : value;
	}

	eachChildren(iterator) {
		for (const [key, item] of this.children) {
			if (item.isChecked) iterator(item, key, this.children);
		}
	}

	getChildren(key) {
		const { children } = this;
		if (children.has(key)) return children.get(key);
	}

	setChildren(key, store) {
		this.children.set(key, store);
		return true;
	}

	@action
	touch(isTouched) {
		this.eachChildren((child) => child.touch(isTouched));
	}

	@action
	attach(key, options = {}) {
		const { sourceValue, form } = this;
		const val = sourceValue[key];
		return form.createChildren(this, key, val, options);
	}

	@action
	detach(key) {
		this.children.delete(key);
	}

	emitChange = () => {
		if (!isFunction(this._handleChange)) return;
		const ev = {};
		Object.defineProperty(ev, 'value', {
			enumerable: true,
			get: () => this.value,
		});
		this._handleChange(ev);
	};
}
