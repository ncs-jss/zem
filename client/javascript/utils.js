function fetchEvents() {
  return fetch('/api/events/', {
    method: 'GET'
  }).then(res => res.json())
}

function event_formatter(events) {
  const sorted_events = events.sort((a, b) => {
    const { day: a_day, hour: a_hour, minute: a_minute } = a.schedule;
    const { day: b_day, hour: b_hour, minute: b_minute } = b.schedule;
    const d = (a_day - b_day) * 10000 + (a_hour - b_hour) * 100 + (a_minute - b_minute);
    return d;
  });
  const formatted_events = [
    { events: [] },
    { events: [] },
    { events: [] },
    { events: [] }
  ];
  events.forEach(event => {
    formatted_events[event.schedule.day - 1].events.push(event);
  })
  return formatted_events;
}
