const express = require('express');
const app = express();
const router = express.Router();
const port = 3000;

//setup the database
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('data/lab3-timetable-data.json');
const adapter2 = new FileSync('data/lab3-timetable-data2.json');
const scheduleadapter = new FileSync('data/schedule');
const db = low(adapter2);


//server files in static folder at root URL '/'
app.use('/', express.static('static'));


router.use((req, res, next) =>{
    console.log('Request: ', req.method, ' Path: ', req.url, 'Time: ', Date.now());
    next();
})
router.use(express.json());


router.get('/courses', (req,res) =>{
	let subjects = db.get("courses").map("subject").value();
	let classNames = db.get("courses").map("className").value();
	let data = subjects.map(function(e, i){
		return [e, classNames[i]];
	});
    res.send(data);
});

router.get('/courses/:subject', (req, res) =>{
    let subjectcode = req.params.subject;
    let courses = [];
    courses = db.get("courses").filter({subject : subjectcode}).map("course_info").value();
    if (courses.length > 0)
        res.send(courses);
    else{
        res.status(404).send('the given subject code was not found');
    }
});

//witchout component code
router.get('/courses/:subject/:catalog_nbr', (req, res) =>{
	let subjectcode = req.params.subject;
	let catacode = req.params.catalog_nbr;
	if (Number(catacode)) catacode = Number(catacode);
	let course = [];
	let time = [];
	courses = db.get("courses").filter({subject : subjectcode}).
	filter({catalog_nbr : catacode}).map("course_info").value();
	if (courses.length > 0)
        res.send(getTimes(courses));
    else{
        res.status(404).send('based on the given infomation, the course was not found');
    }
});

//with component code
router.get('/courses/:subject/:catalog_nbr/:ssr_component', (req, res) =>{
	let subjectcode = req.params.subject;
	let catacode = req.params.catalog_nbr;
	if (Number(catacode)) catacode = Number(catacode);
	let componentcode = req.params.ssr_component;
	let course = [];
	let time = [];
	console.log(subjectcode,catacode,componentcode);
	courses = db.get("courses").filter({subject : subjectcode}).
	filter({catalog_nbr : catacode}).map("course_info").first().filter({ssr_component : componentcode}).value();
	if (courses.length > 0)
        res.send(getTimesForComponent(courses));
    else{
        res.status(404).send('based on the given infomation, the course was not found');
    }
});

router.post('schedule', (req, res) =>{



});

function getTimes(course_info)
{
	let ret = [];
	for (i = 0; i < course_info.length; i++)
	{
		let times = {
			start_time: course_info[i][0].start_time, 
			end_time: course_info[i][0].end_time
		};
		ret.push(times);
	}
	return ret;
}

function getTimesForComponent(course_info)
{
	let ret = [];
	for (i = 0; i < course_info.length; i++)
	{
		let times = {
			start_time: course_info[0].start_time, 
			end_time: course_info[0].end_time
		};
		ret.push(times);
	}
	return ret;
}

app.use('/api',router);

app.listen(port, () => console.log('Listening on port 3000 ...'));

