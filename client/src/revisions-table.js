import _ from 'lodash'
import React from 'react'

import Spacer from './spacer'
import Table from './table'

const RevisionsTable = ({ revisionCounts, type } = {}) => {
	if (!revisionCounts) {
		return <span>Loading...</span>
	}

	const totalPrs = _.values(revisionCounts).reduce(
		(total, { count }) => total + count,
		0
	)
	const totalRevisions = _.values(revisionCounts).reduce(
		(total, { numRevisions }) => total + numRevisions,
		0
	)
	const overallAvgRevisions = totalRevisions / totalPrs
	return (
		<div>
			<Spacer height="10px" />
			<div>
				Overall avg revisions: {overallAvgRevisions.toFixed(2)}
			</div>
			<Spacer height="10px" />
			<Table
				data={revisionCounts}
				columns={[
					{
						header: type,
						renderCell: ({ _id }) => _id,
						flex: '0 1 150px',
					},
					{
						header: '#',
						renderCell: ({ count }) => count,
						flex: '0 0 45px',
					},
					{
						header: 'Avg Revisions',
						renderCell: ({ count, numRevisions }) =>
							(numRevisions / count).toFixed(2),
						flex: '1 0 50px',
					},
				]}
			/>
		</div>
	)
}

export default RevisionsTable
