const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");

const startServer = (filepath, port = 4001) => {
    if (!fs.existsSync(filepath)) {
        console.log(`${filepath} does not exist`);
        process.exit(1);
    }
    console.log("filepath ->", filepath);

    const app = express();

    app.use(express.static(path.resolve(__dirname, "public")));
    app.use(cors());
    app.use(bodyParser.json());

    app.get("/get", (req, res) => {
        console.log("fetching...");
        let data = fs.readFileSync(filepath);
        data = JSON.parse(data);
        res.json(data);
        console.log("done");
    });

    app.post("/save", (req, res) => {
        console.log("saving...");
        const { data } = req.body;

        fs.writeFileSync(filepath, data);

        res.json({ success: true });
        console.log("done");
    });

    app.listen(port, () =>
        console.log(`Example app listening on port ${port}!`)
    );
};

const start = () => {
    const arg = process.argv[2] || "./data.json";
    const filepath = path.resolve(arg);
    startServer(filepath, 4001);
};

module.exports = {
    start: start
};
