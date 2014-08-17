(function () {
    // parent scope
    function MainController($scope) {
        var mainCtrl = this;
        this.filterTasks = {};
        $scope.tasks = [
            {
                done: false,
                title: "learn angular!",
                description: "start from scratch, build your skills"
            },
            {
                done: true,
                title: "play with controllers!",
                description: "make sure to understand whats going on"
            },
            {
                done: false,
                title: "try bootstrap",
                description: "prototype a gui is easy"
            }
        ];

        this.currentTask = {};

        this.addTask = function(task) {
            if (task.title !== undefined && task.description !== undefined) {
                var newTask = {
                    title: task.title,
                    description: task.description,
                    done: false
                };
                this.currentTask = {};
                $scope.tasks.unshift(newTask);
            }
        };

        $scope.$on("editTask", function(event, task) {
            mainCtrl.currentTask = task;
        });

        $scope.$on("deleteTask", function(event, task) {
            $scope.tasks.splice($scope.tasks.indexOf(task),1);
        });

        $scope.$on("clearLog",function(event) {
            $scope.$broadcast("clearLogChild");
        });

        $scope.$on("toggleCompleted", function(event) {
            if (mainCtrl.filterTasks == "" || !mainCtrl.filterTasks.done)
                mainCtrl.filterTasks = {done:true};
            else
                mainCtrl.filterTasks = {done:false};
        });
    }

    function ActionBarController($scope) {
        this.clearLog = function() {
            $scope.$emit("clearLog");
        };

        this.toggleCompleted = function() {
          $scope.$emit("toggleCompleted");
        }
    }

    function TaskTableController($scope) {
        this.editTask = function(task) {
            $scope.$emit("editTask",task);
        };

        this.deleteTask = function(task) {
            $scope.$emit("deleteTask",task);
        }
    }

    function LogController($scope) {
        var logCtrl = this;
        this.logs = [];

        this.addLog = function(log) {
            var d = new Date();
            var curr_date = d.getDate();
            var curr_month = d.getMonth() + 1; //Months are zero based
            var curr_year = d.getFullYear();
            var curr_hours = d.getHours();
            var curr_mins = d.getMinutes();
            var curr_secs = d.getSeconds();
            this.logs.unshift(curr_date + "/" + curr_month + "/" + curr_year + " " + curr_hours + ":" + curr_mins + ":" + curr_secs + " - " + log);
        };

        this.clearLog = function() {
            this.logs = [];
        };

        $scope.$on("clearLogChild",function(event) {
            logCtrl.clearLog();
        });

        $scope.$watch('tasks', function (newVal, oldVal) {
            if (newVal.length > oldVal.length) // new item added
                logCtrl.addLog("Task added");
            else if (newVal.length < oldVal.length) // item removed
                logCtrl.addLog("Task deleted");
            else { // log for change in task details
                var newTask, oldTask;
                for (var index = 0; index < newVal.length; index++) {
                    newTask = newVal[index];
                    oldTask = oldVal[index];
                    if (newTask.done != oldTask.done) // task completed
                        logCtrl.addLog("Task marked " + (newTask.done ? 'completed' : 'uncompleted'));
                    else if (newTask.title != oldTask.title)
                        logCtrl.addLog("Task title changed");
                    else if (newTask.description != oldTask.description)
                        logCtrl.addLog("Task description changed");
                }
            }
        }, true);
    }

    angular.module('taskManager', [])
    .controller({
        'MainController' : ['$scope', MainController],
        'ActionBarController' : ['$scope', ActionBarController],
        'TaskTableController' : ['$scope', TaskTableController],
        'LogController' : ['$scope', LogController]
    });
}());