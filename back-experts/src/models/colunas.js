const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js')
const { Tarefas } = require('../models/tarefas.js')


const Colunas = sequelize.define('imagens', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true
});

Colunas.hasMany(Tarefas, { foreignKey: 'coluna_id' });
Tarefas.belongsTo(Colunas);

module.exports = {Colunas}