import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { createId as createUniqueId } from './utils';
import withFormStore from './withFormStore';
import Demon from './Demon';

@withFormStore()
@observer
class ItemGroup extends Component {
	static propTypes = {
		formStore: PropTypes.object.isRequired,
		children: PropTypes.func.isRequired,
		name: PropTypes.string.isRequired,
	};

	constructor(props) {
		super(props);

		const { formStore, name } = props;
		const { sourceValue: { length } } = formStore;
		const createId = () => createUniqueId(name);

		this.helper = {
			createId,
			push: () => formStore.push(createId()),
			remove: formStore.remove,
			removeBy: (id) => () => formStore.remove(id),
		};

		for (let i = 0; i < length; i++) {
			this.helper.push();
		}
	}

	render() {
		const { children, formStore } = this.props;
		return children(formStore.ids, this.helper);
	}
}

@observer
export default class ArrayOf extends Component {
	static propTypes = {
		children: PropTypes.func.isRequired,
		name: PropTypes.string.isRequired,
	};

	constructor(props) {
		super(props);
		const { children, ...forwardedProps } = props;
		this.forwardedProps = forwardedProps;
	}

	forwardedProps = {
		name: this.props.name,
	};

	render() {
		const { children } = this.props;
		return (
			<Demon forwardedProps={this.forwardedProps} isObject isArray>
				{() => <ItemGroup name={name}>{children}</ItemGroup>}
			</Demon>
		);
	}
}
