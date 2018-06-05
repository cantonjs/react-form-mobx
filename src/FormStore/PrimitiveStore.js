import { observable, computed, action } from 'mobx';
import { createFormatFunc } from '../FormatTypes';
import Validation from '../Validation';
import {
	isEmpty,
	isArray,
	isUndefined,
	isPlainObject,
	clone,
	filtersFlow,
} from '../utils';

class Actual {
	@observable value;
	@observable sourceValue;
	@observable pristineValue;

	/**
	 * checked status
	 *
	 * `-1`: user unchecked, should be `false` as usual
	 * `0` : default status, should be `undefined` as usual
	 * `1` : user checked, should be `true` as usual
	 */
	@observable checkedStatus = 0;

	constructor(initialValue) {
		this.pristineValue = initialValue;
		this.sourceValue = initialValue;
		this.value = initialValue;
	}
}

export default class PrimitiveStore {
	@observable isTouched = false;
	@observable error = null;

	@computed
	get pristineValue() {
		const { actual: { pristineValue }, isPristineValueEmpty } = this;
		return isPristineValueEmpty ? this.getDefaultStoreValue() : pristineValue;
	}
	set pristineValue(value) {
		const finalValue = this.getInputValue(value);
		this.actual.pristineValue = finalValue;
		this.sourceValue = finalValue;
		this.value = finalValue;
		this.dirty();
		return true;
	}

	@computed
	get sourceValue() {
		const { actual: { sourceValue }, isSourceValueEmpty } = this;
		return isSourceValueEmpty ? this.getDefaultStoreValue() : sourceValue;
	}
	set sourceValue(value) {
		this.actual.sourceValue = clone(value);
		return true;
	}

	@computed
	get value() {
		return this.applyGetValue();
	}
	set value(value) {
		this.applySetValue(value);
		return true;
	}

	@computed
	get isChecked() {
		if (!this._checkable) return true;
		const {
			defaultChecked,
			parentStore,
			key,
			value,
			actual: { checkedStatus },
		} = this;
		const shouldChecked = parentStore.shouldCheck(key, value);
		if (checkedStatus) return checkedStatus > 0;
		if (parentStore.hasKey(key)) return shouldChecked;
		return isUndefined(defaultChecked) ? shouldChecked : defaultChecked;
	}
	set isChecked(checked) {
		if (!this._checkable) return true;
		this.actual.checkedStatus = checked ? 1 : -1;
		return true;
	}

	@computed
	get isPristineValueEmpty() {
		return isEmpty(this.actual.pristineValue);
	}

	@computed
	get isSourceValueEmpty() {
		return isEmpty(this.actual.sourceValue);
	}

	@computed
	get isValueEmpty() {
		return isEmpty(this.actual.value);
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
			parentStore,
			defaultValue,
			defaultChecked,
			checkable,
			isRadio,
			isRadiosGroup,
			form = this,
			format,
			inputFilter,
			outputFilter,
			enforceSubmit,
		} = options;
		const formatFilter = format && createFormatFunc(format);
		this.key = key;
		this.form = form;
		this.parentStore = parentStore;
		this.defaultValue = defaultValue;
		this.defaultChecked = defaultChecked;
		this.isRadio = isRadio;
		this.isRadiosGroup = isRadiosGroup;
		this._bus = {};
		this._checkable = checkable;
		this._formatFilter = formatFilter;
		this._inputFilter = inputFilter;
		this._outputFilter = outputFilter;
		this.validation = new Validation({ formatFilter, ...options });
		this._enforceSubmit = enforceSubmit;
		const initialValue = this.getInputValue(pristineValue);
		this.actual = new Actual(initialValue);
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
			const {
				_outputFilter,
				_formatFilter,
				_ensureDefaultValue,
				actual: { pristineValue },
			} = this;
			return filtersFlow(
				[_outputFilter, _formatFilter, _ensureDefaultValue],
				value,
				{ pristineValue },
			);
		});
	}

	getInputValue(value) {
		return this.try(() => {
			const { _inputFilter, _ensureDefaultValue } = this;
			return filtersFlow([_inputFilter, _ensureDefaultValue], value);
		});
	}

	applyGetValue() {
		const { isValueEmpty, actual: { value } } = this;
		return isValueEmpty ? this.getDefaultStoreValue() : value;
	}

	applySetValue(newValue) {
		this.actual.value = newValue;
	}

	getFormData() {
		const value = this.getOutputValue(this.value);
		return this.shouldIgnore(value) ? undefined : value;
	}

	@action
	setPristineValue(value) {
		const finalValue = this.getInputValue(value);
		// this.pristineValue = finalValue;
		this.actual.checkedStatus = 0;
		this.actual.pristineValue = finalValue;
		this.sourceValue = finalValue;
		this.value = finalValue;
		this.dirty();
	}

	hasKey() {
		return false;
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
		// 	this.isPristineValueEmpty,
		// 	this.pristineValue,
		// 	value,
		// );

		if (this._enforceSubmit || !this.isPristineValueEmpty) return false;
		if (isArray(value)) return !value.length;
		if (isPlainObject(value)) return !Object.keys(value).length;
		return isEmpty(value);
	}

	getValidState() {
		const { isValid, isInvalid, isTouched, errorMessage } = this;
		return { isValid, isInvalid, isTouched, errorMessage };
	}

	submit = (...args) => this.form.submit(...args);
	reset = (...args) => this.form.reset(...args);
	clear = (...args) => this.form.clear(...args);
}
