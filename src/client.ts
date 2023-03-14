import axios, { AxiosError } from 'axios';
import { config, sdkVer } from "./config";
import { decode, encode } from "./common";

interface DuPcoResponse<T> {
  // Code response code
  //
  // |code  | describe                        |
  // |------|---------------------------------|
  // |0     | success                         |
  // |10000 | IP not in whitelist             |
  // |10001 | Request path error              |
  // |10002 | Internal server error           |
  // |10100 | Param cilent_id required        |
  // |10101 | Param client_id not found       |
  // |10102 | This service is not activated   |
  // |10200 | Secret key required             |
  // |10201 | Secret not found                |
  // |10202 | Decode failed                   |
  // |10203 | Get request body failed         |
  // |10300 | Service not found               |
  // |10999 | Other error                     |
  //
  // code 0 means success, others means errors
  code: number;
  // Msg the message of response
  // if code not 0, the msg will tell you the reason
  msg?: string;
  // Data the data of response, The responses are different depending on the service
  // if code not 0, the data will be undefined
  data?: T;
}

class DuPcoClient {
  sdkVer: string = sdkVer;
  domain: string;
  // clientId identify of customer
  clientId: string;
  // secreyKey and secretVal are use in pairs
  secretKey: string;
  secretVal: Uint8Array;

  constructor(domain: string, clientId: string, secretKey: string, secretVal: string) {
    this.domain = domain;
    this.clientId = clientId;
    this.secretKey = secretKey;
    this.secretVal = Uint8Array.from(Buffer.from(secretVal));
  }

  enableTestMode() {
    this.sdkVer = config.sdkVerForTest;
  }

  async call<T>(apiId: string, data: string): Promise<DuPcoResponse<T>> {
    const body = await encode(new Uint8Array(Buffer.from(data)), this.secretVal);
    const response = await axios.request({
      url: this.domain,
      method: 'POST',
      headers: {
        [config.clientId]: this.clientId,
        [config.secretKey]: this.secretKey,
        [config.apiIdKey]: apiId,
        [config.sdkVerkey]: this.sdkVer,
      },
      responseType: 'arraybuffer',
      data: body,
    })
      .then((response) => {
        try {
          const decodeData = decode(response.data, this.secretVal);
          const decodeStr = Buffer.from(decodeData).toString();
          const data: DuPcoResponse<T> = JSON.parse(decodeStr);
          return data;
        } catch (error: any) {
          if (error.message.startsWith('flate:')) {
            return {
              code: config.otherErrorCode,
              msg: config.secretNotMatchMsg,
            }
          } else if (error.message === config.zlibInvalidHeaderErr) {
            return {
              code: config.otherErrorCode,
              msg: config.secretNotMatchMsg,
            }
          } else {
            return {
              code: config.otherErrorCode,
              msg: error.message,
            }
          }
        }
      })
      .catch((error: AxiosError<Buffer>) => {
        const status = error.status ?? 0;
        if (error.response) {
          if (status > 400) {
            return {
              code: config.otherErrorCode,
              msg: config.fmtHttpCodeError.replace('%d', status.toString())
            }
          } else {
            try {
              return JSON.parse(error.response.data.toString()) as DuPcoResponse<T>;
            } catch {
              if (error.response.data.toString() === config.pageNotFoundErr) {
                return {
                  code: config.pathErrorCode,
                  msg: config.pageNotFoundMsg,
                }
              } else {
                return {
                  code: config.otherErrorCode,
                  msg: error.message,
                }
              }
            }
          }

        } else {
          const response: DuPcoResponse<T> = {
            code: config.otherErrorCode,
            msg: error.message,
          }
          return response;
        }
      })
    return response;
  }
}

export class DuPcoBaseClient extends DuPcoClient {
  constructor(clientId: string, secretKey: string, secretVal: string) {
    super(config.baseDomain, clientId, secretKey, secretVal);
  }
}

export class DuPcoDataClient extends DuPcoClient {
  constructor(clientId: string, secretKey: string, secretVal: string) {
    super(config.dataDomain, clientId, secretKey, secretVal);
  }
}