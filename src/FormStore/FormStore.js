import { action } from 'mobx';
import { isFunction, createId } from '../utils';
import PrimitiveStore from './PrimitiveStore';
import ObjectStore from './ObjectStore';
import ArrayStore from './ArrayStore';

export default class FormStore extends ObjectStore {
	constructor(pristineValue, options) {
		super(pristineValue, {
			...options,
			key: '<FORM>',
		});

		const { submit, clear, reset, change } = options;
		this.bus = {
			...this.bus,
			submit,
			change,
			clear,
			reset,
		};
	}

	@action
	createChildren(parentStore, key, value, options) {
		const { isArray, isObject, isRadio } = options;

		if (isRadio) {
			let store = parentStore.getChildren(key);
			if (!store) {
				store = parentStore.attach(key, {
					isArray: true,
					isObject: true,
					isRadioGroup: true,
					parentStore,
					inputFilter: (val) => [val],
					outputFilter: (val) => val[0],
					onChange: ({ key }) => store.checkKey(key),
				});
			}

			return store.attach(createId(key), {
				...options,
				isRadio: false,
			});
		}

		const Store = (function () {
			if (isArray) return ArrayStore;
			if (isObject) return ObjectStore;
			return PrimitiveStore;
		})();

		const { checkable, value: propValue } = options;
		const finalPristineValue = checkable ? propValue : value;
		const store = new Store(finalPristineValue, {
			...options,
			key,
			form: this,
			parentStore,
		});
		parentStore.setChildren(key, store);
		return store;
	}

	@action
	submit = () => {
		const { isValid } = this;
		const { submit } = this.bus;
		this.touch();

		/* istanbul ignore else */
		if (isFunction(submit)) {
			const value = this.getFormData();
			submit(value, { isValid });
			return isValid ? value : null;
		}
	};

	@action
	reset = () => {
		const { pristineValue } = this;
		this.pristineValue = pristineValue;
		return pristineValue;
	};

	@action
	clear = () => {
		const pristineValue = (this.pristineValue = {});
		this.touch();
		return pristineValue;
	};
}
