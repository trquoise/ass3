import { BACKEND_PORT } from "./config.js";

let baseURL = "http://127.0.0.1:" + BACKEND_PORT;

export default function request (url, params, config) {
  const initConfigs = {
    method: "GET",
    params: null,
    body: null,
    headers: {},
  };
  config = Object.assign(initConfigs, config);
  // joint url
  url = baseURL + url;
  let { method } = config;
  config.method = method.toUpperCase();
  // with token
  let token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = token;
  config.headers["Content-Type"] = "application/json";

  let paramsRes = "";
  if (/^(POST|PUT|PATCH|DELETE)$/i.test(config.method)) {
    if (params != null) params = JSON.stringify(params);
    config.body = params;
  } else {
    for (const key in params) {
      const item = params[key];
      paramsRes += `&${key}=${item}`;
    }
  }
  if (paramsRes) url = url + `?${paramsRes}`;
  return fetch(url, config)
    .then((response) => {
      let { status } = response;
      // judge response status
      if (status >= 200 && status < 400) {
        return response.json();
      }
      return Promise.reject({
        code: "STATUS ERROR",
        status,
        response: response.json(),
      });
    })
    .catch((reason) => {
      if (reason && reason.code === "STATUS ERROR") {
        reason.response.then((res) => {
          alert( res.error);
        });
      }
      return Promise.reject(reason);
    })
    .finally(() => {
    });
}
