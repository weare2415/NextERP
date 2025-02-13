import {useEffect, useState} from 'react';
import {getEmployeeById} from '../member/api/memberApi';

const UseEmployeeNames = (items, key = 'employeeId') => {
	const [employeeNames, setEmployeeNames] = useState({});

	useEffect(() => {
		if(!items) return;

		const normalizedItems = Array.isArray(items) ? items : [items];
		// console.log(normalizedItems,"normalizedItems");
		if (normalizedItems.length === 0) return;

		const fetchEmployeeNames = async () => {
			const employeeIds = [...new Set(normalizedItems.map(item => item[key]).filter(Boolean))];
			if (employeeIds.length === 0) return;

			const employeeData = {};
			await Promise.all(employeeIds.map(async (id) => {
				try {
					const employeeInfo = await getEmployeeById(id);
					employeeData[id] = employeeInfo.name;
					// console.log(employeeInfo);
				} catch (error) {
					console.error(`Error fetching employee with ID ${id}:`, error);
					employeeData[id] = "알 수 없음";
				}
			}));
			setEmployeeNames(employeeData);
		};
		fetchEmployeeNames();
	}, [items,key]);

	return employeeNames;
};

export default UseEmployeeNames;