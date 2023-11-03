import { useState } from "react";

const CarouselDays = () => {
  const [data, setData] = useState([]);

  return (
    <div className="carouselDays">
      {data.map((item) => {
        const {day, weekDay, month} = item;
        return (
          <div className="item">
            <div className="info">
              <span className="weekDay">{weekDay}</span>
              <span className="day">{day}</span>
              <span className="month">{month}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CarouselDays;