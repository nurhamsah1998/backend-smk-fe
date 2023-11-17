import { Sequelize } from "sequelize";
import database from "../Configuration/database.js";
import { siswaAuth } from "./siswa.js";
import { campaign } from "./campaign.js";

const { DataTypes } = Sequelize;

export const responseCampaign = database.define(
  "response_campaign",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    text: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    siswa_id: {
      type: DataTypes.UUID,
      defaultValue: "",
    },
    campaign_id: {
      type: DataTypes.UUID,
      defaultValue: "",
    },
  },
  { freezeTableName: true }
);

siswaAuth.hasOne(responseCampaign, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "siswa_id",
});
responseCampaign.belongsTo(siswaAuth, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "siswa_id",
});
campaign.hasMany(responseCampaign, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "campaign_id",
});
responseCampaign.belongsTo(campaign, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "campaign_id",
});
