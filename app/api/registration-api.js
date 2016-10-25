"use strict";
/*  Title: Registration-api
    Author:  Hubbert
    Date: Oct 25 2016
    Comment: 
        This is the api which is used for Registration of patron & employee/users.
*/
var _generateApiKey = function() {
    var uuid = generateUUID().replace(/-/g, "");
    if (uuid) {
        return uuid;
    } else {
        //placeholder uuid;
        return '110E8400E29B11D4A716446655440000';
    }
}

function registationApi() {
    var self = this;
    var Promise = getPromise();
    this.tag = 'registation-api';
    var ModelRegistrationUser = models.registration_user;
    var ModelEmployee = models.employee_user;
    var ModelOrganization = models.organization;
    var ModelPatron = models.patron_player;
    var moment = getMoment();

    this.registerUser = function(req, res) {
        var employee = req.body;

        //verify data;
        if (employee.hasOwnProperty('first_name') &&
            !this.getModelPattern('first_name').test(employee.first_name)) {
            this.getErrorApi().sendError(1035, 422, res);
            return;
        }
        if (employee.hasOwnProperty('last_name') &&
            !this.getModelPattern('last_name').test(employee.last_name)) {
            this.getErrorApi().sendError(1036, 422, res);
            return;
        }
        if (employee.hasOwnProperty('username') &&
            this.validEmail(employee.username)) {
            this.getErrorApi().sendError(1037, 422, res);
            return;
        }
        if (!employee.first_name || employee.first_name === "") {
            this.getErrorApi().sendError(1003, 403, res);
        } else if (!employee.last_name || employee.last_name === "") {
            this.getErrorApi().sendError(1004, 403, res);
        } else if (!employee.email_address || self.validEmail(employee.email_address)) {
            this.getErrorApi().sendError(1005, 403, res);
        } else if (!employee.password || employee.password === "") {
            this.getErrorApi().sendError(1006, 403, res);
        } else if (!employee.password_confirm || employee.password_confirm === "") {
            this.getErrorApi().sendError(1007, 403, res);
        } else if (employee.password_confirm != employee.password) {
            this.getErrorApi().sendError(1014, 403, res);
        } else if ((!employee.organization_name || employee.organization_name === "") && !employee.organization_type && (!employee.organization_hash || employee.organization_hash === "")) {
            this.getErrorApi().sendError(1015, 403, res);
        } else if (!employee.organization_hash && !employee.organization_type && employee.organization_name) {
            this.getErrorApi().sendError(1016, 403, res);
        } else if (!employee.organization_hash && employee.organization_type && (!employee.organization_name || employee.organization_name === "")) {
            this.getErrorApi().sendError(1017, 403, res);
        } else {
            //code for organization hash should go here.
            var passwordWithHash = getHash().generate(employee.password);
            var employeeOrganization = 999;

            if (!passwordWithHash) {
                this.getErrorApi().sendError(1013, 422, res);
                return;
            }

            ModelOrganization.create({
                name: employee.organization_name,
                description: employee.organization_description,
                has_multi_admin: true,
                type: employee.organization_type,
                api_key: _generateApiKey()
            }).then(function(organization) {
                if (organization.dataValues.id) {
                    employeeOrganization = organization.dataValues.id;
                }
                return ModelEmployee.findAndCountAll({
                    where: {
                        email_address: { $iLike: employee.email_address },
                        is_active: true
                    }
                });
            }).then(function(results) {
                if (results.count > 0) {
                    return new Promise(function(resolve, reject) {
                        return reject(self.getErrorApi().getErrorMsg(1018));
                    });
                }
                return ModelPatron.findAndCountAll({
                    where: {
                        email_address: { $iLike: employee.email_address },
                        is_active: true
                    }
                });
            }).then(function(result) {
                if (result.count > 0) {
                    return new Promise(function(resolve, reject) {
                        return reject(self.getErrorApi().getErrorMsg(1018));
                    });
                }
                return ModelEmployee.create({
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    username: employee.email_address,
                    email_address: employee.email_address,
                    password: passwordWithHash,
                    is_admin: true, //we are admin if we are createing the organization;
                    organization_id: employeeOrganization
                });
            }).then(function(result) {
                if (result) {
                    return new Promise(function(resolve, reject) {
                        require('crypto').randomBytes(48, function(err, buffer) {
                            var genToken = buffer.toString('hex');
                            if (genToken) {
                                return resolve(genToken);
                            } else {
                                return reject(err);
                            }
                        });
                    });
                } else {
                    return new Promise(function(resolve, reject) {
                        return reject(self.getErrorApi().getErrorMsg(1018));
                    });
                }
            }).then(function(token) {
                var currentTime = new Date();
                var vUntil = currentTime.setDate(currentTime.getDate() + 14);
                return ModelRegistrationUser.create({
                    email_address: employee.email_address,
                    token: token,
                    valid_until: vUntil
                });
            }).then(function(result) {
                if (result) {
                    var registrationUser = result.dataValues;
                    getApi('email').registration(employee, registrationUser.token);
                    return getApi('login').loginUser(req, employee.email_address);
                } else {
                    logger.error(self.getErrorApi().getErrorMsg(9901), {
                        email_address: user_email,
                        error: 9901
                    });
                    return new Promise(function(resolve, reject) {
                        return reject(self.getErrorApi().getErrorMsg(1024));
                    });
                }
            }).then(function(emp) {
                res.status(200).json({
                    user: self._cleanEmployee(emp),
                    success: true
                });
            }).catch(function(err) {
                self.getErrorApi().setErrorWithMessage(err.toString(), 422, res);
            });
        }
    }

    this.createPatron = function(req, res) {

        var user = this.getUser(req, res);
        var patron = req.body;

        if (!patron.hasOwnProperty('address')) {
            patron.address = {
                street_number: null,
                route: null,
                locality: null,
                administrative_area_level_1: null,
                administrative_area_level_2: null,
                country: null,
                postal_code: null
            }
        }

        //verify data;
        if (patron.hasOwnProperty('first_name') &&
            !this.getModelPattern('first_name').test(patron.first_name)) {
            this.getErrorApi().sendError(1035, 422, res);
            return;
        }
        if (patron.hasOwnProperty('last_name') &&
            !this.getModelPattern('last_name').test(patron.last_name)) {
            this.getErrorApi().sendError(1036, 422, res);
            return;
        }
        if (patron.hasOwnProperty('username') &&
            this.validEmail(patron.username)) {
            this.getErrorApi().sendError(1037, 422, res);
            return;
        }
        if (patron.hasOwnProperty('phone') &&
            !this.getModelPattern('phone').test(patron.phone)) {
            this.getErrorApi().sendError(1046, 422, res);
            return;
        }

        //required fields;
        if (!patron.first_name || patron.first_name === "") {
            this.getErrorApi().sendError(1003, 403, res);
        } else if (!patron.last_name || patron.last_name === "") {
            this.getErrorApi().sendError(1004, 403, res);
        } else if (!patron.email_address || self.validEmail(patron.email_address)) {
            this.getErrorApi().sendError(1005, 403, res);
        } else if (!patron.password || patron.password === "") {
            this.getErrorApi().sendError(1006, 403, res);
        } else if (!patron.password_confirm || patron.password_confirm === "") {
            this.getErrorApi().sendError(1007, 403, res);
        } else if (patron.password_confirm != patron.password) {
            this.getErrorApi().sendError(1014, 403, res);
        } else if (!patron.dob || patron.dob === "" || !moment(patron.dob, moment.ISO_8601).isValid()) {
            this.getErrorApi().sendError(1040, 403, res);
        } else {
            var passwordWithHash = getHash().generate(patron.password);
            if (!passwordWithHash) {
                this.getErrorApi().sendError(1013, 422, res);
                return;
            }
            ModelPatron.findAndCountAll({
                where: {
                    email_address: { $iLike: patron.email_address },
                    is_active: true
                }
            }).then(function(results) {
                if (results.count > 0) {
                    return new Promise(function(resolve, reject) {
                        return reject(self.getErrorApi().getErrorMsg(1018));
                    });
                }

                return ModelEmployee.findAndCountAll({
                    where: {
                        email_address: { $iLike: patron.email_address },
                        is_active: true
                    }
                });
            }).then(function(results) {
                if (results.count > 0) {
                    return new Promise(function(resolve, reject) {
                        return reject(self.getErrorApi().getErrorMsg(1018));
                    });
                }
                return getApi('employee').retrieve(user.employee_id);
            }).then(function(results) {
                var employee = results.dataValues;
                return ModelPatron.create({
                    first_name: patron.first_name,
                    last_name: patron.last_name,
                    username: patron.email_address,
                    email_address: patron.email_address,
                    password: passwordWithHash,
                    dob: patron.dob,
                    phone: patron.phone,
                    street_number: patron.address.street_number,
                    route: patron.address.route,
                    locality: patron.locality,
                    administrative_area_level_1: patron.address.administrative_area_level_1,
                    administrative_area_level_2: patron.address.administrative_area_level_2,
                    country: patron.address.country,
                    postal_code: patron.address.postal_code,
                    organization_id: employee.organization_id
                });
            }).then(function(results) {
                if (results) {
                    var newPatron = results.dataValues;
                    res.status(200).json({
                        user: self._cleanPatron(newPatron),
                        success: true
                    });
                } else {
                    return new Promise(function(resolve, reject) {
                        return reject(self.getErrorApi().getErrorMsg(1018));
                    });
                }
            }).catch(function(err) {
                self.getErrorApi().setErrorWithMessage(err.toString(), 422, res);
            });
        }
    }

    this.confirmRegistation = function(req, res) {

        return new Promise(function(resolve, reject) {
            var errorNumber = 1019;
            var errorNumberNotFound = 1020;
            var errorExpired = 1021;
            var errorTokenUsed = 1022;
            var token = req.query.token || null;
            var eo = {};
            if (!token) {
                return reject(self.getErrorApi().sendError(errorNumber, 422));
            }
            ModelRegistrationUser.findOne({ where: { token: token } })
                .then(function(registration_user) {
                    if (registration_user) {

                        //check valid until;
                        if ((new Date(registration_user.dataValues.valid_until) < new Date())) {
                            return reject(self.getErrorApi().sendError(errorExpired, 400));
                        }

                        if (!registration_user.dataValues.is_active) {
                            return reject(self.getErrorApi().sendError(errorTokenUsed, 400));
                        }
                        return ModelRegistrationUser.update({
                            is_active: false
                        }, {
                            where: {
                                token: registration_user.dataValues.token
                            }
                        }).then(function(did_update) {
                            return getApi('login').loginUser(req, registration_user.dataValues.email_address);
                        });
                    } else {
                        return reject(self.getErrorApi().sendError(errorNumberNotFound, 400));
                    }
                })
                .then(function(employee) {
                    eo.employee = employee.dataValues;
                    return resolve(employee.dataValues);
                }).catch(function(error) {
                    return reject(error);
                });
        });
    }
}

module.exports = registationApi;
