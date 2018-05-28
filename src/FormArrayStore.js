import { observable, computed } from 'mobx';

export default class FormArrayStore {
	@observable ids = [];

	@computed
	get length() {
		return this.ids.length;
	}

	_index = 0;

	attach = () => this._index++;
	push = (id) => this.ids.push(id);
	remove = (id) => {
		const removed = this.ids.remove(id);
		if (removed) this._index--;
		return removed;
	};
	includes = (id) => ~this.ids.indexOf(id);
}
