const requests = require('superagent');

const BASE_URL = 'https://pushcrew.com/api/v1';
const API_HEADERS = {
  'Authorization': `key=${process.env.PUSHCREW_KEY}`
}

const createSegment = async ({ data }) => {
  try {
    const res = await requests.post(`${BASE_URL}/segments`)
      .set(API_HEADERS)
      .type('form')
      .send(data.segment)
    return res;
  } catch (err) {
    console.log('err', err);
    return 'error occured';
  }
}

const addUserToSegment = async ({ data }) => {
  const { segment_id, user_id } = data;
  await requests.post(`${BASE_URL}/segments/${segment_id}/subscribers`)
  .set(API_HEADERS)
  .send({
    subscriber_list: [ user_id ]
  })
}

const scheduleNotifForAll = async ({ data }) => {
  try {
    const res = await requests.post(`${BASE_URL}/send/all`)
      .set(API_HEADERS)
      .type('form')
      .send(data.notif)
    return res;
  } catch (err) {
    console.log('err', err);
    return 'error occured';
  }
}

const scheduleNotifForSegment = async ({ data }) => {
  const { segment_id, notif } = data;
  try {
    const res = await requests.post(`${BASE_URL}/send/segment/${segment_id}`)
      .set(API_HEADERS)
      .type('form')
      .send(notif)
    return res;
  } catch (err) {
    console.log('err', err);
    return
  }
}

const deleteSegment = async ({ data }) => {
  const { segment_id } = data;
  try {
    const res = await requests.delete(`${BASE_URL}/segments/${segment_id}`)
      .set(API_HEADERS)
      .type('form')
      .send()
    return res;
  } catch (err) {
    console.log('err', err);
    return
  }
}

module.exports = {
  createSegment,
  addUserToSegment,
  scheduleNotifForAll,
  scheduleNotifForSegment
}
