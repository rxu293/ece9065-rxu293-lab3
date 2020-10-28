const express = require('express');
const app = express();
const router = express.Router();
const port = 3000;

//setup the database
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('data/lab3-timetable-data.json');
const db = low(adapter);

//server files in static folder at root URL '/'
app.use('/', express.static('static'));

const data = db.value();


router.use((req, res, next) =>{
    console.log('Request: ', req.method, ' Path: ', req.url, 'Time: ', Date.now());
    next();
})
router.use(express.json());


router.get('/courses', (req,res) =>{
    let courses = [];
    for (i = 0; i < data.length; i++)
    {
        let course = {
            subject: data[i].subject,
            description: data[i].className
        };
        courses.push(course);
    }
    courses = JSON.stringify(courses);
    res.send(courses);
});

router.get('/courses/:subject', (req, res) =>{
    let subjectcode = req.params.subject;
    let courses = [];
    for (i = 0; i < data.length; i++)
    {
        console.log(data[i].subject, subjectcode);
        if (data[i].subject == subjectcode)
        {
            let course = {
                coursescode: data[i].catalog_nbr
            }
            courses.push(course);
        }
    }
    if (courses.length > 0)
        res.send(courses);
    else{
        res.status(404).send('the given subject code was not found');
    }
});

app.use('/api',router);

app.listen(port, () => console.log('Listening on port 3000 ...'));

