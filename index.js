const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { mainModule } = require("node:process");
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    credentials: true,
  },
});
const db = new sqlite3.Database("db.db");
let sql = `SELECT * FROM marii`;
const fs = require("fs");
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  fs.readFile("index.html", function (err, data) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    return res.end();
  });
});

const fetchAll = async (db, sql, params) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};
async function main() {
  io.on("connection", (socket) => {
    socket.on("vse", async (msg) => {
      try {
        sql = `SELECT * FROM marii`;
        const book = await fetchAll(db, sql);
        io.emit("vse", await book);
      } catch (err) {
        console.log(err);
      }
    });
  });
  server.listen(5003, () => {
    console.log("server running at http://localhost:5003");
  });
}

main();
