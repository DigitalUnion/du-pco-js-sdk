export const config = {
  apiIdKey: 'api_id',
  clientId: 'client_id',
  secretKey: 'secret_key',
  fmtHttpCodeError: 'HTTP CODE: %d',

  sdkVerkey: 'sdk_ver',
  sdkVerForTest: "test",
  dataDomain: 'https://data.shuzijz.cn/pco/data/sdk',
	baseDomain: 'https://data.shuzilm.cn/pco/base/sdk',
  httpMethodPost: 'POST',
  contentTypeJson: 'application/json; charset=utf-8',
  zlibInvalidHeaderErr: 'zlib: invalid header',
  secretNotMatchMsg: 'Secret key and secret value not match',
  pageNotFoundErr: '404 page not found',
  pageNotFoundMsg: 'Request path error',
  pathErrorCode: 2,
  otherErrorCode: 10999,
}

export const sdkVer = 'v1.0.0';