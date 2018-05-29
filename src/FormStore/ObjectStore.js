import { observable, computed, action } from 'mobx';
import PrimitiveStore from './PrimitiveStore';

export default class ObjectStore extends PrimitiveStore {
	@computed
	get value() {
		const res = {};
		this.eachChildren((child, key) => {
			res[key] = child.value;
		});
		return res;
	}
	set value(newValue) {
		// TODO: should handle deleted and added keys

		this.pristineValue = newValue;

		this.eachChildren((child, key) => {
			const value = newValue[key];

			// TODO: should handle when value is undefined
			if (child.value !== value) child.value = value;
		});
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

	getValue() {
		const value = {};
		this.eachChildren((child, key) => {
			value[key] = child.getValue();
		});
		return this.getOutputValue(value);
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
		const { pristineValue, form } = this;
		const value = pristineValue[key];
		return form.createChildren(this, key, value, options);
	}

	@action
	detach(key) {
		this.children.delete(key);
	}
}
