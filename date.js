const SECOND = 1000,
      MINUTE = 60 * SECOND,
      HOUR = 60 * MINUTE,
      DAY = 24 * HOUR;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const formatDate = date => `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
const formatTime = date => `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
const formatDateFull = date => formatDate(date) + " " + formatTime(date);
const formatDateShort = date => `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${formatTime(date)}`;

module.exports = {SECOND, MINUTE, HOUR, DAY, MONTHS, formatDateFull, formatDateShort};