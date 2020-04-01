const { access } = require('./Permission.js');
const { Select, Text, Relationship, DateTime, Integer } = require('@keystonejs/fields');
 
module.exports = {
  fields: {
    amount: { label: "總金額", type: integer, yearPickerType: 'auto', isRequired: true},
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
