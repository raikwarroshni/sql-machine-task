const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("test","root","",{
  HOST: "localhost",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }

});

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      len: [10]
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  otp : {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  createdAt: {
    type: Sequelize.DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: Sequelize.DATE,
    field: 'updated_at'
  }
});

const FriendRequests = sequelize.define('friendrequest', {
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending'
  },
  requesterid: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  requestid: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  createdAt: {
    type: Sequelize.DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: Sequelize.DATE,
    field: 'updated_at'
  }
});

User.belongsToMany(User, { through: FriendRequests, as: 'requestSender', foreignKey: 'requesterid' });
User.belongsToMany(User, { through: FriendRequests, as: 'requestReceiver', foreignKey: 'requestid' });
FriendRequests.belongsTo(User, { through: FriendRequests, as: 'requesterData', foreignKey: 'requesterid' });
FriendRequests.belongsTo(User, { through: FriendRequests, as: 'requestData', foreignKey: 'requestid' });


User.hasMany(FriendRequests, { as: 'friendRequestData', foreignKey: 'requestid' });
FriendRequests.hasMany(User, { as: 'friendRequestSender', foreignKey: 'id' });


module.exports = {
  User,
  FriendRequests,
};
