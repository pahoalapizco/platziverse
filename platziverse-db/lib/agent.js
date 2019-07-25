'use strict'

// Esta función es para personalizar los metodos/consultar que hara el modelo Agent!
module.exports = function setupAgentService (AgentModel) {
  async function createOrUpdate (agent) {
     const cond = { // condición que se envia la instancia de Sequelize para hacer una consulta a la BD con el modelo
       where: {
         uuid: agent.uuid
       }
     }
  
    const existingAgent = await AgentModel.findOne(cond)

    if (existingAgent) {
      const update = await AgentModel.update(agent, cond)
      // Regresa el agent actualizado de BD, sino fue actualizado entonces regresa el registro que ya existia
      return update ? AgentModel.findOne(cond) : existingAgent
    }

    const result = await AgentModel.create(agent)
    return result.toJSON()
  }

  const findById = (id) => {
    return AgentModel.findById(id)
  }

  return {
    createOrUpdate,
    findById
  }
}
