/*  Title: Profile/ My Account Controller
    Author:  Hubbert
    Date: Oct 15 2016
    Comment: 
        This should all the front end logic for the my account page.
*/

app.controller('ProfileCtrl', ['$scope', '$uibModal', '$http', '$window', 'data', function($scope, $uibModal, $http, $window, data) {
    var _base_templates = "templates/account/";
    var _url_employee = "/api/v1/user/";

    $scope.currentPage = null;
    $scope.timeSelect = null;
    $scope.editForm = null;
    $scope.showEdit = null;

    $scope.image_dir = '/';
    $scope.image_bucket_url = null;
    $scope.does_file_exist = false;

    $scope.employeeModel = {
        id: null,
        first_name: null,
        last_name: null,
        email_address: null,
        organization_id: null,
        password: 'placeholder',
        uuid: null
    }

    $scope.organizationModel = {
        description: null,
        id: null,
        name: null
    }

    $scope.form = {
        state: {},
        data: {}
    }

    this.animationsEnabled = true;

    var _init = function() {
        //default page;
        $scope.currentPage = _getDefaultPage();
    }

    $scope.getEmployeeImage = function(uuid) {
        if (!uuid) {
            return $scope.image_dir + 'blue-person-plceholder.svg';
            // return $scope.image_bucket_url + 'default.png';
        }
        return $scope.image_bucket_url + 'employee/' + uuid + '-profile.png';
        // check for image in s3;
        // return the image_url to front-end;
    }

    this.saveForm = function() {
        var userNotFoundErrorMsg = "An unexpected error has occuried. Please contact CounterDraft support..";
        if (!$scope.editForm) {
            return;
        }

        if ($scope.employeeModel) {
            $http({
                method: 'PUT',
                url: _url_employee,
                data: {
                    first_name: $scope.employeeModel.first_name,
                    last_name: $scope.employeeModel.last_name,
                    email_address: $scope.employeeModel.email_address
                },
            }).then(function successCallback(response) {
                if (response && response.status === 200) {
                    // console.log(response);
                } else {
                    $window.swal({
                        title: "Error",
                        text: userNotFoundErrorMsg,
                        type: "error",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "OK",
                        closeOnConfirm: true,
                        html: true
                    });
                    $scope.showEdit = false;
                }
            }, function errorCallback(response) {
                var errorMsg = userNotFoundErrorMsg;
                if (response && response.hasOwnProperty('data') && response.data.hasOwnProperty('error') && response.data.error.length > 0) {
                    errorMsg = response.data.error[0].msg;
                }
                $window.swal({
                    title: "Error",
                    text: errorMsg,
                    type: "error",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK",
                    closeOnConfirm: true,
                    html: true
                });
            });
        } else {
            $window.swal({
                title: "Error",
                text: userNotFoundErrorMsg,
                type: "error",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK",
                closeOnConfirm: true,
                html: true
            });
        }
    }

    this.initAccount = function() {
        $scope.editForm = false;
        $scope.showEdit = true;
        var userNotFoundErrorMsg = "An unexpected error has occuried. Please contact CounterDraft support..";

        if (typeof 'undefined' != data) {
            if (data.hasOwnProperty('employee')) {
                $scope.employeeModel.id = data.employee.id;
            }
            if (data.hasOwnProperty('dir')) {
                if (data.dir.hasOwnProperty('image_dir')) {
                    $scope.image_dir = data.dir['image_dir'];
                }
                if (data.dir.hasOwnProperty('image_bucket_url')) {
                    $scope.image_bucket_url = data.dir['image_bucket_url'];
                }
                if (data.hasOwnProperty('extra')) {
                    $scope.does_file_exist = data.extra.does_file_exist;
                }
            }
        }

        if ($scope.employeeModel.id) {
            $http({
                method: 'GET',
                url: _url_employee,
                params: { id: $scope.employeeModel.id },
            }).then(function successCallback(response) {
                if (response && response.status === 200) {
                    var employee = response.data.employee;
                    var organization = response.data.organization;
                    if (employee) {
                        $scope.employeeModel = employee;
                        $scope.employeeModel.password = 'placeholder';
                    }
                    if (organization) {
                        $scope.organizationModel = organization;
                    }
                } else {
                    $window.swal({
                        title: "Error",
                        text: userNotFoundErrorMsg,
                        type: "error",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "OK",
                        closeOnConfirm: true,
                        html: true
                    });
                    $scope.showEdit = false;
                }
            }, function errorCallback(response) {
                var errorMsg = userNotFoundErrorMsg;
                if (response && response.hasOwnProperty('data') && response.data.hasOwnProperty('error') && response.data.error.length > 0) {
                    errorMsg = response.data.error[0].msg;
                }
                $window.swal({
                    title: "Error",
                    text: errorMsg,
                    type: "error",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK",
                    closeOnConfirm: true,
                    html: true
                });
                $scope.showEdit = false;
            });
        } else {
            $window.swal({
                title: "Error",
                text: userNotFoundErrorMsg,
                type: "error",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK",
                closeOnConfirm: true,
                html: true
            });
            $scope.showEdit = false;
        }
    }

    this.onEditPassword = function(canEdit) {
        var self = this;
        if (!canEdit) {
            return false;
        }
        var modalInstance = $uibModal.open({
            animation: self.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'change-password-modal.html',
            controller: 'ChangePasswordCtrl',
            controllerAs: 'mCtrl',
            size: 'lg'
        });

        modalInstance.result.then(function(result) {
            if (result.status) {
                $window.swal({
                    title: "Success",
                    text: 'Your password has been changed.',
                    type: "success",
                    confirmButtonColor: "#64d46f",
                    confirmButtonText: "OK",
                    closeOnConfirm: true,
                    html: true
                });
            } else {
                var errorMsg = 'Unknown error failed to update password.';
                if (result.hasOwnProperty('errorMsg')) {
                    errorMsg = result.errorMsg;
                }
                $window.swal({
                    title: "Error",
                    text: errorMsg,
                    type: "error",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK",
                    closeOnConfirm: true,
                    html: true
                });
            }
        }, function() {
            console.info('Modal dismissed at: ' + new Date());
        });
    }

    this.onEdit = function() {
        $scope.editForm = !$scope.editForm;
        return false;
    }

    this.getEmployeeImage = function() {

    }

    var _getDefaultPage = function() {
        return _base_templates + 'account.html';
    }

    _init();

}]);
