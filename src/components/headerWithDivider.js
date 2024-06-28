import { Grid } from '@material-ui/core';
import React from 'react';
const headerWithDivider = props => {
	return (
		<React.Fragment key={props.title}>
			<Grid
				container
				direction="row"
				alignItems="center"
				justifyContent="center"
				style={{ width: '100%', height: '8%', display: 'flex', paddingBottom: '23px' }}
			>
				<Grid style={{ color: '#3a546b', marginRight: '12px', display: 'flex' }}>{props.title}</Grid>
				<Grid
					style={{
						marginRight: '30px',
						marginBottom: '10px',
						height: '1px',
						flex: '1 0 0',
						backgroundColor: '#CECAC8'
					}}
				></Grid>
				{props.endContent ? props.endContent : []}
			</Grid>
		</React.Fragment>
	);
};
export default headerWithDivider;
