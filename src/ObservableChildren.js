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

	get size() {
		return this._isArray ? this._dataset.length : this._dataset.size;
	}

	observe(...args) {
		return this._dataset.observe(...args);
	}

	forEach(iterator) {
		if (this._isArray) return this._dataset.forEach(iterator);
		for (const [key, item] of this._dataset) {
			iterator(item, key, this._dataset);
		}
	}
}
