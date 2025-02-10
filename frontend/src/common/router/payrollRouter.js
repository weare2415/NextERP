import React, {lazy, Suspense} from 'react';

const PayrollList = lazy(() => import("../../payroll/pages/PayrollListPage"));

const PayrollRouter = () => {
	return [
		{
			path: "",
			element: (
					<Suspense fallback={<div>Loading...</div>}>
						<PayrollList />
					</Suspense>
			),
		},
	]
};

export default PayrollRouter;