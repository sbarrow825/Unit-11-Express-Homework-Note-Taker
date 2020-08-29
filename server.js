var express = require("express");
var fs = require("fs")
var path = require("path");

var app = express()
var PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
})

app.get("/api/notes", (req, res) => {
    res.json(JSON.parse(fs.readFileSync(path.join(__dirname, "db", "db.json"))))
})

app.post("/api/notes", (req, res) => {
    var noteToAdd = req.body;
    var allNotes = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "db.json")))
    var allIDs = [];
    for (const note of allNotes) {
        allIDs.push(note.id)
    }
    if (Math.max(...allIDs)) {
        var nextID = Math.max(...allIDs) + 1;
    } else {
        var nextID = 1;
    }
    noteToAdd["id"] = nextID
    allNotes.push(noteToAdd);
    fs.writeFile(path.join(__dirname, "db", "db.json"), JSON.stringify(allNotes), err => {
        if (err) throw err
    })
    res.end()
})



app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT)
})