import React from 'react';
import DemonButton from './DemonButton';

export default function Submit(props) {
	return (
		<DemonButton forwardedProps={props}>
			{(forwardedProps) => <button {...forwardedProps} type="button" />}
		</DemonButton>
	);
}
