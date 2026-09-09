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

app.listen(PORT , () =>{
  console.log(`Server running at  : http://localhost:${PORT}`)
});