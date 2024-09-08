const {Colunas} = require('../models/colunas.js')

const list = async () => {
   const list = await Colunas.findAll()
   return list
}

const listId = async (req) => {
    const list = await Colunas.findByPk(req)
    return list
}

const create = async (req) => {
    await Colunas.create(req)
}

const deletar = async (req) => {
    await Colunas.destroy({where: {id: req}})
}

const update = async (id, data) => {
    await Colunas.update(data, {where: {id: id}})
}

module.exports = {
    list,
    listId,
    create,
    deletar,
    update
}