import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { isFunction, createId } from './utils';
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

	@observable ids = [];

	constructor(props) {
		super(props);

		const { length } = props.formStore.pristineValue;
		this.disposer = props.formStore.children.observe((ev) =>
			this.handleChildrenChange(ev),
		);
		for (let i = 0; i < length; i++) {
			this.helper.push();
		}
	}

	componentWillUnmount() {
		this.disposer();
	}

	helper = {
		push: () => this.ids.push(this.helper.createId()),
		remove: (id) => {
			const index = this.ids.indexOf(id);
			if (index > -1) this.ids.splice(index, 1);
		},
		createId: () => createId(this.props.name),
		includes: (id) => ~this.ids.indexOf(id),
	};

	handleChildrenChange(ev) {
		if (ev.removedCount) {
			ev.removed.forEach(({ key }) => {
				this.helper.remove(key);
			});
		}
		if (ev.addedCount) {
			ev.added.forEach(({ key }) => {
				const { ids, helper } = this;
				if (!helper.includes(key)) ids.push(key);
			});
		}
	}

	render() {
		const { children } = this.props;
		return isFunction(children) ? children(this.ids, this.helper) : children;
	}
}

@observer
export default class ArrayOf extends Component {
	static propTypes = {
		children: childrenType,
		name: PropTypes.string.isRequired,
	};

	forwardedProps = {
		name: this.props.name,
	};

	render() {
		const { children, name, ...other } = this.props;
		return (
			<Demon {...other} props={this.forwardedProps} isObject isArray>
				{() => <ItemGroup name={name}>{children}</ItemGroup>}
			</Demon>
		);
	}
}
