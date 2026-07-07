import { Redirect, useParams } from 'react-router-dom';
<<<<<<< HEAD
import { TraceDetailV2URLProps } from 'types/api/trace/getTraceV2';
=======
import { TraceDetailV3URLProps } from 'types/api/trace/getTraceV3';
>>>>>>> upstream/main

// Legacy /trace-old/:id now redirects to the current /trace/:id view,
// preserving the query string and hash.
export default function TraceDetailOldRedirect(): JSX.Element {
<<<<<<< HEAD
	const { id } = useParams<TraceDetailV2URLProps>();
=======
	const { id } = useParams<TraceDetailV3URLProps>();
>>>>>>> upstream/main

	return (
		<Redirect
			to={{
				pathname: `/trace/${id}`,
				search: window.location.search,
				hash: window.location.hash,
			}}
		/>
	);
}
