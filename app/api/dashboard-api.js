"use strict";
/*  Title: Dashboard-api
    Author:  Hubbert
    Date: Sep 23 2016
    Comment: 
        This is the api which is used for all dashboard calls.
*/

/* duration = 'week' | 'day' | 'month'  | 'year' | 'max';
    {
        duration: string,
    }
 */

function DashboardApi() {
    this.tag = 'dashboard-api';

    this.getGameChartDate = function(req, res) {
        var self = this;
        var duration = 'week';
        var numOfOutput = 7;
        var list = {};

        var model = models.game;

        if (!req.query.duration) {
            this.getErrorApi().sendError(1012, 400, res);
            return;
        } else {
            duration = req.query.duration;
        }

        switch (duration) {
            case 'day':
                for (var x = 0; x < numOfOutput; x++) {
                    var d = new Date();
                    var date = d.setHours(d.getHours() - (x * 3.4));
                    list[x] = date;
                }
                _getChart(list, numOfOutput, model, res);
                break;

            case 'week':
                for (var x = 0; x < numOfOutput; x++) {
                    var ts = new Date().setDate(new Date().getDate() - x);
                    list[x] = ts;
                }
                _getChart(list, numOfOutput, model, res);
                break;

            case 'month':
                for (var x = 0; x < numOfOutput; x++) {
                    var ts = new Date().setDate(new Date().getDate() - (x * 7));
                    list[x] = ts;
                }
                _getChart(list, numOfOutput, model, res);
                break;

            case 'year':
                for (var x = 0; x < numOfOutput; x++) {
                    var d = new Date();
                    var date = d.setMonth(d.getMonth() - x);
                    list[x] = date;
                }
                _getChart(list, numOfOutput, model, res);
                break;

            case 'max':
                for (var x = 0; x < numOfOutput; x++) {
                    var d = new Date();
                    var date = d.setFullYear(d.getFullYear() - x);
                    list[x] = date;
                }
                _getChart(list, numOfOutput, model, res);
                break;

            default:
                this.getErrorApi().sendError(1012, 400, res);
                break;
        }
    }

    this.getPatronChartData = function(req, res) {
        var self = this;
        var duration = 'week';
        var numOfOutput = 7;
        var list = {};

        var model = models.patron_player;

        if (!req.query.duration) {
            this.getErrorApi().sendError(1012, 400, res);
            return;
        } else {
            duration = req.query.duration;
        }

        switch (duration) {
            case 'day':
                for (var x = 0; x < numOfOutput; x++) {
                    var d = new Date();
                    var date = d.setHours(d.getHours() - (x * 3.4));
                    list[x] = date;
                }
                _getChart(list, numOfOutput, model, res);
                break;

            case 'week':
                for (var x = 0; x < numOfOutput; x++) {
                    var ts = new Date().setDate(new Date().getDate() - x);
                    list[x] = ts;
                }
                _getChart(list, numOfOutput, model, res);
                break;

            case 'month':
                for (var x = 0; x < numOfOutput; x++) {
                    var ts = new Date().setDate(new Date().getDate() - (x * 7));
                    list[x] = ts;
                }
                _getChart(list, numOfOutput, model, res);
                break;

            case 'year':
                for (var x = 0; x < numOfOutput; x++) {
                    var d = new Date();
                    var date = d.setMonth(d.getMonth() - x);
                    list[x] = date;
                }
                _getChart(list, numOfOutput, model, res);
                break;

            case 'max':
                for (var x = 0; x < numOfOutput; x++) {
                    var d = new Date();
                    var date = d.setFullYear(d.getFullYear() - x);
                    list[x] = date;
                }
                _getChart(list, numOfOutput, model, res);
                break;

            default:
                this.getErrorApi().sendError(1012, 400, res);
                break;
        }
    }

    var _getChart = function(list, numOfOutput, Model, res) {
        Model.findAndCountAll({
            where: {
                createdAt: {
                    $lte: new Date(list[0])
                }
            }
        }).then(function(result) {
            list[0] = {
                date_ts: list[0],
                count: result.count
            }
            return Model.findAndCountAll({
                where: {
                    createdAt: {
                        $lte: new Date(list[1])
                    }
                }
            });
        }).then(function(result) {
            list[1] = {
                date_ts: list[1],
                count: result.count
            }
            return Model.findAndCountAll({
                where: {
                    createdAt: {
                        $lte: new Date(list[2])
                    }
                }
            });
        }).then(function(result) {
            list[2] = {
                date_ts: list[2],
                count: result.count
            }
            return Model.findAndCountAll({
                where: {
                    createdAt: {
                        $lte: new Date(list[3])
                    }
                }
            });
        }).then(function(result) {
            list[3] = {
                date_ts: list[3],
                count: result.count
            }
            return Model.findAndCountAll({
                where: {
                    createdAt: {
                        $lte: new Date(list[4])
                    }
                }
            });
        }).then(function(result) {
            list[4] = {
                date_ts: list[4],
                count: result.count
            }
            return Model.findAndCountAll({
                where: {
                    createdAt: {
                        $lte: new Date(list[5])
                    }
                }
            });
        }).then(function(result) {
            list[5] = {
                date_ts: list[5],
                count: result.count
            }
            return Model.findAndCountAll({
                where: {
                    createdAt: {
                        $lte: new Date(list[6])
                    }
                }
            });
        }).then(function(result) {
            list[6] = {
                date_ts: list[6],
                count: result.count
            }
            res.status(200).json({
                count: list,
                success: true
            });
        });
    }
}

module.exports = DashboardApi;