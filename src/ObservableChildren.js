import { observable } from 'mobx';

export default class ObservableChildren {
	constructor(options = {}) {
		const { isArray } = options;
		this._isArray = isArray;
		this._dataset = isArray ? observable([]) : observable.map();
	}

	get(key) {
		return this._isArray ? this._dataset[key] : this._dataset.get(key);
	}

	set(key, value) {
		if (this._isArray) this._dataset[key] = value;
		else this._dataset.set(key, value);
	}

	delete(key) {
		if (this._isArray) this._dataset.splice(key, 1);
		else this._dataset.delete(key);
	}

	get size() {
		return this._isArray ? this._dataset.length : this._dataset.size;
	}

	forEach(iterator) {
		if (this._isArray) return this._dataset.forEach(iterator);
		for (const [key, item] of this._dataset) {
			iterator(item, key, this._dataset);
		}
	}
}
