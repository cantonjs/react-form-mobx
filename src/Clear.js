import React from 'react';
import DemonButton from './DemonButton';

export default function Clear(props) {
	return (
		<DemonButton forwardedProps={props} type="clear">
			{(forwardedProps) => <button {...forwardedProps} type="button" />}
		</DemonButton>
	);
}
