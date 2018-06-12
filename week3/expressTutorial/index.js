const Joi = require('joi')
const express = require('express');
const app = express();

app.use(express.json())

const courses = [
  {id: 1, name: "Math 101"},
  {id: 2, name: "Spanish 102"},
  {id: 3, name: "History 203"}
]

app.get('/', (req, res) => {
  res.send('Hello, World!!!')
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
  //res.send(req.params.id)
  const course = courses.find(c => c.id === parseInt(req.params.id));

  if(!course) return res.status(404).send(`Course was not found in system!`)
  res.send(course);

});

app.get('/api/posts/:year/:month', (req, res) => {
  res.send(req.params)
  res.send(req.query)
});

app.post('/api/courses', (req, res) => {

  // const schema = {
  //   name: Joi.string().min(3).required()
  // };
  //
  // const result = Joi.validate(req.body, schema);
  //console.log(result);
  // if(result.error){
  //   // 400
  //   res.status(400).send(result.error.details[0].message )
  //   return;
  // }
  //replace with:

  const { error } = validateCourse(req.body); //result.error

  if(error){
    // 400
    res.status(400).send(error.details[0].message )
    return;
  }



  const course = {
    id:courses.length + 1,
    name: req.body.name
  };

  courses.push(course);
  res.send(course)

});

app.put('/api/courses/:id', (req, res) => {
  //Look up course
  //if course doesn't exist return 404 error
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if(!course) {
    res.status(404).send(`Course was not found in system!`)
    return;
  }

  //Validate course
  //if not valid return 400 error for bad request
  //const result = validateCourse(req.body);
  const { error } = validateCourse(req.body); //result.error

  if(error){
    // 400
    res.status(400).send(error.details[0].message )
    return;
  }

  //update the course
  course.name = req.body.name;
  //return updated course to user
  res.send(course)
});

app.delete('/api/courses/:id', (req, res) => {
  //look up course
  //doesn't exist return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if(!course) return res.status(404).send(`Course was not found in system!`)
  //delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  //return the same course
  res.send(course);

});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required()
  };
  return  Joi.validate(course, schema);
}


//port
const port = process.env.PORT || 8000
app.listen(port, () => console.log(`Listening on port ${port} `))
// app.post()
// app.put()
// app.delete()
