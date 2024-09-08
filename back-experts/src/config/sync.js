const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const Usuarios = require('../models/usuarios');
const {Produtos} = require('../models/produto_categoria');
const {Categorias} = require('../models/produto_categoria');
const imagens = require('../models/imagem');
const opcoes = require('../models/opcoes');

(async () => {
    try {
        await sequelize.sync();
        console.log('Tabelas sincronizadas com sucesso.');
    } catch (error) {
        console.error('Erro ao sincronizar as tabelas:', error);
    }
})();

module.export