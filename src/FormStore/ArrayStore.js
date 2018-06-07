import { observable, action } from 'mobx';
import ObjectStore from './ObjectStore';
import { createId } from '../utils';

export default class ArrayStore extends ObjectStore {
	@observable ids = [];

	_index = 0;

	constructor(pristineValue, options) {
		super(pristineValue, options);
		this._isRadioGroup = options.isRadioGroup;
		this.children = observable([]);
	}

	getDefaultStoreValue() {
		return [];
	}

	@action
	applySetValue(newValue) {
		this.actual.value = newValue;
		this.eachChildren((child, index) => {
			child.value = this.value[index];
		});
	}

	@action
	setPristineValue(value) {
		const finalValue = this.getInputValue(value);
		this.actual.isChecked = false;
		this.actual.pristineValue = finalValue;
		this.sourceValue = finalValue;
		const keysToBeDeleted = [];
		const keysToBeAdded = this.sourceValue.slice(this.children.length);
		this.eachChildren((child, key) => {
			if (key < this.sourceValue.length) {
				const value = this.sourceValue[key];
				child.setPristineValue(value);
			}
			else {
				keysToBeDeleted.push(child.key);
			}
		});
		keysToBeDeleted.forEach((key) => {
			this.detach(key);
			this.remove(key);
		});
		keysToBeAdded.forEach(() => {
			this.push(createId(this.key));
		});
		this.value = finalValue;
		this.dirty();
	}

	getFormData() {
		const res = this.getDefaultStoreValue();
		this.eachChildren((child) => {
			const val = child.getFormData();

			/* istanbul ignore else */
			if (!this.shouldIgnore(val)) res.push(val);
		});
		const value = this.getOutputValue(res);
		return this.shouldIgnore(value) ? undefined : value;
	}

	_findIndexByKey(key) {
		return this.children.findIndex((item) => item.key === key);
	}

	eachChildren(iterator, options = {}) {
		const { checked = true } = options;
		const filter = (item) => item.isChecked;
		let index = 0;
		this.children.forEach((item, _, ...args) => {
			if (!checked || filter(item)) iterator(item, index++, ...args);
		});
	}

	getChildren(key) {
		const index = this._findIndexByKey(key);
		if (~index) return this.children[index];
	}

	@action
	setChildren(key, store) {
		let index = this._findIndexByKey(key);

		/* istanbul ignore else */
		if (index < 0) index = this.children.length;

		this.children[index] = store;
		return true;
	}

	shouldCheck(key, value) {
		const { sourceValue } = this;
		const checked = !!~sourceValue.indexOf(value);
		if (checked) return checked;
		if (value === true) return !!~sourceValue.indexOf('true');
		return false;
	}

	hasKey(key) {
		if (this._isRadioGroup) return this.parentStore.hasKey(this.key);

		let matched = false;
		this.eachChildren(
			(child) => {
				if (!matched) matched = key === child.key;
			},
			{ checked: false },
		);
		return matched;
	}

	@action
	attach(key, options) {
		const { sourceValue, form } = this;
		const { isRadioGroup } = options;
		const index = isRadioGroup ? --this._index : this._index++;
		const value = index >= sourceValue.length ? '' : sourceValue[index];
		return form.createChildren(this, key, value, options);
	}

	@action
	detach(key) {
		const index = this._findIndexByKey(key);
		if (index < 0) return;
		this.sourceValue.splice(index, 1);
		this.children.splice(index, 1);
	}

	push = (id) => this.ids.push(id);

	remove = (id) => {
		const removed = this.ids.remove(id);

		/* istanbul ignore else */
		if (removed) this._index--;

		return removed;
	};

	@action
	checkKey(key) {
		this.eachChildren(
			(child) => {
				if (child.isChecked && child.key !== key) {
					child.isChecked = false;
				}
			},
			{ checked: false },
		);
	}
}
