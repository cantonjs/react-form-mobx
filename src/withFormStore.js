import React, { Component } from 'react';
import { polyfill } from 'react-lifecycles-compat';
import Context from './Context';

export default function withFormStore() {
	return function createFormStoreComponent(WrappedComponent) {
		@polyfill
		class WithFormStore extends Component {
			static displayName = 'WithFormStore(Demon)';

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
