const {Tarefas} = require('../models/tarefas.js')

const list = async () => {
   const list = await Tarefas.findAll()
   return list
}

const listId = async (req) => {
    const list = await Tarefas.findByPk(req)
    return list
}

const create = async (req) => {
    await Tarefas.create(req)
}

const deletar = async (req) => {
    await Tarefas.destroy({where: {id: req}})
}

const update = async (id, data) => {
    await Tarefas.update(data, {where: {id: id}})
}

module.exports = {
    list,
    listId,
    create,
    deletar,
    update
}