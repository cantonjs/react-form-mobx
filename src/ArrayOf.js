import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import NestedProvider from './NestedProvider';
import withFormStore from './withFormStore';

@withFormStore()
@observer
class ArrayWrapper extends Component {
	static propTypes = {
		formStore: PropTypes.object.isRequired,
		children: PropTypes.func.isRequired,
		name: PropTypes.string.isRequired,
	};

	@observable ids = [];

	uniqueId = 0;

	constructor(props) {
		super(props);

		const { length } = props.formStore.value;
		for (let i = 0; i < length; i++) {
			this.helper.push();
		}
	}

	createId() {
		return `${this.props.name}[${this.uniqueId++}]`;
	}

	helper = {
		push: () => this.ids.push(this.helper.createId()),
		remove: (id) => {
			const index = this.ids.indexOf(id);
			if (index > -1) this.ids.splice(index, 1);
		},
		createId: () => `${this.props.name}[${this.uniqueId++}]`,
	};

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

	render() {
		const { children, ...other } = this.props;
		return (
			<NestedProvider {...other} array>
				<ArrayWrapper name={other.name}>{children}</ArrayWrapper>
			</NestedProvider>
		);
	}
}
