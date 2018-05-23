import React, { Component } from 'react';
import { Form, Input } from '../src';

export default class App extends Component {
	render() {
		return (
			<Form>
				<span style={{ marginRight: '1em' }}>hello</span>
				<Input defaultValue="react-form-mobx" />
			</Form>
		);
	}
}
