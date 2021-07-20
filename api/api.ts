import axios from "axios";

export const CONFERENCE_ID = 1;
export const BASE_URL = "https://alc-mobile-api.dxe.io/api";

interface APIOptions {
  path: string;
  body: {};
}

export interface APIResponse {
  data: any;
  error: Error | null;
}

export const post = async function (options: APIOptions): Promise<APIResponse> {
  try {
    const res = await axios.post(BASE_URL + options.path, options.body);
    if (res.status != 200) {
      return { data: null, error: new Error("API returned status code " + res.status) };
    }
    console.log(res.data); // TODO: remove after debugging
    return { data: res.data, error: null };
  } catch (err) {
    console.error(err);
    return { data: null, error: err };
  }
};
