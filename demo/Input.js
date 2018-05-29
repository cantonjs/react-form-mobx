import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Demon } from '../src';

export default class Input extends Component {
	static propTypes = {
		label: PropTypes.string.isRequired,
		display: PropTypes.oneOf(['inline-block', 'block']),
	};

	static defaultProps = {
		display: 'block',
	};

	render() {
		return (
			<Demon props={this.props}>
				{(
					{ display, label, ...other },
					{ isTouched, isValid, errorMessage },
				) => (
					<div style={{ margin: '1em', display }}>
						<label>
							<span>{label}</span>
							<input {...other} />
							{isValid || <span style={{ color: 'red' }}>{errorMessage}</span>}
							{isTouched && 'touched'}
						</label>
					</div>
				)}
			</Demon>
		);
	}
}
