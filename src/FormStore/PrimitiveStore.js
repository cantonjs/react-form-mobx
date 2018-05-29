import { observable, computed, action } from 'mobx';

export default class PrimitiveStore {
	@observable pristineValue;
	@observable isChecked = true;
	@observable isTouched = false;

	@computed
	get value() {
		return this.pristineValue;
	}
	set value(newValue) {
		if (this.pristineValue !== newValue) {
			this.pristineValue = newValue;
			return true;
		}
		return false;
	}

	constructor(pristineValue, options = {}) {
		const { key, isChecked = true, form = this } = options;
		this.key = key;
		this.pristineValue = pristineValue;
		this.isChecked = isChecked;
		this.form = form;
	}

	@action
	touch() {
		this.isTouched = true;
	}

	submit = () => this.form.submit();
}
