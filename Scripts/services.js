var objService = {
    Type: null,
    Url: null,
    Data: null,
}

//#region Services

function getAllParentTasks() {
    var obj = Object.create(objService);
    obj.Type = "GET";
    obj.Url = "Service/TaskService.svc/GetAllParentTasks";
    callService(obj, fillAllParentTasks);
}

function getSubParentsTasks(id, thisRow) {
    var obj = Object.create(objService);
    obj.Type = "GET";
    obj.Url = "Service/TaskService.svc/GetSubParentTasks";
    obj.Data = { id: id },
    callService(obj, showSubParentTasks, thisRow);
}

function deleteTask(id, thisRow) {
    var obj = Object.create(objService);
    obj.Type = "GET";
    obj.Url = "Service/TaskService.svc/DeleteTask";
    obj.Data = { id: id },
    callService(obj, afterDeleteTask, thisRow);
}

function addNewTaskService(objTask, thisRow) {
    var obj = Object.create(objService);
    obj.Type = "POST";
    obj.Url = "Service/TaskService.svc/AddNewTask";
    obj.Data = JSON.stringify({ taskObj: objTask });
    callService(obj, afterAddTask, thisRow);
}

//#endregion Services

// Function to call WCF Service       
function callService(obj, cbFunction, thisRow) {
    $.ajax({
        type: obj.Type,
        url: obj.Url,
        data: obj.Data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            ServiceSucceeded(obj, data, cbFunction, thisRow);
        },
        error: ServiceFailed
    });
}

function ServiceFailed(result) {
    alert('Service call failed: ' + result.status + '' + result.statusText);
}

function ServiceSucceeded(obj, data, cbFunction, thisRow) {
    cbFunction(data, thisRow);
}