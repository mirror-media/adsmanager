const { access } = require('./Permission.js');
const { Select, Text, Relationship, DateTime, Integer } = require('@keystonejs/fields');
 
module.exports = {
  fields: {
    dailyid: { type: Text, isRequired: true },
    stampid: { label: "版位ID", type: Relationship, many: false, ref: 'Stamp',  isRequired: true},
    updateddate: { label: "數據時間", type: DateTime, yearPickerType: 'auto', isRequired: true},
	estimate: {label: "預估曝光量", type: Integer, isRequired: false},
	impression: { label: "手動曝光量", type: Integer, isRequired: false },
	remaining: { label: "剩餘曝光量", type: Integer, isRequired: false },
  },
  access: {
    read: access.everyone,
    update: access.userIsUsers,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
    auth: true,
  },
  labelField: 'dailyid',
};
