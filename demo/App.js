import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, ObjectOf } from '../src';

const InputItem = function InputItem({ label, name }) {
	return (
		<div style={{ margin: '1em' }}>
			<label>
				<span>{label}</span>
				<Input name={name} />
			</label>
		</div>
	);
};

InputItem.propTypes = {
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
};

export default class App extends Component {
	state = {
		name: 'Luke Skywalker',
		height: 172,
		starships: ['X-wing', 'Imperial shuttle'],
		colors: {
			hair: 'blond',
			skin: 'fair',
		},
	};

	componentDidMount() {
		setTimeout(() => {
			this.setState(() => ({
				height: 200,
			}));
		}, 2000);
	}

	handleSubmit = (formData) => {
		console.log('submit', formData);
		this.setState(() => formData);
	};

	render() {
		return (
			<Form value={this.state} onSubmit={this.handleSubmit}>
				<InputItem label="name" name="name" />
				<InputItem label="height" name="height" />
				<ObjectOf name="colors">
					<InputItem label="hair color" name="hair" />
					<InputItem label="skin color" name="skin" />
				</ObjectOf>
			</Form>
		);
	}
}
