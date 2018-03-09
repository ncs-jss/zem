const mongoose = require('mongoose');


const Event = mongoose.model('Event');
const pushcrew = require('./services/pushcrew');
const { getTimeInGMT, time_formatter } = require('./utils');

const authMw = (req, res, done) => {
  if(req.query.token === process.env.AUTH_TOKEN) {
    done()
  }
  else {
    res.send({
      status: 'FAILURE',
      message: 'Not Authorized'
    })
  }
}

module.exports = app => {
  app.get('/api/events', async (req, res) => {
    const events = await Event.find({});
    res.send(events);
  });

  app.get('/api/events/day/:number', async (req, res) => {
    const numOfDay = parseInt(req.params.number);
    const events = await Event.find({
      schedule: {
        day: numOfDay
      }
    });
    res.send(events);
  });

  app.post('/api/events', authMw, async (req, res) => {
    const event = req.body;
    const createSegmentData = {
      segment: {
        name: event.name
      }
    }
    let segment_id = '';
    try {
      const segmentRes = await pushcrew.createSegment({ data: createSegmentData });
      segment_id = segmentRes.body.segment_id;
      Object.assign(event, {
        segment_id
      })
      const e = new Event(event);
      const { day, hour, minute } = event.schedule;

      const { gmt_hour, gmt_minute } = getTimeInGMT({ hour, minute });
      const time = time_formatter({ hour: gmt_hour, minute: gmt_minute });

      const scheduleNotifForSegmentData = {
        segment_id,
        notif: {
          title: `${event.name} is starting soon !!`,
          message: `Hi There !! ${event.name} is starting soon. See you there !!`,
          url: 'http://zealicon.in',
          schedule: 1,
          // date: `2018-03-${13 + day}`, // for prod
          date: `2018-03-10`, // for dev
          time
        }
      }
      const notifRes = await pushcrew.scheduleNotifForSegment({ data: scheduleNotifForSegmentData })
      await e.save();
      res.send(e);
    } catch(err) {
      console.log('err', err);
      await pushcrew.deleteSegment({ data: { segment_id }})
      res.send({
        status: 'FAILURE',
        message: 'error occurred'
      });
    }
  })
 
  /*
  app.get('/api/setReminder', async (req, res) => {
    const data = {
      notif: {
        title: 'Scheduled sucker Notif',
        message: 'message',
        url: 'http://hackncs.com',
        schedule: 1,
        date: '2018-03-09',
        time: '06:43'
      }
    }
    try {
      const notifRes = await pushcrew.scheduleNotifForAll({ data })
      res.send(notifRes);
    } catch(err) {
      console.log('err', err);
      res.send({
        status: 'FAILURE',
        message: 'error occurred'
      });
    }
  });
  */
};
