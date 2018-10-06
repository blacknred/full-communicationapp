import Sequelize from 'sequelize';

const ENV = process.env.NODE_ENV || 'development';
const DATABASE_URL = {
    development: process.env.DATABASE_URL,
    test: process.env.DATABASE_TEST_URL,
};

const sequelize = new Sequelize(DATABASE_URL[ENV], {
    dialect: 'postgres',
    operatorsAliases: Sequelize.Op,
    define: {
        underscored: true,
    },
});

const models = {
    User: sequelize.import('./user'),
    Team: sequelize.import('./team'),
    Channel: sequelize.import('./channel'),
    Member: sequelize.import('./member'),
    Message: sequelize.import('./message'),
    DirectMessage: sequelize.import('./directMessage'),
};

Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
