import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
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

	@observable ids = [];

	uniqueId = 0;

	constructor(props) {
		super(props);

		const { length } = props.formStore.pristineValue;
		props.formStore.children.observe(
			(ev) => this.handleChildrenChange(ev),
			true,
		);
		for (let i = 0; i < length; i++) {
			this.helper.push();
		}
	}

	helper = {
		push: () => this.ids.push(this.helper.createId()),
		remove: (id) => {
			const index = this.ids.indexOf(id);
			if (index > -1) this.ids.splice(index, 1);
		},
		createId: () => `${this.props.name}[${this.uniqueId++}]`,
		includes: (id) => ~this.ids.indexOf(id),
	};

	handleChildrenChange(ev) {
		if (ev.removedCount) {
			ev.removed.forEach((store) => {
				this.helper.remove(store.key);
			});
		}
	}

	render() {
		const { children } = this.props;
		return children(this.ids, this.helper);
	}
}

@observer
export default class ArrayOf extends Component {
	static propTypes = {
		children: PropTypes.func.isRequired,
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
