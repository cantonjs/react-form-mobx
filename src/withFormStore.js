import React, { Component } from 'react';
import { polyfill } from 'react-lifecycles-compat';
import Context from './Context';

export default function withFormStore() {
	return function createFormStoreComponent(WrappedComponent) {
		const { displayName, name } = WrappedComponent;

		@polyfill
		class WithFormStore extends Component {
			static displayName = `WithFormStore(${displayName || name})`;

			render() {
				return (
					<Context.Consumer>
						{(formStore) => (
							<WrappedComponent {...this.props} formStore={formStore} />
						)}
					</Context.Consumer>
				);
			}
		}
		return WithFormStore;
	};
}
