const express = require("express");
const cors = require("cors");
const monk = require("monk");

const app = express();

const PORT = process.env.PORT || 5000;

const db = monk(process.env.MONGO_DB_URI || "localhost/CandyMachine");

const stats = db.get("stats");
const inQueue = db.get("queue");
const currentCandy = db.get("candy");

app.use(cors());
app.use(express.json());

function GetNameFromCandyID(id) {
    if (id === 1) {
        return "Ferrari Cola Bilar"
    }
    if (id === 2) {
        return "Frukt Nappar"
    }
    if (id === 3) {
        return "Sura S"
    }
}

app.get("/CandySort", (req, res) => {
    currentCandy.find(result => {
        res.json(result);
    })
})

app.get("/FreeCandy1", (req, res) => {
    const toInsert = {
        candyId: 1,
    }

    inQueue.insert(toInsert);

    res.json({
        status: 200,
        message: "Resived Call"
    })
})

app.get("/FreeCandy2", (req, res) => {
    const toInsert = {
        candyId: 2,
    }

    inQueue.insert(toInsert);

    res.json({
        status: 200,
        message: "Resived Call"
    })
})

app.get("/FreeCandy3", (req, res) => {
    const toInsert = {
        candyId: 3,
    }

    inQueue.insert(toInsert);

    res.json({
        status: 200,
        message: "Resived Call"
    })
})

app.post("/CandySuccess", (req, res) => {
    console.log("RESIVED CALL SPIN THE MOTORS");
    console.log(req.body);
    const name = GetNameFromCandyID(req.body.candyId);

    const stat = {
        candyName: name,
        request: req.body,
    }
    stats.insert(stat);

    inQueue.insert(req.body);

    res.json({
        status: 200,
        message: "Resived Call"
    })
})

app.get("/CandyMachineStatus", (req, res) => {
    const stat = {
        body: req.body,
    }
    stats.insert(stat).then(r => {
        inQueue.find().then(result => {
            console.log(result);
            inQueue.remove(result[0]).then(t => {
                res.json(result);
            })
        })
    });
})

app.listen(PORT, () => {
    console.log("Listening on http://localhost:" + PORT.toString());
})