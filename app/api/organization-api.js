"use strict";
/*  Title: Organization-Api
    Author:  Hubbert
    Date: Oct 07 2016
    Comment: 
        This is the api which is used for all organization calls / managment.
*/

function OrganizationApi() {
    var self = this;
    this.tag = 'organization-api';
    var Promise = getPromise();
    var ModelOrganization = models.organization;
    var ModelEmployeeInvite = models.employee_invite;

    this.getOrganizationTypes = function(req, res) {
        var Organization_types = models.organization_type;
        Organization_types.all().then(function(organization_types) {
            if (organization_types) {
                res.status(200).json({
                    organization_types: organization_types,
                    success: true
                });
            } else {
                this.getErrorApi().sendError(1009, 500, res);
            }
        });
    }
    this.retrieve = function(organization_id) {
        return ModelOrganization.find({
            where: {
                id: organization_id,
                is_active: true
            }
        });
    }

    this.create = function(organization) {
        var self = this;
        return ModelOrganization.create(organization);
    }

    this.post_create = function(req, res) {
        var self = this;
        res.status(200).json({
            organization: null,
            success: true
        });
    }

    this.get_organization = function(req, res) {
        var query = req.query;
        var user = self.getUser(req, res);
        var organization = self.getOrganization(req, res);

        ModelOrganization.findOne({
            where: {
                id: organization.id,
                is_active: true
            }
        }).then(function(result) {
            if (result) {
                var organization = result.dataValues;
                res.status(200).json({
                    organization: self._cleanOrganization(organization),
                    success: true
                });
            } else {
                self.getErrorApi().sendError(1030, 422, res);
            }
        }).catch(function(err) {
            self.getErrorApi().setErrorWithMessage(err.toString(), 500, res);
        });
    }

    this.put_update = function(req, res) {
        var self = this;
        var user = self.getUser(req, res);
        var sessOrganization = self.getOrganization(req, res);
        var putData = req.body;
        var organizationJson = null;
        var chckData = this._verifyInformation(putData);

        if (chckData.isCorrupt) {
            this.getErrorApi().sendError(chckData.errNum, 422, res);
            return;
        }

        ModelOrganization.findOne({
            where: {
                id: sessOrganization.id,
                is_active: true
            }
        }).then(function(result) {
            if (result) {
                var organization = result.dataValues;
                var updates = {};
                var tmpUpdates = {};
                for (var attr in putData) {
                    if (organization.hasOwnProperty(attr) && organization[attr] != putData[attr]) {
                        updates[attr] = putData[attr];
                        tmpUpdates[attr] = putData[attr];
                    }
                }
                organizationJson = mix(result.dataValues).into(tmpUpdates);
                return ModelOrganization.update(updates, {
                    where: {
                        id: organization.id,
                        is_active: true
                    }
                });
            } else {
                return new Promise(function(resolve, reject) {
                    reject({ errNum: 1030, status: 500 });
                });
            }
        }).then(function(didUpdate) {
            if (didUpdate && organizationJson) {
                self._refreshSessionOrganization(req, organizationJson);
                res.status(200).json({
                    organization: self._cleanOrganization(organizationJson),
                    success: true
                });
            } else {
                self.getErrorApi().setErrorWithMessage(1055, 500, res);
            }
        }).catch(function(err) {
            if (err.errNum) {
                self.getErrorApi().sendError(err.errNum, err.status, res);
            } else {
                self.getErrorApi().setErrorWithMessage(err.toString(), 500, res);
            }
        });
    }

    this._verifyInformation = function(organization) {
        var errorNumber = null;
        var isCorrupt = false;

        if (organization.hasOwnProperty('id') || organization.hasOwnProperty('createdAt') ||
            organization.hasOwnProperty('updatedAt') || organization.hasOwnProperty('is_active') ||
            organization.hasOwnProperty('o_uuid') || organization.hasOwnProperty('api_key')) {
            errorNumber = 1034;
        }
        if (errorNumber) {
            isCorrupt = true;
        }
        return {
            errNum: errorNumber,
            isCorrupt: isCorrupt
        }
    }

    this.invitation = function(req, res){
        // Generate a uuid and hash it.
        // verify email isnt in system or at least not active in system.
        // Create employee_invite record.
        // Send the invitation email.
        // Send employee_invite record to front end as response.
        res.status(200).json({
            success: true
        });
    }

    this.getAllInvitation = function(req, res){
        res.status(200).json({
            success: true
        });
    }

    this.cancelInvitation = function(req, res){
        res.status(200).json({
            success: true
        });
    }

    this.getImage = function(req, res) {
        res.status(200).json({
            success: true
        });
    }

    this.postImage = function(req, res) {
        res.status(200).json({
            success: true
        });
    }

    this.updateImage = function(req, res) {
        res.status(200).json({
            success: true
        });
    }
}

module.exports = OrganizationApi;
