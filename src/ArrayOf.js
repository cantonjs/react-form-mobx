import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { createId as createUniqueId, isFunction } from './utils';
import withFormStore from './withFormStore';
import Demon from './Demon';

const childrenType = PropTypes.oneOfType([PropTypes.func, PropTypes.node])
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

		const { formStore, name, children } = props;
		const createId = () => createUniqueId(name);
		const length = isFunction(children) ?
			formStore.sourceValue.length :
			Children.count(children);

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
		const { children, formStore: { ids } } = this.props;
		if (isFunction(children)) return children(ids, this.helper);
		return Children.map(children, (child, index) =>
			cloneElement(child, { name: ids[index] }),
		);
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

	getValue() {
		return this.demon.getValue();
	}

	setValue(value) {
		this.demon.setValue(value);
	}

	getPristineValue() {
		return this.demon.getPristineValue();
	}

	setPristineValue(value) {
		this.demon.setPristineValue(value);
	}

	getValidState() {
		return this.demon.getValidState();
	}

	render() {
		const { children, name } = this.props;
		return (
			<Demon
				forwardedProps={this.forwardedProps}
				isObject
				isArray
				ref={(demon) => (this.demon = demon)}
			>
				{() => <ItemGroup name={name}>{children}</ItemGroup>}
			</Demon>
		);
	}
}
