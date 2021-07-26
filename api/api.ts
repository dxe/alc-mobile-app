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
    console.log(`fetching: ${options.path}`); // TODO: remove after debugging
    const res = await axios.post(BASE_URL + options.path, options.body);
    //console.log(res.data); // TODO: remove after debugging
    return { data: res.data, error: null };
  } catch (err) {
    console.error(err);
    return { data: null, error: err };
  }
};
