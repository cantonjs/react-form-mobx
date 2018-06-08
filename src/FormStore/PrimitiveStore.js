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
	@observable pristineValue;
	@observable value;
	@observable sourceValue;

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
	@observable errorMessage = '';

	@computed
	get pristineValue() {
		const { _actual: { pristineValue }, isPristineValueEmpty } = this;
		return isPristineValueEmpty ? this.getDefaultStoreValue() : pristineValue;
	}
	set pristineValue(value) {
		this._actual.pristineValue = value;
		return true;
	}

	@computed
	get sourceValue() {
		const { _actual: { sourceValue }, isSourceValueEmpty } = this;
		return isSourceValueEmpty ? this.getDefaultStoreValue() : sourceValue;
	}
	set sourceValue(value) {
		this._actual.sourceValue = clone(value);
		return true;
	}

	@computed
	get value() {
		return this.applyGetValue();
	}
	set value(value) {
		this._actual.value = value;
		if (this.applySetValue) this.applySetValue(value);
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
			_actual: { checkedStatus },
		} = this;
		const shouldChecked = parentStore.shouldCheck(key, value);
		if (checkedStatus) return checkedStatus > 0;
		if (parentStore.hasKey(key)) return shouldChecked;
		return isUndefined(defaultChecked) ? shouldChecked : defaultChecked;
	}
	set isChecked(checked) {
		/* istanbul ignore next */
		if (!this._checkable) return true;

		this._actual.checkedStatus = checked ? 1 : -1;
		return true;
	}

	@computed
	get isPristineValueEmpty() {
		return isEmpty(this._actual.pristineValue);
	}

	@computed
	get isSourceValueEmpty() {
		return isEmpty(this._actual.sourceValue);
	}

	@computed
	get isValueEmpty() {
		return isEmpty(this._actual.value);
	}

	@computed
	get isValid() {
		return !this.errorMessage;
	}

	@computed
	get isInvalid() {
		return !this.isValid;
	}

	constructor(pristineValue, options) {
		const {
			key,
			parentStore,
			defaultValue,
			defaultChecked,
			checkable,
			isRadio,
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
		this.bus = {};
		this._checkable = checkable;
		this._formatFilter = formatFilter;
		this._inputFilter = inputFilter;
		this._outputFilter = outputFilter;
		this.validation = new Validation({ formatFilter, ...options });
		this._enforceSubmit = enforceSubmit;
		const initialValue = this.getInputValue(pristineValue);
		this._actual = new Actual(initialValue);
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
			this.errorMessage = error.message || 'Invalid';
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
				pristineValue,
				_outputFilter,
				_formatFilter,
				_ensureDefaultValue,
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
		const { isValueEmpty, _actual: { value } } = this;
		return isValueEmpty ? this.getDefaultStoreValue() : value;
	}

	getFormData() {
		const value = this.getOutputValue(this.value);
		return this.shouldIgnore(value) ? undefined : value;
	}

	@action
	setPristineValue(value) {
		const finalValue = this.getInputValue(value);
		this._actual.checkedStatus = 0;
		this.pristineValue = finalValue;
		this.sourceValue = finalValue;
		this.value = finalValue;
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
			this.errorMessage = '';
		});
	}

	shouldIgnore(value) {
		if (this._enforceSubmit || !this.isPristineValueEmpty) return false;
		if (isArray(value)) return !value.length;
		if (isPlainObject(value)) return !Object.keys(value).length;
		return isEmpty(value);
	}

	getValidState() {
		const { isValid, isInvalid, isTouched, errorMessage } = this;
		return { isValid, isInvalid, isTouched, errorMessage };
	}
}
