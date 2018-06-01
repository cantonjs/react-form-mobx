import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { isFunction, createId as createUniqueId } from './utils';
import withFormStore from './withFormStore';
import Demon from './Demon';

const childrenType = PropTypes.oneOfType([PropTypes.node, PropTypes.func])
	.isRequired;

@withFormStore()
@observer
class ItemGroup extends Component {
	static propTypes = {
		formStore: PropTypes.object.isRequired,
		children: childrenType,
		name: PropTypes.string.isRequired,
	};

	constructor(props) {
		super(props);

		const { formStore, name } = props;
		const { pristineValue: { length } } = formStore;
		const createId = () => createUniqueId(name);

		this.helper = {
			createId,
			push: () => formStore.push(createId()),
			remove: formStore.remove,
			removeBy: (id) => () => formStore.remove(id),
			includes: formStore.includes,
		};

		for (let i = 0; i < length; i++) {
			this.helper.push();
		}
	}

	render() {
		const { children, formStore } = this.props;
		return isFunction(children) ?
			children(formStore.ids, this.helper) :
			children;
	}
}

@observer
export default class ArrayOf extends Component {
	static propTypes = {
		children: childrenType,
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
