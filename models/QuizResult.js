const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Quiz = require('./Quiz');
const User = require('./User');

const QuizResult = sequelize.define('QuizResult', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  quizId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Quiz,
      key: 'id',
    },
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  submittedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'QuizResults',
  timestamps: false, // Only submittedAt, no createdAt/updatedAt
});

Quiz.hasMany(QuizResult, { foreignKey: 'quizId' });
QuizResult.belongsTo(Quiz, { foreignKey: 'quizId' });
User.hasMany(QuizResult, { foreignKey: 'userId' });
QuizResult.belongsTo(User, { foreignKey: 'userId' });

module.exports = QuizResult;