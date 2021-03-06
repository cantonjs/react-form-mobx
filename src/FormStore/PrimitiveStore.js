import { createFormatFunc } from '../FormatTypes';
import Validation from '../Validation';
import {
	observable,
	computed,
	action,
	runInAction,
	isObservableArray,
} from 'mobx';
import {
	isEmpty,
	isArray,
	isNativeArray,
	isPlainObject,
	clone,
	filtersFlow,
} from '../utils';

class Actual {
	@observable pristineValue;
	@observable value;
	@observable sourceValue;

	@observable errorMessage = '';

	/**
	 * checked status
	 *
	 * `-1`: user unchecked, should be `false` as usual
	 * `0` : default status, should be `undefined` as usual
	 * `1` : user checked, should be `true` as usual
	 */
	@observable checkedStatus = 0;

	setInitialValue(initialValue) {
		this.pristineValue = initialValue;
		this.sourceValue = initialValue;
		this.value = initialValue;
	}
}

export default class PrimitiveStore {
	@observable isTouched = false;

	@computed
	get pristineValue() {
		const { _actual: { pristineValue }, isPristineValueEmpty } = this;
		return isPristineValueEmpty ? this.getDefaultStoreValue() : pristineValue;
	}
	set pristineValue(value) {
		const finalValue = this.getInputValue(value);
		this._actual.checkedStatus = 0;
		this._actual.pristineValue = finalValue;
		this.sourceValue = finalValue;
		if (this.applySetPristineValue) this.applySetPristineValue(finalValue);
		this._actual.value = finalValue;
		if (this.applySetValue) this.applySetValue(this.value);
		this.validate();
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
		const value = this.applyGetValue();
		if (isObservableArray(value) && !isNativeArray(value)) return value.slice();
		return value;
	}
	set value(value) {
		this._actual.value = value;
		if (this.applySetValue) this.applySetValue(value);
		return true;
	}

	@computed
	get errorMessage() {
		const { errorMessage } = this._actual;
		const childErrorMessage =
			this.applyGetErrorMessage && this.applyGetErrorMessage();
		if (errorMessage) return errorMessage;
		return childErrorMessage || '';
	}
	set errorMessage(errorMessage) {
		this._actual.errorMessage = errorMessage;
		return true;
	}

	@computed
	get isChecked() {
		if (!this._checkable) return true;
		const {
			_options,
			parentStore,
			key,
			value,
			_actual: { checkedStatus },
		} = this;
		const shouldChecked = parentStore.shouldCheck(key, value);
		if (checkedStatus) return checkedStatus > 0;
		if (parentStore.hasKey(key)) return shouldChecked;
		return _options.hasOwnProperty('defaultChecked') ?
			_options.defaultChecked :
			shouldChecked;
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
			checkable,
			isRadio,
			form = this,
			preFormat,
			format,
			formatFunc,
			inputFilter,
			outputFilter,
			withEmpty,
		} = options;
		const formatFilter = formatFunc || (format && createFormatFunc(format));
		this.key = key;
		this.form = form;
		this.parentStore = parentStore;
		this._options = options;
		this.isRadio = isRadio;
		this.bus = {};
		this._actual = new Actual();
		this._checkable = checkable;
		this._preFormatFilter = preFormat;
		this._formatFilter = formatFilter;
		this._inputFilter = inputFilter;
		this._outputFilter = outputFilter;
		this._validation = new Validation({ formatFilter, ...options });
		this._withEmpty = withEmpty;
		const initialValue = this.getInputValue(pristineValue);
		this._actual.setInitialValue(initialValue);
	}

	getDefaultStoreValue() {
		return this._options.hasOwnProperty('defaultValue') ?
			this._options.defaultValue :
			'';
	}

	_try(fn) {
		try {
			return runInAction(fn);
		}
		catch (error) {
			if (this.parentStore) {
				const { value } = this._actual;
				const { key } = this;
				this.parentStore.setReason({ key, value });
			}
			this.errorMessage = error.message || 'Invalid';
		}
	}

	_defaultValueFilter = (value) => {
		const { _options } = this;
		if (_options.hasOwnProperty('defaultValue') && isEmpty(value)) {
			return _options.defaultValue;
		}
		return value;
	};

	getOutputValue(value) {
		return this._try(() => {
			const {
				pristineValue,
				_outputFilter,
				_preFormatFilter,
				_formatFilter,
				_defaultValueFilter,
			} = this;
			return filtersFlow(
				[_outputFilter, _preFormatFilter, _formatFilter, _defaultValueFilter],
				value,
				{ pristineValue },
			);
		});
	}

	getInputValue(value) {
		return this._try(() => {
			const { _inputFilter, _defaultValueFilter } = this;
			return filtersFlow([_inputFilter, _defaultValueFilter], value);
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
	touch(isTouched = true) {
		this.isTouched = isTouched;
	}

	validate() {
		if (!this.errorMessage) {
			this._try(() => {
				this._validation.exec(this.value);
				this.errorMessage = '';
			});
		}
	}

	@action
	emitChange() {
		this._try(() => {
			this.isTouched = true;
			this._validation.exec(this.value);
			this.errorMessage = '';
			this.parentStore.change(this);
		});
	}

	shouldIgnore(value) {
		const enforce = this._withEmpty;
		if (enforce === true || (enforce !== false && !this.isPristineValueEmpty)) {
			return false;
		}
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
