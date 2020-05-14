const { access } = require('./Permission.js');
const { Select, Text, Relationship, DateTime, Integer } = require('@keystonejs/fields');
const { atTracking } = require('@keystonejs/list-plugins');
 
module.exports = {
  label: "版位庫存",
  plural: "版位庫存",
  fields: {
    dailyid: { type: Text, isRequired: true },
    stampid: { label: "版位ID", type: Relationship, many: false, ref: 'Stamp',  isRequired: true},
    updateddate: { label: "數據時間", type: DateTime, yearPickerType: 'auto', isRequired: true},
	estimate: {label: "預估曝光量", type: Integer, isRequired: false},
	impression: { label: "手動曝光量", type: Integer, isRequired: false },
	remaining: { label: "剩餘曝光量", type: Integer, isRequired: false },
	real_impression: { label: "實際曝光數", type: Integer, isRequired: false },
  },
  access: {
    read: access.everyone,
    update: access.userIsAdmin,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
    auth: true,
  },
  plugins: [
	atTracking({
	  createdAtField: "createAt",
	  updatedAtField: "updateAt",
	  format: "YYYY/MM/DD h:mm A",
	}),
  ],
  labelField: 'dailyid',
};
