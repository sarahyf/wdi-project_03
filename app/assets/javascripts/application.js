// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require activestorage
//= require_tree .

let projectName = "";
let taskName = "";
let startTime = "";
let endTime = "";

/*********Stopwatch*********/

function stopwatch(element) {
    var time = 0;
    var interval;
    var offset;

    function update() {
        time += delta();
        var formatedTime = timeFormatter(time);
        element.innerHTML = formatedTime;
    }

    function delta() {
        var now = Date.now();
        var timePassed = now - offset;
        offset = now;
        return timePassed;
    }

    function timeFormatter() {
        var time = new Date();
        var hours = time.getHours().toString();
        var minutes = time.getMinutes().toString();
        var seconds = time.getSeconds().toString();

        return hours + ": " + minutes + ": " + seconds;
    }

    this.isOn = false;

    this.start = function() {
        if(!this.isOn) {
            interval = setInterval(update, 1000);
            offset = Date.now();
            this.isOn = true;
            time2 = time;
            time = 0
            return time;
        }
    };
    
    this.stop = function() {
        if(this.isOn) {
            clearInterval(interval);
            interval = null;
            this.isOn = false;
            time2 = time;
            time = 0;
            return time2;
        }
    };
}
/******************/

function responseToJson(response) {
    return response.json();
}

function addNewProject(projectName, taskName, startTime, endTime) {
    let params = {  name: projectName };
    
    fetch("/projects", {
        method: "POST",
        headers: {
            "content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(params)
    }).then(responseToJson)
        .then(data => {
            addNewTask(taskName, startTime, endTime, data.id);
        });
}

function addNewTask(taskName, startTime, endTime, projectId) {
    let params = { name: taskName, start_time: startTime, end_time: endTime, project_id: projectId };
    fetch("/tasks", {
        method: "POST",
        headers: {
            "content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(params)
    }).then(responseToJson)
        .then(data => {
            location.refresh();
        });
}

function getAllProjects() {
    fetch("/projects", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        }
    })
        .then(responseToJson)
        .then(projectLists);
}

function projectLists(data) {
    let check = false;
    console.log(data);
    data.forEach(function(element) {
        console.log(element);
        console.log(element.name);
        console.log(projectName.value);
        if (element["name"] === projectName.value) {
            addNewTask(taskName.value, startTime.value, endTime.value, element.id);
            check = true;
            throw BreakException;
        }
    });
    if (check === false)
    addNewProject(projectName.value, taskName.value, startTime.value, endTime.value);
}

window.onload = function() {
    taskName = document.querySelector("#taskName");
    projectName = document.querySelector("#projectName");
    startTime = document.querySelector("#startTime");
    endTime = document.querySelector("#endTime");
    submit = document.querySelector("#submit");

    var timer = document.getElementById("timer");
    var toggleBtn = document.getElementById("toggle");

    var calculateTime = false;

    function toDB() {
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth();
        var day = time.getDay();
        var hours = time.getHours().toString();
        var minutes = time.getMinutes().toString();
        var seconds = time.getSeconds().toString();

        var format = new Date(year, month, day, hours, minutes, seconds);

        return format;
    }

    var watch = null;

    if (toggleBtn) {
        watch = new stopwatch(timer);

        toggleBtn.addEventListener("click", function () {
            calculateTime = true;
            if (watch.isOn) {
                endTime = watch.stop();
                endTime = toDB(endTime);
            } else {
                startTime = watch.start();
                startTime = toDB(startTime);
            }
        });
    }

    if(submit) {
        submit.addEventListener("click", function(e) {
            if(calculateTime == true) {
                endTime = watch.stop();
                endTime = toDB(endTime);

                addNewProject(projectName.value, taskName.value, startTime, endTime);
                calculateTime = false;
            } else {
                
                
                getAllProjects();
            }
        });
    }
};