import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Role = sequelize.define('Role', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.ENUM('STUDENT', 'LECTURER', 'ADMIN'), unique: true, allowNull: false }
}, { tableName: 'roles' });

export const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  fullName: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(160), unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('ACTIVE', 'LOCKED'), defaultValue: 'ACTIVE' }
}, { tableName: 'users' });

export const Subject = sequelize.define('Subject', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(120), unique: true, allowNull: false },
  description: DataTypes.TEXT
}, { tableName: 'subjects' });

export const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(120), unique: true, allowNull: false },
  description: DataTypes.TEXT
}, { tableName: 'categories' });

export const LearningResource = sequelize.define('LearningResource', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  keywords: DataTypes.STRING(255),
  accessLevel: { type: DataTypes.ENUM('AUTHENTICATED', 'LECTURER_ONLY'), defaultValue: 'AUTHENTICATED' },
  status: { type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'), defaultValue: 'PENDING' },
  rejectionReason: DataTypes.STRING(500),
  downloadCount: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 }
}, { tableName: 'learning_resources' });

export const ResourceFile = sequelize.define('ResourceFile', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  originalName: { type: DataTypes.STRING(255), allowNull: false },
  storedName: { type: DataTypes.STRING(255), allowNull: false },
  // `path` is retained for backward compatibility with files created before
  // database-backed storage was introduced.
  path: { type: DataTypes.STRING(500), allowNull: true },
  data: { type: DataTypes.BLOB('long'), allowNull: true },
  mimeType: { type: DataTypes.STRING(120), allowNull: false },
  extension: { type: DataTypes.STRING(20), allowNull: false },
  size: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false }
}, { tableName: 'resource_files' });

export const Favorite = sequelize.define('Favorite', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true }
}, { tableName: 'favorites', indexes: [{ unique: true, fields: ['user_id', 'resource_id'] }] });

export const DownloadHistory = sequelize.define('DownloadHistory', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  downloadedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'download_histories', updatedAt: false });

export const Approval = sequelize.define('Approval', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  action: { type: DataTypes.ENUM('APPROVED', 'REJECTED'), allowNull: false },
  reason: DataTypes.STRING(500)
}, { tableName: 'approvals' });

export const ActivityLog = sequelize.define('ActivityLog', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  action: { type: DataTypes.STRING(100), allowNull: false },
  details: DataTypes.TEXT
}, { tableName: 'activity_logs', updatedAt: false });

Role.hasMany(User, { foreignKey: { name: 'roleId', allowNull: false }, onDelete: 'RESTRICT' });
User.belongsTo(Role, { foreignKey: 'roleId', onDelete: 'RESTRICT' });
User.hasMany(LearningResource, { as: 'uploadedResources', foreignKey: { name: 'uploaderId', allowNull: false }, onDelete: 'RESTRICT' });
LearningResource.belongsTo(User, { as: 'uploader', foreignKey: 'uploaderId', onDelete: 'RESTRICT' });
Subject.hasMany(LearningResource, { foreignKey: { name: 'subjectId', allowNull: false }, onDelete: 'RESTRICT' });
LearningResource.belongsTo(Subject, { foreignKey: 'subjectId', onDelete: 'RESTRICT' });
Category.hasMany(LearningResource, { foreignKey: { name: 'categoryId', allowNull: false }, onDelete: 'RESTRICT' });
LearningResource.belongsTo(Category, { foreignKey: 'categoryId', onDelete: 'RESTRICT' });
LearningResource.hasOne(ResourceFile, { as: 'file', foreignKey: { name: 'resourceId', allowNull: false }, onDelete: 'CASCADE' });
ResourceFile.belongsTo(LearningResource, { foreignKey: 'resourceId' });
User.belongsToMany(LearningResource, { through: Favorite, as: 'favoriteResources', foreignKey: 'userId', otherKey: 'resourceId' });
LearningResource.belongsToMany(User, { through: Favorite, as: 'favoritedBy', foreignKey: 'resourceId', otherKey: 'userId' });
User.hasMany(DownloadHistory, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' });
LearningResource.hasMany(DownloadHistory, { foreignKey: { name: 'resourceId', allowNull: false }, onDelete: 'CASCADE' });
DownloadHistory.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
DownloadHistory.belongsTo(LearningResource, { foreignKey: 'resourceId', onDelete: 'CASCADE' });
LearningResource.hasMany(Approval, { foreignKey: { name: 'resourceId', allowNull: false }, onDelete: 'CASCADE' });
Approval.belongsTo(LearningResource, { foreignKey: 'resourceId', onDelete: 'CASCADE' });
User.hasMany(Approval, { as: 'approvalActions', foreignKey: { name: 'adminId', allowNull: false }, onDelete: 'RESTRICT' });
Approval.belongsTo(User, { as: 'admin', foreignKey: 'adminId', onDelete: 'RESTRICT' });
User.hasMany(ActivityLog, { foreignKey: { name: 'userId', allowNull: true }, onDelete: 'SET NULL' });
ActivityLog.belongsTo(User, { foreignKey: 'userId', onDelete: 'SET NULL' });

export { sequelize };
