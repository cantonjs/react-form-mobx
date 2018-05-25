import React, { Component } from 'react';
import { Form, Input } from '../src';

export default class App extends Component {
	state = {
		formData: {
			hello: 'world',
			name: 'cap32',
		},
	};

	handleSubmit = (formData) => {
		console.log('submit', formData);
		this.setState(() => ({ formData }));
	};

	render() {
		const { formData } = this.state;
		return (
			<Form value={formData} onSubmit={this.handleSubmit}>
				<div style={{ margin: '1em' }}>
					<label>
						<span>hello</span>
						<Input name="hello" />
					</label>
				</div>
				<div style={{ margin: '1em' }}>
					<label>
						<span>name</span>
						<Input name="name" />
					</label>
				</div>
			</Form>
		);
	}
}
