import { observable, computed, action } from 'mobx';
import { createFormatDataTypeFunc } from '../DataTypes';
import Validation from '../Validation';
import { isUndefined } from '../utils';

export default class PrimitiveStore {
	@observable _pristineValue;
	@observable isChecked = true;
	@observable isTouched = false;
	@observable error = null;

	@computed
	get pristineValue() {
		const { _pristineValue, defaultValue } = this;
		return isUndefined(_pristineValue) ? defaultValue : _pristineValue;
	}
	set pristineValue(newValue) {
		if (this.pristineValue !== newValue) {
			this._pristineValue = newValue;
			return true;
		}
		return false;
	}

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
			defaultValue,
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
		this._pristineValue = pristineValue;
		this.defaultValue = defaultValue;
		this.isChecked = isChecked;
		this.form = form;
		this._dataTypeFilter = dataTypeFilter;
		this._inputFilter = inputFilter;
		this._outputFilter = outputFilter;
		this.validation = new Validation(validation, required, dataTypeFilter);
	}

	@action
	try(fn) {
		try {
			return fn();
		}
		catch (error) {
			this.error = error;
		}
	}

	getOutputValue(value) {
		return this.try(() => {
			const { _outputFilter, _dataTypeFilter } = this;
			if (_outputFilter) value = _outputFilter(value);
			if (_dataTypeFilter) value = _dataTypeFilter(value);
			return value;
		});
	}

	getInputValue(value) {
		return this.try(() => {
			const { _inputFilter } = this;
			if (_inputFilter) value = _inputFilter(value);
			return value;
		});
	}

	getValue() {
		return this.getOutputValue(this.value);
	}

	@action
	setValue(value) {
		this.value = this.getInputValue(value);
		this.dirty();
	}

	@action
	touch(isTouched = true) {
		this.isTouched = isTouched;
	}

	@action
	dirty() {
		this.try(() => {
			this.validation.exec(this.value);
			this.touch();
			this.error = null;
		});
	}

	submit = (...args) => this.form.submit(...args);
	reset = (...args) => this.form.reset(...args);
	clear = (...args) => this.form.clear(...args);
}
