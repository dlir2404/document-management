'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        password: '$10$v0KztjP1LhiiPhBX3tVoUeLf.taTiZi77kvebwNIMq3MnQXLtifXC',
        role: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'leader',
        password: '$10$k4Vg/782IH.1GAc6GRUivuUDn40rTjlp5v2jN8iiS0fBdIRc.Gc1q',
        role: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'specialist',
        password: '$10$iiQgfI2hhm86mKfsiNMPgex.RyR8KQjwG0wjqIi/7dcxej8XzDi6q',
        role: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'office-clerk',
        password: '$10$bfXYF5Np7lPE3n91fcs0LuMLJaW8Q1LsMYOq7Y8AvKFDzpp/8teQW',
        role: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
