var currentRow; //keeps the current row
var parentId; //keeps the current row parent id

//add a new task
function addNewTask() {

    $('#addNewTaskModal input').removeClass('mandatory');

    //validate form
    if ($('#newTaskName').val() === "") {
        $('#newTaskName').addClass('mandatory');
        return false;
    }

    if ($('#newTaskOwner').val() === "") {
        $('#newTaskOwner').addClass('mandatory');
        return false;
    }

    //create a CTask obj to save
    var cTask = JSON.parse($('#CTaskObj').val());
    cTask.Name = $('#newTaskName').val();
    cTask.Owner = $('#newTaskOwner').val();

    //if the creating a sub task
    if ($('#subTaskCheckBox').prop('checked')) {
        cTask.Id = currentTaskObj.getCurrenTaskId;
    } else {
        //if current task is a sub task
        if (parentId != '') {
            cTask.Id = parentId;
        } else {
            cTask.Id = null;
        }
    }

    addNewTaskService(cTask, currentRow);

    $('#addNewTaskModal').modal('hide');
}

//open the new task modal
function openNewTaskModal(thisRow, rowParentId) {
    $('#newTaskName').val('');
    $('#newTaskOwner').val('');
    $('#subTaskCheckBox').prop('checked', false);
    currentRow = thisRow;
    parentId = rowParentId;

    //if there are no tasks, so hide the sub task check box
    if (currentRow === undefined) {
        $('.childCheckBox').hide();
    } else {
        $('.childCheckBox').show();
    }

    $('#addNewTaskModal').modal({
        keyboard: false,
        backdrop: 'static',
        show: true
    });
}

$(function () {
    $('#addNewTaskModalOKBtn').on('click', function () {
        addNewTask();
    });

    $('#addNewTaskCancelBtn').on('click', function () {
        $('#addNewTaskModal').modal('hide');
    });
});