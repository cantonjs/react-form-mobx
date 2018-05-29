import { action } from 'mobx';
import { isFunction, isArray as isArrayType, createId } from '../utils';
import PrimitiveStore from './PrimitiveStore';
import ObjectStore from './ObjectStore';
import ArrayStore from './ArrayStore';

export default class FormStore extends ObjectStore {
	constructor(pristineValue, options = {}) {
		super(pristineValue, options);

		const { submit } = options;
		this._bus = { submit };
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
		parentStore.setChildren(key, store);
		return store;
	}

	@action
	submit = (options = {}) => {
		const { isValid } = this;
		const { submit } = this._bus;
		this.touch();
		if (isFunction(submit)) {
			const { value } = this;
			submit(value, { isValid });
			return isValid || options.force ? value : null;
		}
	};
}
