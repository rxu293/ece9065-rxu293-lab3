document.getElementById("get_all_courses_btn").onclick = function() {getAllCourses()}
document.getElementById("get_codes_by_subject_btn").onclick = function() {getCodesByGivenSubject()}
document.getElementById("get_times_by_given_info_btn").onclick = function() {getTimeEntry()}
document.getElementById("add_schedule_btn").onclick = function() {addSchedule()}
document.getElementById("add_to_list_btn").onclick = function(){addtoList()}
document.getElementById("add_list_to_schedule_btn").onclick = function(){addtoSchedule()}
document.getElementById("get_schedule_btn").onclick = function(){getSchedule()}
document.getElementById("delete_schedule_btn").onclick = function(){deleteSchedule()}
document.getElementById("delete_all_schedule_btn").onclick = function(){deleteAllSchedules()}
document.getElementById("get_all_schedules_btn").onclick = function(){getSchedules()}
var pairs = {pairs:[]};
var publicURL = "http://localhost" + ":3000/api/";

$.getJSON('https://ipapi.co/json/', function(data) {
  console.log(JSON.stringify(data, null, 2));
});
//fetch function 1
function getAllCourses()
{
	fetch(publicURL + 'courses')
	.then((res) => res.json())
	.then(function(data){
		showAllCourses(data);
	})
	.catch(error => console.log(error));
}

//function 1
function showAllCourses(data)
{
	console.log(data.length)
	let table = document.getElementById('course_table');
	table.innerHTML = '';

	//for creating header of the table
	let courses = data;
	let tr = document.createElement('tr'),
		th1 = document.createElement('th'),
		th2 = document.createElement('th');
	let th1text = document.createTextNode("Subject");
	let th2text = document.createTextNode("Description");
	th1.appendChild(th1text);
	th2.appendChild(th2text);
	tr.appendChild(th1);
	tr.appendChild(th2);
	table.appendChild(tr);

	//for generating content of the table
	for (i = 0; i < courses.length; i ++)
	{
		tr = document.createElement('tr');
		th1 = document.createElement('th');
		th2 = document.createElement('th');
		let th1text = document.createTextNode(courses[i][0]);
		let th2text = document.createTextNode(courses[i][1]);
		th1.appendChild(th1text);
		th2.appendChild(th2text);
		tr.appendChild(th1);
		tr.appendChild(th2);
		table.appendChild(tr);
	}
}


//fetch function 2
function getCodesByGivenSubject()
{
	let subject = document.getElementById('subjectInputText').value;
	fetch(publicURL + 'courses/' + subject)
	.then((res) => res.json())
	.then(function(data){
		if (!data.msg)
		{
			showCodesByGivenSubject(data);
		}
		else
		{
			alert(data.msg);
		}
	})
	.catch(error => alert('no code found for this subject'));
}

//function 2
function showCodesByGivenSubject(data)
{
	let table = document.getElementById('course_table');
	table.innerHTML = '';

	//for creating header of the table
	let tr = document.createElement('tr'),
		th1 = document.createElement('th');
	let th1text = document.createTextNode("Codes");
	th1.appendChild(th1text);
	tr.appendChild(th1);
	table.appendChild(tr);

	for (i = 0; i < data.length; i ++)
	{
		tr = document.createElement('tr');
		th1 = document.createElement('th');
		let th1text = document.createTextNode(data[i]);
		th1.appendChild(th1text);
		tr.appendChild(th1);
		table.appendChild(tr);
	}
}

//fetch function 3
function getTimeEntry()
{
	let subject = document.getElementById('div_subjectInputText').value;
	let course = document.getElementById('div_courseInputText').value;
	let component = document.getElementById('div_componentInputText').value;
	let req = publicURL + 'courses/' + subject + "/" + course;
	if (component) req += "/" + component;
	fetch(req)
	.then((res) => res.json())
	.then(function(data){
		if (!data.msg)
		{
			showTimeEntry(data);
		}
		else
		{
			alert(data.msg);
		}
	})
	.catch(error => alert('no course found for given subject code or course code'));
}

//function 3
function showTimeEntry(data)
{
	let table = document.getElementById('course_table');
	table.innerHTML = '';

	//for creating header of the table
	let tr = document.createElement('tr'),
		th1 = document.createElement('th'),
		th2 = document.createElement('th'),
		th3 = document.createElement('th'),
		th4 = document.createElement('th'),
		th1text = document.createTextNode("Start_time"),
		th2text = document.createTextNode("End_time"),
		th3text = document.createTextNode("Days"),
		th4text = document.createTextNode("Component");
	th1.appendChild(th1text);
	th2.appendChild(th2text);
	th3.appendChild(th3text);
	th4.appendChild(th4text);
	tr.appendChild(th1);
	tr.appendChild(th2);
	tr.appendChild(th3);
	tr.appendChild(th4);
	table.appendChild(tr);

	//for generating data
	for (i = 0; i < data.length; i ++)
	{
		tr = document.createElement('tr');
		th1 = document.createElement('th');
		th2 = document.createElement('th');
		th3 = document.createElement('th');
		th4 = document.createElement('th');
		th1text = document.createTextNode(data[i].start_time);
		th2text = document.createTextNode(data[i].end_time);
		th3text = document.createTextNode(data[i].days);
		th4text = document.createTextNode(data[i].component);
		th1.appendChild(th1text);
		th2.appendChild(th2text);
		th3.appendChild(th3text);
		th4.appendChild(th4text);
		tr.appendChild(th1);
		tr.appendChild(th2);
		tr.appendChild(th3);
		tr.appendChild(th4);
		table.appendChild(tr);
	}
}

