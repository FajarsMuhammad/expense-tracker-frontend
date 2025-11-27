import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function formatDate(date, format = 'MMM D, YYYY') {
  if (!date) return 'N/A'
  return dayjs(date).format(format)
}

export function formatDateTime(date, format = 'MMM D, YYYY h:mm A') {
  if (!date) return 'N/A'
  return dayjs(date).format(format)
}

export function formatRelativeTime(date) {
  if (!date) return 'N/A'
  return dayjs(date).fromNow()
}

export function isToday(date) {
  return dayjs(date).isSame(dayjs(), 'day')
}

export function isThisWeek(date) {
  return dayjs(date).isSame(dayjs(), 'week')
}

export default {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  isToday,
  isThisWeek,
}
