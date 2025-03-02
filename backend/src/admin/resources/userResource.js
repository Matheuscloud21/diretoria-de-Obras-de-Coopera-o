import { User } from '../../models/user.js';

export const userResource = {
  resource: User,
  options: {
    navigation: {
      name: 'Gestão de Usuários',
      icon: 'User',
    },
    properties: {
      _id: {
        isVisible: {
          list: false,
          filter: false,
          show: true,
          edit: false,
        },
      },
      email: {
        position: 1,
        isTitle: true,
      },
      nome: {
        position: 2,
      },
      cargo: {
        position: 3,
      },
      ativo: {
        position: 4,
        type: 'boolean',
      },
      dataCriacao: {
        position: 5,
        isVisible: {
          list: true,
          filter: true,
          show: true,
          edit: false,
        },
      },
      createdAt: {
        isVisible: false,
      },
      updatedAt: {
        isVisible: false,
      },
    },
    actions: {
      new: {
        isAccessible: true,
      },
      edit: {
        isAccessible: true,
      },
      delete: {
        isAccessible: true,
      },
      bulkDelete: {
        isAccessible: true,
      },
    },
  },
};