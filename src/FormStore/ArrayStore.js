import { observable, computed, action } from 'mobx';
import ObjectStore from './ObjectStore';
import { isUndefined, createId } from '../utils';

export default class ArrayStore extends ObjectStore {
	@observable ids = [];

	_index = 0;

	@computed
	get length() {
		return this.ids.length;
	}

	constructor(pristineValue, options = {}) {
		super(pristineValue, options);
		this.children = observable([]);
	}

	getDefaultStoreValue() {
		return [];
	}

	@action
	applySettingValue(newValue, type, method) {
		this[type] = newValue;
		const keysToBeDeleted = [];
		let keysToBeAdded = [];
		keysToBeAdded = this.sourceValue.slice(this.children.length);
		this.eachChildren((child, index) => {
			const parentValue = this[type];
			const { length } = parentValue;
			const value = index >= length ? undefined : parentValue[index];
			if (isUndefined(value)) keysToBeDeleted.push(child.key);
			else child[method](value);
		});
		keysToBeDeleted.forEach((key) => {
			this.detach(key);
			this.remove(key);
		});
		keysToBeAdded.forEach(() => {
			this.push(createId(this.key));
		});
	}

	getValue() {
		const res = this.getDefaultStoreValue();
		this.eachChildren((child) => {
			const val = child.getValue();
			if (!this.shouldIgnore(val)) res.push(val);
		});
		const value = this.getOutputValue(res);
		return this.shouldIgnore(value) ? undefined : value;
	}

	_findIndexByKey(key) {
		return this.children.findIndex((item) => item.key === key);
	}

	eachChildren(iterator) {
		const filter = (item) => item.isChecked;
		let index = 0;
		this.children.forEach((item, _, ...args) => {
			if (filter(item)) iterator(item, index++, ...args);
		});
	}

	getChildren(key) {
		const { children } = this;
		const index = this._findIndexByKey(key);
		if (children.includes(index)) return children[index];
	}

	@action
	setChildren(key, store) {
		let index = this._findIndexByKey(key);
		if (index < 0) index = this.children.length;
		this.children[index] = store;
		return true;
	}

	@action
	attach(key, options = {}) {
		const { sourceValue, form } = this;
		const index = this._index++;
		const value = index >= sourceValue.length ? '' : sourceValue[index];
		return form.createChildren(this, key, value, options);
	}

	@action
	detach(key) {
		const index = this._findIndexByKey(key);
		if (index > -1) this.children.splice(index, 1);
	}

	push = (id) => this.ids.push(id);

	remove = (id) => {
		const removed = this.ids.remove(id);
		if (removed) this._index--;
		return removed;
	};

	includes = (id) => ~this.ids.indexOf(id);
}
