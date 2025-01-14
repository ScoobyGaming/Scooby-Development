"use strict";

module.exports = function(sequelize, DataTypes) {
    var GameType = sequelize.define("game_type", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "Name of the game type"
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: "Description of game type"
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: "Is this game type active or not."
        }
    }, {
        freezeTableName: true,
        classMethods: { associate: function(models) {
            //none;
        }}
    });

    return GameType;
};
