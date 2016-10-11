function AccountController() {
    this.tag = 'accountController';

    this.ApiRouter = {
        login: function(verb, req, res, self) {
            switch (verb) {
                case 'post':
                    getApi('login').login(req, res);
                    break;
                case 'get':
                    getApi('login').getLogin(req, res);
                    break;
                case 'put':
                    self.getErrorApi().sendError(1011, 403, res);
                    break;    
                case 'delete':
                    self.getErrorApi().sendError(1011, 403, res);
                    break;
                default:
                    self.getErrorApi().sendError(1011, 403, res);
                    break;
            }
        },

        registration: function(verb, req, res, self) {
            switch (verb) { 
                case 'post':
                    getApi('registration').registerUser(req, res);
                    break;
                case 'get':
                    getApi('registration').getUserRegistration(req, res);
                    break;
                case 'put':
                    self.getErrorApi().sendError(1011, 403, res);
                    break;  
                case 'delete':
                    self.getErrorApi().sendError(1011, 403, res);
                    break;
                default:
                    self.getErrorApi().sendError(1011, 403, res);
                    break;
            }

        },
        verify: function(verb, req, res, self) {
            switch (verb) {
                case 'post':
                    self.getErrorApi().sendError(1011, 403, res);
                    break;    
                case 'get':
                    self.getErrorApi().sendError(1011, 403, res);
                    break;   
                case 'put':
                    self.getErrorApi().sendError(1011, 403, res);
                    break; 
                case 'delete':
                    self.getErrorApi().sendError(1011, 403, res);
                    break;
                default:
                    self.getErrorApi().sendError(1011, 403, res);
                    break;
            }
        },
        default: function(verb, req, res, self) {
            switch (verb) {
                case 'post':
                    self.getErrorApi().sendError(1011, 403, res);
                    break; 
                case 'get':
                    self.getErrorApi().sendError(1011, 403, res);
                    break;    
                case 'put':
                    self.getErrorApi().sendError(1011, 403, res);
                    break;   
                case 'delete':
                    self.getErrorApi().sendError(1011, 403, res);
                    break;
                default:
                    self.getErrorApi().sendError(1011, 403, res);
                    break;
            }
        }
    }
}

module.exports = AccountController;
