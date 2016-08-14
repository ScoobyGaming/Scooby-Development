module.exports = {
    create: function(sequelize) {
        var EmployeeUser = sequelize.define('EMPLOYEE_USER', {
            firstName: {
                type: Sequelize.STRING,
                field: 'first_name'
            },
            lastName: {
                type: Sequelize.STRING,
                field: 'last_name'
            },
            userName: {
                type: Sequelize.STRING,
                field: 'username'
            },
            emailAddress:{
                type: Sequelize.STRING,
                field: 'email_address'
            }
        }, {
            freezeTableName: true // Model tableName will be the same as the model name
        }).sync();

        return EmployeeUser;
    }
}
