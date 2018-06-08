import { observable, computed, action } from 'mobx';
import PrimitiveStore from './PrimitiveStore';
import { isFunction } from '../utils';

export default class ObjectStore extends PrimitiveStore {
	@computed
	get isValid() {
		if (this.errorMessage) return false;

		let isValid = true;
		this.eachChildren((child) => {
			if (!isValid || !child.isValid) isValid = false;
		});
		return isValid;
	}

	constructor(pristineValue, options) {
		super(pristineValue, options);
		this.children = observable.map();
		this.bus.change = options.onChange;
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
	applySetValue() {
		// TODO: should handle deleted and added keys
		this.eachChildren((child, key) => {
			child.value = this.value[key];
		});
	}

	@action
	applySetPristineValue() {
		this.isChecked = false;
		this.eachChildren((child, key) => {
			const val = this.sourceValue[key];
			child.pristineValue = val;
		});
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

	eachChildren(iterator, options = {}) {
		const { checked = true } = options;
		for (const [key, item] of this.children) {
			if (!checked || item.isChecked) {
				iterator(item, key, this.children);
			}
		}
	}

	shouldCheck(key, value) {
		const val = this.sourceValue[key];
		const checked = val === value;
		if (checked) return checked;
		if (value === true) return val === 'true';
		return false;
	}

	hasKey(key) {
		return this.sourceValue.hasOwnProperty(key);
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
	attach(key, options) {
		const { sourceValue, form } = this;
		const val = sourceValue[key];
		return form.createChildren(this, key, val, options);
	}

	@action
	detach(key) {
		this.children.delete(key);
	}

	change = (store) => {
		if (!isFunction(this.bus.change)) return;
		const ev = {};
		const defineProperty = (prop, get) => {
			Object.defineProperty(ev, prop, {
				enumerable: true,
				configurable: true,
				get,
			});
		};
		defineProperty('value', () => this.value);
		defineProperty('key', () => store.key);
		this.bus.change(ev);
		process.nextTick(() => {
			delete ev.value;
			delete ev.key;
		});
	};
}
