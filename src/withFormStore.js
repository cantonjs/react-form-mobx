import React, { Component } from 'react';
import { polyfill } from 'react-lifecycles-compat';
import Context from './Context';

export default function withFormStore() {
	return function createFormStoreComponent(WrappedComponent) {
		const { displayName, name } = WrappedComponent;

		@polyfill
		class WithFormStore extends Component {
			static displayName = `WithFormStore(${displayName || name})`;

			getValue() {
				return this.wrapped.inputStore.value;
			}

			setValue(value) {
				this.wrapped.inputStore.value = value;
			}

			getPristineValue() {
				return this.wrapped.inputStore.pristineValue;
			}

			setPristineValue(value) {
				this.wrapped.inputStore.pristineValue = value;
			}

			getValidState() {
				return this.wrapped.inputStore.getValidState();
			}

			submit() {
				return this.wrapped.inputStore.submit();
			}

			clear() {
				return this.wrapped.inputStore.clear();
			}

			reset() {
				return this.wrapped.inputStore.reset();
			}

			render() {
				return (
					<Context.Consumer>
						{(formStore) => (
							<WrappedComponent
								{...this.props}
								formStore={formStore}
								ref={(wrapped) => (this.wrapped = wrapped)}
							/>
						)}
					</Context.Consumer>
				);
			}
		}
		return WithFormStore;
	};
}
