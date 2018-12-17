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
//= require turbolinks
//= require_tree .

let projectName = "";
let taskName = "";
let startTime = "";
let endTime = "";

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
            console.log(data);
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

    const auto = document.querySelector("#start_task");
    const timer = document.querySelector("#timer");

    let check = false;

    // auto.addEventListener("click", function (e) { 
    //     e.preventDefault();
    //     timer.innerHTML = new Date;
    //  });

    if(submit) {
        submit.addEventListener("click", function(e) {
            // e.preventDefault();

            getAllProjects();

            // projectNames.forEach(function(element) {
            //     console.log(element);
            //     console.log(element.name);
            //     if (element["name"] === projectName) {
            //         addNewTask(taskName.value, startTime.value, endTime.value, element.id);
            //         check = true;
            //     }
            // });



            // if (check === false) {
            //     addNewProject(projectName.value, taskName.value, startTime.value, endTime.value);
            // }
            // addNewTask(taskName.value, startTime.value, endTime.value);

        });
    }
};