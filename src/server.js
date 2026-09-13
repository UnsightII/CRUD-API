const express = require("express");
const Database = require("better-sqlite3");

const db = new Database("tasks.db");

const createTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    title TEXT,
    done BOOLEAN
  )
`);

createTable.run();

const count = db
  .prepare(`SELECT COUNT(*) AS count FROM tasks`)
  .get();

if (count.count === 0) {
  const insertTask = db.prepare(`
    INSERT INTO tasks (title, done)
    VALUES (?, ?)
  `);

  insertTask.run("Learn SQLite", 0);
  insertTask.run("Build CRUD API", 0);
  insertTask.run("Test the API", 0);
}

const app = express();


const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ "name": "Task API", "version": "1.0", "endpoints": ["/tasks"] })
});

app.get("/health",(req , res) => {
  res.json({"status" : "ok"});
});

app.get("/tasks", (req,res) =>{
  const getTasks = db.prepare(`Select * from tasks`).all();
  res.json(getTasks);
});

app.get("/tasks/:id",(req,res)=>{
  const {id} = req.params;

  const taskId = db.prepare(`select * from tasks where id = ?`);

  const task = taskId.get(id)

  if(!task){
    return res.status(404).json({
      "error": `Task not found` 
    })
  }

  res.json(task);
});

app.post("/tasks",( req ,res ) => {
  const {title} = req.body;

  if(!title){
    return res.status(400).json({
      message : "Bad request"
    });
  }

  const task ={
    id: inMemoryData+1,
    title : title,
    done: false
  };

  inMemoryData.push(task);

  res.status(201).json(task);
}); 

app.put("/tasks/:id",( req,res) => {
  const {id} = req.params;
  const {title,done} = req.body;

  const task = inMemoryData.find(task => task.id == id );
  
  if(!task){
    return res.status(404).json({
      message : "TASK NOT FOUND"
    })
  }

  if(!title || done == undefined){
    return res.status(400).json({
      message : "EMPTY BODY"
    })
  }
  
  task.title = title,
  task.done = done

  res.status(200).json({
    message: "UPDATE SUCCESFULLY",task
  })
});

app.delete("/tasks/:id", (req,res)=>{

});

app.listen(PORT , () =>{
  console.log(`Server running at  : http://localhost:${PORT}`)
});