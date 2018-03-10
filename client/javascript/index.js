window.onload = function() {
  window._pcq = window._pcq || [];
  const EventTab = (function() {
    let currentTab = 1;
    const eventRowElem = document.querySelector('.eventRow');

    function getCurrentTab() {
      return currentTab;
    }

    function setCurrentTab(tab) {
      currentTab = tab;
    }

    function switchToTab(tab) {
      eventRowElem.querySelector(`li:nth-child(${tab}) a`).click();
    }

    function init() {
      $(eventRowElem).swipe({
        //Single swipe handler for left swipes
        swipeRight: function(event, direction, distance, duration, fingerCount) {
          currentTab > 1 && switchToTab(currentTab - 1);
        },
        swipeLeft: function(event, direction, distance, duration, fingerCount) {
          currentTab < 4 && switchToTab(currentTab + 1);
        }
      });
    }
    init();

    return {
      getCurrentTab,
      setCurrentTab,
      switchToTab
    }
  })()

  fetchEvents().then(events => {
    formatted_events = event_formatter(events);
    console.log('formatted_events', formatted_events);
    $('ul.tabs').tabs({
      onShow($elem) {
        const id = parseInt($elem.prop('id'));
        EventTab.setCurrentTab(id)
      }
    });
    // EventTab.switchToTab(2);
    const EventList = (function() {
      const eventListWrapperElem = document.querySelector('.event-list-wrapper');
      const eventListElems = eventListWrapperElem.querySelectorAll('.event-day-list');

      function renderEventList(listElem, events) {
        const eventTmplList = events.map((event, index) => {
          const itemElem = listElem.children[index];
          let { day: event_day, hour: event_hour, minute: event_minute } = event.schedule;
          if (event_minute < 10) {
            event_minute = '0' + event_minute;
          }
          const time = `${event_hour}.${event_minute}`;
          const time_period = event_hour < 12 ? 'am' : 'pm';

          return `<li class="collection-item avatar">
                  <div class="timing">
                    <span>${time} ${time_period}</span>
                  </div>
                  <a class="title" style="color: black;">${event.name}</a>
                  <p>${event.location || 'Courtyard'}
                  </p>
                  <span class="secondary-content">
                    <div class="switch">
                      <label>
                        <input class="event-action" data-index="${index}" type="checkbox">
                        <span class="lever z-depth-1"></span>
                      </label>
                    </div>
                  </span>
                </li>`;
        });

        listElem.insertAdjacentHTML('beforeend', eventTmplList.join(''))
      }

      function renderInEachTab() {
        eventListElems.forEach((elem, index) => {
          const ulElem = elem.querySelector('ul.collection');
          const eventsPerDay = formatted_events[index].events;
          renderEventList(ulElem, eventsPerDay);
        })
      }

      function clickHandler(e) {
        const elem = e.target;
        const isActionBtn = elem.classList.contains('event-action');
        if (isActionBtn) {
          const elemIndex = parseInt(elem.dataset.index);
          const dayNum = EventTab.getCurrentTab();
          const event = formatted_events[dayNum - 1].events[elemIndex];
          console.log('event', event);
          window._pcq.push(['addSubscriberToSegment', event.name, function(status) {
            console.log('status', status);
          }]);
        }
      }

      function init() {
        renderInEachTab();
        eventListWrapperElem.addEventListener('click', clickHandler);
      }

      init();

      return {}
    })()

  });
}
