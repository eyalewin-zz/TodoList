var currentTaskId;
var currentTaskObj = {
    get getCurrenTaskId() {
        return currentTaskId;
    },
    set setCurrenTaskId(val) {
        currentTaskId = val;
    }
};

//fill all the tasks of the root node
function fillAllParentTasks(obj) {
    $('.taskContainer').html('');

    //if has tasks, so hide the first link
    if (obj.length > 0) {
        $('.addNewTask').hide();
    } else {
        $('.addNewTask').show();
    }

    for (var i = 0; i < obj.length; i++) {
        var task = obj[i];
        //Open a row
        var st = '<div class="taskRow col-lg-12 col-md-12 col-sm-12 col-xs-12" data-rowid="' + task.Id + '" data-parentid="' + task.Parent + '" data-subcount="' + task.SubTaskCount + '">';
        st += rowTemplate(task);

        //Close row info
        st += '</div>';

        //Close row
        st += '</div>';

        var $row = $(st);
        $('.taskContainer').append($row);

        if (task.SubTaskCount > 0) {
            $row.find('.expandTask').show();
        }
    }

    bindEvents();
}

//fill all sub parent tasks
function showSubParentTasks(obj, thisRow) {
    $(thisRow).find('.expandTask').hide();
    $(thisRow).find('.collapseTask').show();

    for (var i = 0; i < obj.length; i++) {
        var task = obj[i];
        //Open a row
        var st = '<div class="taskRow col-lg-offset-1 col-lg-11 col-md-offset-1 col-md-11 col-sm-offset-1 col-sm-11 col-xs-offset-1 col-xs-11" data-rowid="' + task.Id + '" data-parentid="' + task.Parent + '" data-subcount="' + task.SubTaskCount + '">';
        st += rowTemplate(task);

        //Close row info
        st += '</div>';

        //Close row
        st += '</div>';

        var $row = $(st);
        $(thisRow).append($row);

        if (task.SubTaskCount > 0) {
            $row.find('.expandTask').show();
        }
    }

    bindEvents();
}

//collapse task method to collapse all the tasks
function collapseTasks(thisRow) {
    $(thisRow).find('.collapseTask').hide();
    $(thisRow).find('.expandTask').show();

    $(thisRow).children('.taskRow').remove();
}

//CB function after adding a task || sub task
function afterAddTask(obj, thisRow) {
    //if obj has parent
    if (obj.AddNewTaskResult.Parent != "") {
        //check if the row that was clicked and the return parent from DB are the same
        if ($(thisRow).data('parentid') == obj.AddNewTaskResult.Parent) {
            thisRow = $(thisRow).parent();
        }

        //if the collapse is shown, then add the sub task row
        if ($(thisRow).find('.collapseTask').is(':visible')) {
            var cssClass = 'taskRow col-lg-offset-1 col-lg-11 col-md-offset-1 col-md-11 col-sm-offset-1 col-sm-11 col-xs-offset-1 col-xs-11';
            addNewRow(obj.AddNewTaskResult, cssClass, $(thisRow));
        } else {
            //show the expand icon
            $(thisRow).find('.expandTask').show();
        }

        handleRowSubCount($(thisRow), true);
    } else {
        //if there are tasks
        if ($('.taskContainer').html() == "") {
            $('.addNewTask').hide();
        }

        var cssClass = 'taskRow col-lg-12 col-md-12 col-sm-12 col-xs-12';
        addNewRow(obj.AddNewTaskResult, cssClass, $(thisRow));
    }

}

//Add new row method
function addNewRow(obj, cssClass, container) {
    //Open a row
    var st = '<div class="' + cssClass + '" data-rowid="' + obj.Id + '" data-parentid="' + obj.Parent + '" data-subcount="' + obj.SubTaskCount + '">';
    st += rowTemplate(obj);

    //Close row info
    st += '</div>';

    //Close row
    st += '</div>';

    //if current task has no parent
    if (obj.Parent === "") {
        $('.taskContainer').append(st);
    } else {
        container.append(st);
    }

    bindEvents();
}

//A template of a row
function rowTemplate(task) {
    //Actions section
    var st = '<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 text-left">';
    st += '<i class="addNewTask fa fa-plus-square" aria-hidden="true" title="Add New Task"></i>';
    st += '<i class="deleteTask fa fa-trash" aria-hidden="true" title="Delete Task"></i>';
    st += '</div>';
    //Row info
    st += '<div class="col-lg-11 col-md-11 col-sm-11 col-xs-11">';
    st += '<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 text-center">';
    st += '<i class="expandTask fa fa-plus" aria-hidden="true" title="Expand" style="display:none"></i>';
    st += '<i class="collapseTask fa fa-minus" aria-hidden="true" title="Collapse" style="display:none"></i>';
    st += '</div>';
    st += '<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5 text-left">';
    st += '<label class="control-label">Task Name:</label>';
    st += '<span class="taskName">' + task.Name + '</span>';
    st += '</div>';
    st += '<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5 text-left">';
    st += '<label class="control-label">Owner Name:</label>';
    st += '<span class="ownerName">' + task.Owner + '</span>';
    st += '</div>';
    return st;
}

//CB function after deleting a task
function afterDeleteTask(obj, thisRow) {
    var $thisRowParent = $(thisRow).parent();
    $(thisRow).remove();

    if ($thisRowParent != null) {
        handleRowSubCount($thisRowParent, false);
        //if current task has no subs
        if ($thisRowParent.data('subcount') === 0) {
            $thisRowParent.find('.expandTask').hide();
            $thisRowParent.find('.collapseTask').hide();
        }
    }

    //if deleted all tasks
    if ($('.taskContainer').html() === "") {
        $('.addNewTask').show();
    }
}

//handles the sub count of a row
function handleRowSubCount(row, isAdd) {
    var rowSubCount = row.data('subcount');
    if (isAdd) {
        rowSubCount += 1;
    } else {
        rowSubCount -= 1;
    }

    row.data('subcount', rowSubCount);
}

//bind the events on the screen
function bindEvents() {
    $('.deleteTask').unbind('click').bind('click', function () {
        var _this = $(this);
        var id = _this.parents('.taskRow').data('rowid');

        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask(id, _this.parents('.taskRow')[0]);
        }
    });

    $('.addNewTask').unbind('click').bind('click', function () {
        var _this = $(this);
        var id = _this.parents('.taskRow').data('rowid');
        var parentId = _this.parents('.taskRow').data('parentid');
        currentTaskObj.setCurrenTaskId = id;

        openNewTaskModal(_this.parents('.taskRow')[0], parentId);
    });

    $('.expandTask').unbind('click').bind('click', function () {
        var _this = $(this);
        var id = _this.parents('.taskRow').data('rowid');
        currentTaskObj.setCurrenTaskId = id;

        getSubParentsTasks(id, _this.parents('.taskRow')[0]);
    });

    $('.collapseTask').unbind('click').bind('click', function () {
        var _this = $(this);
        collapseTasks(_this.parents('.taskRow')[0]);
    });
}