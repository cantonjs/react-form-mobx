import { observable, computed, action } from 'mobx';
import { emptyFunctionReturnsArg } from '../utils';
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
		const {
			key,
			isChecked = true,
			form = this,
			validation,
			required,
			inputFilter = emptyFunctionReturnsArg,
			outputFilter = emptyFunctionReturnsArg,
		} = options;
		this.key = key;
		this.pristineValue = pristineValue;
		this.isChecked = isChecked;
		this.form = form;
		this.filters = { inputFilter, outputFilter };
		this.validation = new Validation(validation, required);
	}

	getValue() {
		return this.filters.outputFilter(this.value);
	}

	@action
	setValue(value) {
		this.value = this.filters.inputFilter(value);
		this.emitOutput();
		this.touch(false);
	}

	@action
	setError(error) {
		this.error = error;
	}

	@action
	validate() {
		this.validation.exec(this.value);
	}

	@action
	touch(isTouched = true) {
		this.isTouched = isTouched;
	}

	emitOutput() {
		try {
			this.validate();
			this.setError(null);
		}
		catch (err) {
			this.setError(err);
		}
	}

	submit = (...args) => this.form.submit(...args);
}
