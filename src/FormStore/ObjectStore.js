import { observable, computed, action } from 'mobx';
import PrimitiveStore from './PrimitiveStore';

export default class ObjectStore extends PrimitiveStore {
	@computed
	get value() {
		const res = this.getDefaultStoreValue();
		this.eachChildren((child, key) => {
			res[key] = child.value;
		});
		return res;
	}
	set value(value) {
		this._value = value;
		return true;
	}

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
	}

	getDefaultStoreValue() {
		return {};
	}

	@action
	applySettingValue(newValue, type, method) {
		// TODO: should handle deleted and added keys
		this[type] = newValue;
		this.eachChildren((child, key) => {
			const value = this[type][key];
			child[method](value);
		});
	}

	getValue() {
		const res = this.getDefaultStoreValue();
		this.eachChildren((child, key) => {
			const val = child.getValue();
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
		const childVal = sourceValue[key];
		return form.createChildren(this, key, childVal, options);
	}

	@action
	detach(key) {
		this.children.delete(key);
	}
}
