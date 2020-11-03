document.getElementById("get_all_courses_btn").onclick = function() {getAllCourses()}
document.getElementById("get_codes_by_subject_btn").onclick = function() {getCodesByGivenSubject()}

//fetch function 1
function getAllCourses()
{
	fetch('http://localhost:3000/api/courses')
	.then((res) => res.json())
	.then(function(data){
		showAllCourses(data);
	})
	.catch(error => console.log(error));
}

//function 1
function showAllCourses(data)
{
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
	fetch('http://localhost:3000/api/courses/' + subject)
	.then((res) => res.json())
	.then(function(data){
		showCodesByGivenSubject(data);
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