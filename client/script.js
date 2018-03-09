window._pcq = window._pcq || [];

function parallel(limit, callback) {
  let index = 0;
  return function() {
    index += 1;
    if(index == limit) {
      callback()
    }
  }
}

function fetchEvents() {
  return fetch('/api/events', {
    method: 'GET'
  }).then(res => res.json())
}

function callbackForAddToSegment(response) {
  if (response === true) {
    console.log('User got added to the segment successfully.');
  } else {
    alert('Operation Failed !');
  }
}

function renderEventList(listElem) {
  const eventTmplList = window.events.map((event, index) => {
    const itemElem = listElem.children[index];
    return `<li class="event-list-item">
      <span class="event-name">${event.name}</span>
      <button class="event-action" data-index="${index}">Remind</button>
    </li>`;
  });

  listElem.insertAdjacentHTML('beforeend', eventTmplList.join(''))
}

function eventListClickHandler(e) {
  const elem = e.target;
  const isActionBtn = elem.classList.contains('event-action');
  if(isActionBtn) {
    const elemIndex = parseInt(elem.dataset.index);
    const event = window.events[elemIndex];
    window._pcq.push(['addSubscriberToSegment', event.name, callbackForAddToSegment]);
  }
}

window.onload = function() {

  const eventListElem = document.querySelector('.event-list');

  eventListElem.addEventListener('click', eventListClickHandler);

  window._pcq.push(['APIReady', callbackOnAPIReady]);

  const event_parallel = parallel(2, function() {
    renderEventList(eventListElem);
  });

  function callbackOnAPIReady() {
    event_parallel();
  }

  fetchEvents().then(events => {
    window.events = events;
    event_parallel();
  });
}
