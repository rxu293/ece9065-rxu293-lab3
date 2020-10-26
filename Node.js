const express = require('express');
const app = express();
const router = express.Router();
const port = 3000;

//setup the database
const JSONdb = require('simple-json-db');
const db = new JSONdb('data/lab3-timetable-data.json');
var course = [
              {
    "id" : 1
}]

//server files in static folder at root URL '/'
app.use('/', express.static('static'));



router.use((req, res, next) =>{
    console.log('Request: ', req.method, ' Path: ', req.url, 'Time: ', Date.now());
    next();
})
router.use(express.json());

router.get('/courses', (req,res) =>{
    let data = db.JSON();
    let courses = [];
    for (i = 0; i < data.length; i++)
    {
        let course = {
            subject: data[i].subject,
            description: data[i].className
        };
        courses.push(course);
    }
    res.send(courses);
});

router.get('/courses/:id', (req, res) =>{
    res.send(course);
    console.log('ID:' + req.params.id);
});

app.use('/api',router);

app.listen(port, () => console.log('Listening on port 3000 ...'));

