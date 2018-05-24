import React, { Component } from 'react';
import { Form, Input } from '../src';

export default class App extends Component {
	formData = {
		hello: 'world',
		name: 'cap32',
	};

	componentDidMount() {
		setTimeout(() => {
			console.log('this.formData', this.formData);
		}, 3000);
	}

	render() {
		return (
			<Form value={this.formData}>
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
