import React from 'react';
import DemonButton from './DemonButton';

export default function Reset(props) {
	return (
		<DemonButton forwardedProps={props} type="reset">
			{(forwardedProps) => <button {...forwardedProps} type="button" />}
		</DemonButton>
	);
}
