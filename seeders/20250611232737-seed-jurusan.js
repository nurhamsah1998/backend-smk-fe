"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("jurusan", [
      {
        nama: "Teknik Komputer Dan Jaringan",
        kode_jurusan: "TKJ",
      },
      {
        nama: "Teknik Kendaraan Ringan",
        kode_jurusan: "TKR",
      },
      {
        nama: "Akuntansi",
        kode_jurusan: "AKT",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
