import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Demon } from '../src';

export default class Checkbox extends Component {
	static propTypes = {
		label: PropTypes.string.isRequired,
		display: PropTypes.oneOf(['inline-block', 'block']),
	};

	static defaultProps = {
		display: 'block',
	};

	render() {
		return (
			<Demon props={this.props} checkable>
				{({ display, label, ...other }) => (
					<div style={{ margin: '1em', display }}>
						<label>
							<span>{label}</span>
							<input {...other} type="checkbox" />
						</label>
					</div>
				)}
			</Demon>
		);
	}
}
