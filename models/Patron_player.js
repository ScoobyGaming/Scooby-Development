"use strict";
module.exports = function(sequelize, DataTypes) {
    var PatronPlayer = sequelize.define('patron_player', {
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "Patron's first name"
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "Patron's last name"
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "Patron's username"
        },
        email_address: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "Patron's email address"
        },
        password: {
            type: DataTypes.STRING(64),
            comment: "Patron's hashed password"
        },
        organization_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "Defines the organization."
        },
        phone: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "phone number for patron."
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: "Is the patron active or not"
        },
        is_email_confirmed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: "If false we have yet to confirmed the email_address."
        },
        p_uuid: {
            type: DataTypes.UUID,
            allowNull: true,
            defaultValue: DataTypes.UUIDV4,
            comment: "The UUID which is used to save images and user data in the cloud."
        },
        retrieve_token: {
            type: DataTypes.STRING(64),
            allowNull: true,
            comment: "Hash token used for reseting password."
        },
        retrieve_expiration: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: "Date/time which retrieve_token will expire."
        },
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            comment: "Date of brith for the patron."
        },
        street_number: {
            type: DataTypes.STRING(16),
            allowNull: true,
            comment: "address field for patron."
        },
        route: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "address field for patron."
        },
        locality: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "address field for patron."
        },
        administrative_area_level_1: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "address field for patron."
        },
        administrative_area_level_2: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "address field for patron."
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "address field for patron."
        },
        postal_code: {
            type: DataTypes.STRING(16),
            allowNull: true,
            comment: "address field for patron."
        }
    }, {
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                PatronPlayer.belongsTo(models.organization, { foreignKey: 'organization_id', target: 'id' });
            }
        }
    });

    return PatronPlayer;
}
