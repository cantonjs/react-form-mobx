import React from 'react';
import PropTypes from 'prop-types';

export default function Console(props) {
	const { data, ...other } = props;
	return (
		<pre {...other}>
			<code>{JSON.stringify(data, null, 2)}</code>
		</pre>
	);
}

Console.propTypes = {
	data: PropTypes.object.isRequired,
};
