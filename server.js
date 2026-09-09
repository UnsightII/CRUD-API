const express = require("express");

const app = express();

const inMemoryData = [{
  id: 1, title: "CREATE",done:false
}
,
{
  id:2, title: "POST", done: true
}
,
{
  id:3, title: "DELETE" , done: false
}]

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ "name": "Task API", "version": "1.0", "endpoints": ["/tasks"] })
});

app.get("/health",(req , res) => {
  res.json({"status" : "ok"});
});

app.get("/tasks", (req,res) =>{
  res.json(inMemoryData);
});

app.get("/tasks/:id",(req,res)=>{
  const {id} = req.params;

  const task = inMemoryData.find(task => task.id == id);
  if(!task){
    return res.status(404).json({
      "error": `Task ${id} not found` 
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