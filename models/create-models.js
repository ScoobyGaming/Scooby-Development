createTables = function(sq) {
    var models = {};
    logger.info('Creating datbase tables and models');
    try {
        models.employee_user = require('./employee_user.js').create(sq);
        models.patron_player = require('./patron_player.js').create(sq);
        models.game = require('./game.js').create(sq);
        models.game_type = require('./game_type.js').create(sq);
        models.game_histroy = require('./game_histroy.js').create(sq);
        models.payout = require('./payout.js').create(sq);
        models.organization = require('./organization.js').create(sq);
        models.organization_type = require('./organization_type.js').create(sq);
        models.edit_type = require('./edit_type.js').create(sq);
        models.server_log = require('./server_log.js').create(sq);

    } catch (error) {
        logger.error('Failed to create table ' + error.toString());
    }

    return models;
}

module.exports = {
    init: function(sq) {
        if (!sq) {
            logger.error('Failed to setup database!');
            return;
        }
        return createTables(sq);
    }
}
