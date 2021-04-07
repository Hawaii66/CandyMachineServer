const express = require("express");
const cors = require("cors");
const monk = require("monk");

const app = express();

const PORT = process.env.PORT || 5000;

const db = monk(process.env.MONGO_DB_URI || "localhost/CandyMachine");

const stats = db.get("stats");
const inQueue = db.get("queue");

app.use(cors());
app.use(express.json());

function GetNameFromCandyID(id) {
    if (id === 1) {
        return "GottOchBlandat"
    }
}

app.post("/CandySuccess", (req, res) => {
    console.log("RESIVED CALL SPIN THE MOTORS");

    const name = GetNameFromCandyID(req.body.finalData.candyId);

    const stat = {
        candyName: name,
        request: req,
    }
    stats.insert(stat);

    inQueue.insert(req.body.finalData);

    res.json({
        status: 200,
        message: "Resived Call"
    })
})

app.get("/CandyMachineStatus", (req, res) => {
    const stat = {
        request: req
    }
    stats.insert(stat);
    inQueue.find().then(result => {
        res.json(result);
    })
})

app.listen(PORT, () => {
    console.log("Listening on http://localhost:" + PORT.toString());
})