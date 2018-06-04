import { action } from 'mobx';
import {
	isFunction,
	isArray as isArrayType,
	createId,
	isEmpty,
} from '../utils';
import PrimitiveStore from './PrimitiveStore';
import ObjectStore from './ObjectStore';
import ArrayStore from './ArrayStore';

export default class FormStore extends ObjectStore {
	constructor(pristineValue, options = {}) {
		super(pristineValue, {
			...options,
			key: '<FORM>',
		});

		const { submit, clear, reset, change } = options;
		this._bus = {
			...this.bus,
			submit,
			change,
			clear,
			reset,
		};
	}

	@action
	createChildren(parentStore, key, value, options = {}) {
		const { isArray, isObject } = options;

		// enforce array type if value is array
		if (!isArray && isArrayType(value)) {
			let store = parentStore.getChildren(key);
			if (!store) {
				store = parentStore.attach(key, { isArray: true });
			}
			return store.attach(createId(key), {
				...options,
				isChecked: ~value.indexOf(options.value),
			});
		}

		const Store = (function () {
			if (isArray) return ArrayStore;
			if (isObject) return ObjectStore;
			return PrimitiveStore;
		})();
		const store = new Store(value, {
			...options,
			key,
			form: this,
		});
		const { checkable, value: propValue } = options;
		if (checkable) {
			store.isChecked = parentStore.matchValue(
				key,
				isEmpty(propValue) ? true : propValue,
			);
		}
		else {
			store.isChecked = true;
		}
		parentStore.setChildren(key, store);
		return store;
	}

	@action
	submit = (options = {}) => {
		const { isValid } = this;
		const { submit } = this._bus;
		this.touch();
		if (isFunction(submit)) {
			const value = this.getFormData();
			submit(value, { isValid });
			return isValid || options.force ? value : null;
		}
	};

	@action
	reset = () => {
		this.setPristineValue(this.actual.pristineValue);
	};

	@action
	clear = () => {
		this.setPristineValue({});
	};
}
