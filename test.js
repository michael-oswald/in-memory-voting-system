import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10,          // Virtual Users (simultaneous users)
  duration: '30s', // Test duration
};

let counter = 0;

export default function () {
  counter++;

  let candidateIdStr = "";
  if (counter % 2 == 0) {
    candidateIdStr = "A"
  } else {
    candidateIdStr = "B"
  }

  let res = http.get('http://localhost:8080/vote/' + candidateIdStr); // Change URL to your API

  // Assertions
  check(res, {
    'Status is 200': (r) => r.status === 200,                    // Check HTTP status
    'Response time < 500ms': (r) => r.timings.duration < 500,     // Ensure response is fast
  });

  let getRes1 = http.get('http://localhost:8080/vote/' + candidateIdStr);
  check(getRes1, {
    'GET 1 - Status is 200': (r) => r.status === 200,
  });

  let payload = JSON.stringify({ citizenUUID: generateUUID(), candidateId: candidateIdStr });
  let params = { headers: { 'Content-Type': 'application/json' } };

  let postRes = http.put('http://localhost:8080/vote', payload, params);
  check(postRes, {
    'POST - Status is 201 or 200': (r) => r.status === 201 || r.status === 200,
    'POST - Response contains "successfully"': (r) => r.body.includes("successfully"),
  });

}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