//fetch function 4
function addSchedule()
{
	let schedule = document.getElementById('addScheduleInputText').value;
	let sendData = {schedule_name: schedule};
	fetch('http://localhost:3000/api/schedule/', {
		method: 'POST',
		body: JSON.stringify(sendData),
		headers: new Headers({
    	'Content-Type': 'application/json'
  		})
	}).then((res) => res.json())
	.then(function(data){
		alert(data.msg);
	})
	.catch(error => console.log('error'));
}

//add to list function 5
function addtoList()
{
	let subject = document.getElementById("pairSubjectInputText").value;
	let course  = document.getElementById("pairCatalogInputText").value;
	pairs.pairs.push({subject:subject,catalog_nbr:course});
	alert("added to list successfully");
}

//fetch function 5
function addtoSchedule()
{
	let schedule = document.getElementById('pairScheduleInputText').value;
	let sendData = pairs;
	fetch(publicURL + 'schedule/' + schedule, {
		method: 'POST',
		body: JSON.stringify(sendData),
		headers: new Headers({
    	'Content-Type': 'application/json'
  		})
	}).then((res) => res.json())
	.then(function(data){
		if (data.msg) alert(data.msg);
		else showSchedule(data);
		pairs = [];
	})
	.catch(error => console.log('error'));
}

//fetch function 6
function getSchedule()
{
	let schedule = document.getElementById('addScheduleInputText').value;
	fetch(publicURL+ 'schedule/' + schedule)
	.then((res) => res.json())
	.then(function(data){
		if (!data.msg)
		{
			showSchedule(data);
		}
		else
		{
			alert(data.msg);
		}
	})
	.catch(error => alert('no code found for this subject'));
}
//function 5 and 6
function showSchedule(data)
{
	let table = document.getElementById('course_table');
	table.innerHTML = '';

	//for creating header of the table
	let courses = data;
	let tr = document.createElement('tr'),
		th1 = document.createElement('th'),
		th2 = document.createElement('th');
	let th1text = document.createTextNode("Subject Code");
	let th2text = document.createTextNode("Course Code");
	th1.appendChild(th1text);
	th2.appendChild(th2text);
	tr.appendChild(th1);
	tr.appendChild(th2);
	table.appendChild(tr);

	//for generating content of the table
	for (i = 0; i < courses.length; i ++)
	{
		tr = document.createElement('tr');
		th1 = document.createElement('th');
		th2 = document.createElement('th');
		let th1text = document.createTextNode(courses[i].subject);
		let th2text = document.createTextNode(courses[i].catalog_nbr);
		th1.appendChild(th1text);
		th2.appendChild(th2text);
		tr.appendChild(th1);
		tr.appendChild(th2);
		table.appendChild(tr);
	}
}

//fetch function 7
function deleteSchedule()
{
	let schedule = document.getElementById('addScheduleInputText').value;
	fetch(publicURL + 'schedule/' + schedule, {
		method: 'DELETE',
	})
	.then((res) => res.json())
	.then(function(data){
		alert(data.msg);
	})
	.catch(error => console.log('error'));
}

//fetch function 8
function getSchedules()
{
	fetch(publicURL+ 'schedule')
	.then((res) => res.json())
	.then(function(data){
		showSchedules(data);
	})
	.catch(error => alert('error'));
}

//function 8
function showSchedules(data)
{
	let table = document.getElementById('course_table');
	table.innerHTML = '';

	//for creating header of the table
	let courses = data;
	let tr = document.createElement('tr'),
		th1 = document.createElement('th'),
		th2 = document.createElement('th');
	let th1text = document.createTextNode("Schedule name");
	let th2text = document.createTextNode("Number of courses in the schedule");
	th1.appendChild(th1text);
	th2.appendChild(th2text);
	tr.appendChild(th1);
	tr.appendChild(th2);
	table.appendChild(tr);

	//for generating content of the table
	for (i = 0; i < courses.length; i ++)
	{
		tr = document.createElement('tr');
		th1 = document.createElement('th');
		th2 = document.createElement('th');
		let th1text = document.createTextNode(courses[i][0]);
		let th2text = document.createTextNode(courses[i][1]);
		th1.appendChild(th1text);
		th2.appendChild(th2text);
		tr.appendChild(th1);
		tr.appendChild(th2);
		table.appendChild(tr);
	}
}

//fetch function 9
function deleteAllSchedules()
{
	fetch(publicURL + '/schedule', {
		method: 'DELETE',
	})
	.then((res) => res.json())
	.then(function(data){
		alert(data.msg);
	})
	.catch(error => console.log('error'));
}