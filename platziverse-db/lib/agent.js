'use strict'

// Esta función es para personalizar los metodos/consultar que hara el modelo Agent!
module.exports = function setupAgentService (AgentModel) {
  const findById = (id) => {
    return AgentModel.findById(id)
  }

  return {
    findById
  }
} 