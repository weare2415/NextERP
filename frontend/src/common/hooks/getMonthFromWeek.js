export const getMonthFromWeek = (year, week) => {
	const firstDay = new Date(year, 0, 1); // 해당 연도의 1월 1일
	const firstWeekDay = firstDay.getDay(); // 1월 1일의 요일 (0: 일요일, 1: 월요일, ...)

	// 첫 주의 첫날이 월요일이 아니면 보정
	const offset = firstWeekDay <= 4 ? 0 : 7;
	const firstMonday = new Date(year, 0, 1 + (7 - firstWeekDay) + offset);

	// 주차 기반 해당 날짜 계산
	const targetDate = new Date(firstMonday.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);

	// YYYY-MM 형식 반환
	return `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
};


// ✅ 월별 데이터를 주차별 데이터로 변환하는 함수
export const getWeekFromMonth = (month) => {
	const [year, monthNum] = month.split('-').map(Number);
	const firstDay = new Date(year, monthNum - 1, 1);
	const lastDay = new Date(year, monthNum, 0);

	const weeks = [];
	let weekCount = 1;
	for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 7)) {
		weeks.push(`${year}-W${weekCount}`);
		weekCount++;
	}

	return weeks;
};