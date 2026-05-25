import http from "http";

const options = {
  hostname: "127.0.0.1",
  port: 4000,
  path: "/",
  method: "GET",
};

const req = http.request(options, (res) => {
  let data = "";
  console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
  console.log("Headers:", res.headers);

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("Response body:", data);
  });
});

req.on("error", (error) => {
  console.error("Request failed:", error.message);
});

req.end();
