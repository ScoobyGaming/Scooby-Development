"use strict";
/*  Title: Email-api
    Author:  Hubbert
    Date: Oct 23 2016
    Comment: 
        This is the api which is used for all email stuff.
*/


function EmailApi() {
    this.tag = 'email-api';
    var Promise = getPromise();
    var eTemplate = getEmailTemplate();
    var ModelRegistrationUser = models.registration_user;

    this.resetPassword = function(user_email, token) {
        if (!user_email || !token) {
            logger.error('No user_email or token was provided to the reset api');
        }
        var emailOptions = {
            from: '"Do-Not-Reply" <do-not-reply@counterDraft.com>',
            to: user_email,
            subject: 'Reset Password'
        }
        // console.log(getEmailTransport());

        // var sendResetPassword = getEmailTransport().templateSender(
        //     new eTemplate('templates/email/reset-password.html'));

        // console.log(sendResetPassword);

        // emailTransport.sendMail(emailOptions,
        //     function(err, data) {
        //         if (err) {
        //             var eo = {
        //                 email_address: user_email,
        //                 error: 9902
        //             }
        //             logger.error(self.getErrorApi().getErrorMsg(9902), {
        //                 error: eo
        //             });
        //         } else {
        //             logger.info('Reset password email sent to', { email_address: user_email });
        //         }
        //     });
    }

    this.registration = function(user_email) {
        var currentTime = new Date();

        new Promise(function(resolve, reject) {
            require('crypto').randomBytes(48, function(err, buffer) {
                var genToken = buffer.toString('hex');
                if (genToken) {
                    return resolve(genToken);
                } else {
                    return reject(err);
                }
            });
        }).then(function(token) {
            var vUntil = currentTime.setDate(currentTime.getDate() + 14);
            return ModelRegistrationUser.create({
                email_address: user_email,
                token: token,
                valid_until: vUntil
            });
        }).then(function(registration_user) {
            if (!registration_user) {
                var eo = {
                    email_address: user_email,
                    error: 9901
                }
                logger.error(self.getErrorApi().getErrorMsg(9901), {
                    error: eo
                });
                return new Promise(function(resolve, reject) {
                    return reject(eo);
                });
            }
            return new Promise(function(resolve, reject) {
                //TODO: fix this so we can use templates and look pretty;
                // var sendRegistrationConfirmation = emailTransport.templateSender(new eTemplate('templates/email/registration-confirmation.html'), sendRegistrationConfirmationEmailOptions);

                // sendRegistrationConfirmation({

                //     }, {

                //     },
                //     function(err, data) {
                //         if (err) {
                //             var eo = {
                //                 email_address: user_email,
                //                 error: errorNumberEmail
                //             }
                //             logger.error(errorMsgEmail, {
                //                 error: eo
                //             });
                //             return reject(err);
                //         } else {
                //             logger.info('Email confirmation sent to', { email_address: user_email });
                //             return resolve(data);
                //         }
                //     });

                var url_link;
                if (global.config.environment === 'production') {
                    url_link = 'http://' + config.server.ip + '/confirmation?token=' + registration_user.dataValues.token;
                } else {
                    url_link = 'http://' + config.server.ip + ':' + config.server.port + '/confirmation?token=' + registration_user.dataValues.token;
                }

                var sendRegistrationConfirmationEmailOptions = {
                    from: '"Do-Not-Reply" <do-not-reply@counterDraft.com>',
                    to: user_email,
                    subject: 'Email Confirmation',
                    html: '<div>Welcome to Counter Draft, a Fantasy sport experience!</div><br>' +
                        '<div>Please click on the link to confirmation your email and account</div><br>' +
                        '<a href="' + url_link + '">Confirmation</a>'
                };

                getEmailTransport().sendMail(sendRegistrationConfirmationEmailOptions, function(err, data) {
                    if (err) {
                        var eo = {
                            email_address: user_email,
                            error: 9902
                        }
                        logger.error(self.getErrorApi().getErrorMsg(9902), {
                            error: eo
                        });
                        return reject(err);
                    } else {
                        logger.info('Email confirmation sent to', { email_address: user_email });
                        return resolve(data);
                    }
                });
            });
        }).catch(function(err) {
            logger.error(err.toString(), { error: err });
        });
    }
}

module.exports = EmailApi;
