const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Quiz = require('./Quiz');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quizId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Quiz,
      key: 'id',
    },
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  optionA: {
    type: DataTypes.STRING(255),
  },
  optionB: {
    type: DataTypes.STRING(255),
  },
  optionC: {
    type: DataTypes.STRING(255),
  },
  optionD: {
    type: DataTypes.STRING(255),
  },
  correctOption: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
}, {
  tableName: 'Questions',
  timestamps: true,
});

Quiz.hasMany(Question, { foreignKey: 'quizId' });
Question.belongsTo(Quiz, { foreignKey: 'quizId' });

module.exports = Question;