# du-pco-js-sdk

数字联盟产品能力输出平台 JavaScript SDK

## Installation

```
npm i dupco
```

## Quick Start

```js
const { DuPcoDataClient } = require('dupco');

const client = new DuPcoDataClient('cloud-test', 'aa', 'yDpDEihpUsF_RyWsCES1H');

client.enableTestMode();

client
  .call('idmap-query-all', `{"f":"mac,imei","k":"868862032205613","m":"0"}`)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.trace(error);
  });
```