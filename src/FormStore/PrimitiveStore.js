import { observable, computed, action } from 'mobx';
import { createFormatDataTypeFunc } from '../DataTypes';
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
	get isInvalid() {
		return !this.isValid;
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
			dataType,
			inputFilter,
			outputFilter,
		} = options;
		const dataTypeFilter = dataType && createFormatDataTypeFunc(dataType);
		this.key = key;
		this.pristineValue = pristineValue;
		this.isChecked = isChecked;
		this.form = form;
		this._dataTypeFilter = dataTypeFilter;
		this._inputFilter = inputFilter;
		this._outputFilter = outputFilter;
		this.validation = new Validation(validation, required, dataTypeFilter);
	}

	getOutputValue(value) {
		const { _outputFilter, _dataTypeFilter } = this;
		if (_outputFilter) value = _outputFilter(value);
		if (_dataTypeFilter) value = _dataTypeFilter(value);
		return value;
	}

	getInputValue(value) {
		const { _inputFilter } = this;
		if (_inputFilter) value = _inputFilter(value);
		return value;
	}

	getValue() {
		try {
			return this.getOutputValue(this.value);
		}
		catch (err) {
			this.setError(err);
		}
	}

	@action
	setValue(value) {
		try {
			this.value = this.getInputValue(value);
			this.dirty();
		}
		catch (err) {
			this.setError(err);
		}
	}

	@action
	setError(error) {
		this.error = error;
	}

	@action
	touch(isTouched = true) {
		this.isTouched = isTouched;
	}

	@action
	dirty() {
		try {
			this.validation.exec(this.value);
			this.touch();
			this.setError(null);
		}
		catch (err) {
			this.setError(err);
		}
	}

	submit = (...args) => this.form.submit(...args);
}
