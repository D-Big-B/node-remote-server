const socketServerUrl = "http://localhost:3030";
const hostToLive = "http://localhost:3000";

const socket = require("socket.io-client")(socketServerUrl);
const superagent = require("superagent");

socket.on("connect", () => {
  console.log("connected");
});

socket.on("disconnect", () => {
  console.log("connection lost");
});

socket.on("page-request", (data) => {
  const path = data.pathname;
  const method = data.method;
  const params = data.params;

  const localhostUrl = hostToLive + path;

  if (method === "get") executeGet(localhostUrl, params);
  if (method === "post") executePost(localhostUrl, params);
});

const executeGet = (url, params) => {
  superagent
    .get(url)
    .query(params)
    .end((error, res) => {
      if (error) return console.log(error);

      socket.emit("page-response", res.text);
    });
};
const executePost = (url, params) => {
  superagent
    .post(url)
    .query(params)
    .end((error, res) => {
      if (error) return console.log(error);

      socket.emit("page-response", res.text);
    });
};
