import React, {useState} from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalenderComponent.scss"

const CalendarComponent = () => {
	const [date, setDate] = useState(new Date());

	return (
				<div>
					<Calendar
							onChange={setDate}
							value={date}
							calendarType="gregory"
							prev2Label={null}
							next2Label={null}
					/>
				</div>
	);
};

export default CalendarComponent;