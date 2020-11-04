const express = require('express');
const app = express();
const router = express.Router();
const port = 3000;
let allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  next();
}
app.use(allowCrossDomain);
app.use(express.json());
//setup the database
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('data/lab3-timetable-data2.json');
const schedule_adapter = new FileSync('data/schedule.json');
const db = low(adapter);
const sche_db = low(schedule_adapter);


//server files in static folder at root URL '/'
app.use('/', express.static('static'));



router.use((req, res, next) =>{
    console.log('Request: ', req.method, ' Path: ', req.url, 'Time: ', Date.now());
    next();
})
router.use(express.json());

//1. get all courses subject and classnames
router.get('/courses', (req,res) =>{
	let subjects = db.get("courses").map("subject").value();
	let classNames = db.get("courses").map("className").value();
	let data = subjects.map(function(e, i){
		return [e, classNames[i]];
	});
    res.send(data);
});

//2. get all courses codes for a given subject
router.get('/courses/:subject', (req, res) =>{
    let subjectcode = req.params.subject;
    let courses = [];
    courses = db.get("courses").filter({subject : subjectcode}).map("catalog_nbr").value();
    if (courses.length > 0)
        res.send(courses);
    else{
        res.status(404).send('the given subject code was not found');
    }
});

//3. get the time table entry witchout a component code
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

//3. get the time table with a component code
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

//4. create a schedule with a given name
router.post('/schedule', (req, res) =>{
	let schedulename = req.body.schedule_name;
	let existFlag = sche_db.get(schedulename).value();
	if (existFlag)
	{
		res.status(400)
		.send('the given schedule name can not be created, because there is already a same schedule name existing');
	} 
	else
	{
		sche_db.set(schedulename, {}).write();
		res.send(schedulename + ": {}");
	}
});

//5. Save a list of subject code, course code pairs under a given schedule name
router.put('/schedule/:schedule_name', (req, res) =>{
	let schedulename = req.params.schedule_name;
	let pairs = req.body.pairs;
	let existFlag = sche_db.get(schedulename).value();
	if (!existFlag)
	{
		res.status(404)
		.send('the given schedule name was not found');
	} 
	else
	{
		sche_db.set(schedulename, pairs).write();
		res.send(schedulename + ": " + JSON.stringify(pairs));
	}
});

//6. Get the list of subject code, course code pairs for a given schedule
router.get('/schedule/:schedule_name', (req, res) =>{
	let schedulename = req.params.schedule_name;
	let existFlag = sche_db.get(schedulename).value();
	if (!existFlag)
	{
		res.status(404)
		.send('the given schedule name was not found');
	} 
	else
	{
		let data = sche_db.get(schedulename).value();
		res.send(data);
	}
});

//7. delete a schedule for a given schedule name
router.delete('/schedule/:schedule_name', (req, res) => {
	let schedulename = req.params.schedule_name;
	let existFlag = sche_db.get(schedulename).value();
	if (!existFlag)
	{
		res.status(404)
		.send('the given schedule name was not found');
	} 
	else
	{
		sche_db.unset(schedulename).write();
		res.send("successfully delete schedule '" + schedulename + "'");
	}
});

//8. return the numbers of courses for schedules
router.get('/schedule', (req, res) =>{
	let data = sche_db.value();
	let keys = Object.keys(data);
	let ret = []
	for (i = 0; i < keys.length; ++i)
	{
		ret.push([keys[i],(sche_db.get(keys[i]).value().length == null) ? 0 : sche_db.get(keys[i]).value().length]);
	}
	res.send(ret);
});

//9. delete all schedules
router.delete('/schedule', (req, res) => {
	let data = sche_db.value();
	let keys = Object.keys(data);
	for (i = 0; i < keys.length; ++i)
	{
		sche_db.unset(keys[i]).write();
	}
	res.send("deleted all schedules successfully");
});

//for getting the start_time and end_time for a given course
function getTimes(course_info)
{
	let ret = [];
	for (i = 0; i < course_info.length; i++)
	{
		let times = {
			start_time: course_info[i][0].start_time, 
			end_time: course_info[i][0].end_time,
			days: course_info[i][0].days,
			component: course_info[i][0].ssr_component
		};
		ret.push(times);
	}
	return ret;
}

//same with above but is used when having a componenet code
function getTimesForComponent(course_info)
{
	let ret = [];
	for (i = 0; i < course_info.length; i++)
	{
		let times = {
			start_time: course_info[0].start_time, 
			end_time: course_info[0].end_time,
			days: course_info[0].days,
			component: course_info[0].ssr_component
		};
		ret.push(times);
	}
	return ret;
}

app.use('/api',router);

app.listen(port, () => console.log('Listening on port 3000 ...'));

