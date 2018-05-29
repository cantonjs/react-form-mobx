import { observable, computed, action } from 'mobx';
import Validation from '../Validation';

export default class PrimitiveStore {
	@observable pristineValue;
	@observable isChecked = true;
	@observable isTouched = false;
	@observable error = null;

	@computed
	get value() {
		return this.pristineValue;
	}
	set value(newValue) {
		if (this.pristineValue !== newValue) {
			this.pristineValue = newValue;
			this.emitOutput();
			this.touch(false);
			return true;
		}
		return false;
	}

	@computed
	get isValid() {
		return !this.error;
	}

	@computed
	get errorMessage() {
		return this.error ? this.error.message || 'Invalid' : '';
	}

	constructor(pristineValue, options = {}) {
		const { key, isChecked = true, form = this, validation } = options;
		this.key = key;
		this.pristineValue = pristineValue;
		this.isChecked = isChecked;
		this.form = form;
		this.validation = new Validation(validation);
	}

	@action
	setValue(value) {
		this.value = value;
		this.emitOutput();
		this.touch(false);
	}

	@action
	setError(error) {
		this.error = error;
	}

	@action
	validate() {
		const error = this.validation.exec(this.value);
		this.setError(error);
	}

	@action
	touch(isTouched = true) {
		this.isTouched = isTouched;
	}

	emitOutput() {
		this.validate();
	}

	submit = (...args) => this.form.submit(...args);
}
