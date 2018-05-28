import { observable } from 'mobx';

export default class ObservableChildren {
	constructor(options = {}) {
		const { isArray } = options;
		this._isArray = isArray;
		this._dataset = isArray ? observable([]) : observable.map();
	}

	_ensureKey(key) {
		if (!this._isArray) return key;
		return this._dataset.findIndex((item) => item.key === key);
	}

	has(key) {
		key = this._ensureKey(key);
		return this._isArray ? key > -1 : this._dataset.has(key);
	}

	get(key) {
		key = this._ensureKey(key);
		return this._isArray ? this._dataset[key] : this._dataset.get(key);
	}

	set(key, value) {
		key = this._ensureKey(key);
		if (this._isArray) {
			if (key < 0) key = this._dataset.length;
			this._dataset[key] = value;
		}
		else this._dataset.set(key, value);
	}

	delete(key) {
		key = this._ensureKey(key);
		if (!this._isArray) this._dataset.delete(key);
		else if (key > -1) this._dataset.splice(key, 1);
	}

	clear() {
		this._dataset.clear();
	}

	get size() {
		return this._isArray ? this._dataset.length : this._dataset.size;
	}

	observe(...args) {
		return this._dataset.observe(...args);
	}

	forEach(iterator) {
		const filter = (item) => item.isChecked;
		if (this._isArray) {
			let index = 0;
			this._dataset.forEach((item, _, ...args) => {
				if (filter(item)) iterator(item, index++, ...args);
			});
		}
		else {
			for (const [key, item] of this._dataset) {
				if (filter(item)) iterator(item, key, this._dataset);
			}
		}
	}
}
