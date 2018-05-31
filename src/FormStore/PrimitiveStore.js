import { observable, computed, action } from 'mobx';
import { createFormatDataTypeFunc } from '../DataTypes';
import Validation from '../Validation';
import {
	isEmpty,
	isArray,
	isUndefined,
	isPlainObject,
	filtersFlow,
} from '../utils';

export default class PrimitiveStore {
	// the real pristine value, provided by setting form value
	@observable _pristineValue;

	// the real current value, provided by form value or user typing
	@observable _value;

	@observable isChecked = true;
	@observable isTouched = false;
	@observable error = null;

	@computed
	get pristineValue() {
		if (this._isPristineValueEmpty) return this.getDefaultStoreValue();
		return this._pristineValue;
	}
	set pristineValue(value) {
		this._pristineValue = value;
		return true;
	}

	@computed
	get value() {
		if (this._isCurrentValueEmpty) return this.getDefaultStoreValue();
		return this._value;
	}
	set value(value) {
		this._value = value;
		return true;
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

	@computed
	get _isPristineValueEmpty() {
		return isEmpty(this._pristineValue);
	}

	@computed
	get _isCurrentValueEmpty() {
		return isEmpty(this._value);
	}

	constructor(pristineValue, options = {}) {
		const {
			key,
			defaultValue,
			isChecked = true,
			form = this,
			dataType,
			inputFilter,
			outputFilter,
			enforceSubmit,
		} = options;
		const dataTypeFilter = dataType && createFormatDataTypeFunc(dataType);
		this.key = key;
		this.form = form;
		this.defaultValue = defaultValue;
		this.isChecked = isChecked;
		this._dataTypeFilter = dataTypeFilter;
		this._inputFilter = inputFilter;
		this._outputFilter = outputFilter;
		this.validation = new Validation({
			dataTypeFilter,
			...options,
		});
		this._enforceSubmit = enforceSubmit;

		const intialValue = this.getInputValue(pristineValue);

		this._pristineValue = intialValue;
		this._value = intialValue;
	}

	getDefaultStoreValue() {
		return '';
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

	_ensureDefaultValue = (value) => {
		const { defaultValue } = this;
		if (!isUndefined(defaultValue) && isEmpty(value)) {
			return defaultValue;
		}
		return value;
	};

	getOutputValue(value) {
		return this.try(() => {
			const { _outputFilter, _dataTypeFilter, _ensureDefaultValue } = this;
			return filtersFlow(
				[_outputFilter, _dataTypeFilter, _ensureDefaultValue],
				value,
			);
		});
	}

	getInputValue(value) {
		return this.try(() => {
			const { _inputFilter, _ensureDefaultValue } = this;
			return filtersFlow([_inputFilter, _ensureDefaultValue], value);
		});
	}

	@action
	applySettingValue(newValue, type) {
		this[type] = newValue;
	}

	getValue() {
		const value = this.getOutputValue(this.value);
		return this.shouldIgnore(value) ? undefined : value;
	}

	@action
	setValue(value) {
		this.applySettingValue(value, 'value', 'setValue');
		this.dirty();
	}

	@action
	setPristineValue(value) {
		const finalValue = this.getInputValue(value);
		this.applySettingValue(finalValue, 'pristineValue', 'setPristineValue');
		this.applySettingValue(finalValue, 'value', 'setValue');
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

	shouldIgnore(value) {
		// console.log(
		// 	this.key,
		// 	this._isPristineValueEmpty,
		// 	this._pristineValue,
		// 	value,
		// );

		if (this._enforceSubmit || !this._isPristineValueEmpty) return false;
		if (isArray(value)) return !value.length;
		if (isPlainObject(value)) return !Object.keys(value).length;
		return isEmpty(value);
	}

	submit = (...args) => this.form.submit(...args);
	reset = (...args) => this.form.reset(...args);
	clear = (...args) => this.form.clear(...args);
}
