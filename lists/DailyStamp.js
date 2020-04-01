const { access } = require('./Permission.js');
const { Select, Text, Relationship, DateTime, Integer } = require('@keystonejs/fields');
 
module.exports = {
  fields: {
    id: { type: Text, isRequired: true },
    data_date: { label: "數據時間", type: DateTime, yearPickerType: 'auto', isRequired: true},
	impression: { label: "手動曝光量", type: integer },
	remaining: { label: "剩餘曝光量", type: integer },
  },
  access: {
    read: access.everyone,
    update: access.userIsUsers,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
    auth: true,
  },
};
