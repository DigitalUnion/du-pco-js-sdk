const { DuPcoDataClient } = require('../dist');

const client = new DuPcoDataClient('cloud-test', 'aa', "yDpDEihpUsF_RyWsCES1H");

client.enableTestMode();

console.log(client.sdkVer)

client.call('idmap-query-all', `{"f":"mac,imei","k":"868862032205613","m":"0"}`)
  .then(response => {
    console.log(response)
  }).catch((error) => {
    console.trace(error)
  })
