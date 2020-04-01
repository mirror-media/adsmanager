const { access } = require('./Permission.js');
const { Select, Text, Relationship, DateTime, Integer } = require('@keystonejs/fields');
 
module.exports = {
  fields: {
	dailystamp: { label: "每日版位ID", type: Relationship, many: false, ref: 'DailyStamp',  isRequired: true},
    amount: { label: "總金額", type: Integer, isRequired: true},
	impression: { label: "手動曝光量", type: Integer },
	remaining: { label: "剩餘曝光量", type: Integer },
  },
  access: {
    read: access.everyone,
    update: access.userIsUsers,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
    auth: true,
  },
};
