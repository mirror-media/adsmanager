const { access } = require('./Permission.js');
const { Select, Text, Relationship, DateTime, Integer } = require('@keystonejs/fields');
const { atTracking } = require('@keystonejs/list-plugins');
const { byTracking } = require('@keystonejs/list-plugins');
 
const options = [
  { value: 'start', label: "開始" },
  { value: 'end', label: "結束" },
];
module.exports = {
  fields: {
    adname: { label: "廣告名稱", type: Text, isRequired: true},
    clientname: { label: "客戶ID", type: Relationship, many: false, ref: 'Client',  isRequired: true},
    username: { label: "使用者ID", type: Relationship, many: false, ref: 'User',  isRequired: true},
    start_date: { label: "開始日期", type: DateTime, yearRangeFrom: 2015, yearRangeTo: 2022, yearPickerType: 'auto', isRequired: true},
    end_date: { label: "結束日期", type: DateTime, yearRangeFrom: 2015, yearRangeTo: 2022, yearPickerType: 'auto', isRequired: true},
    period: { label: "期數／天數", type: Integer, isRequired: false},
    status: { label: "狀態", type: Select, options, isRequired: true},
  },
  access: {
    read: access.everyone,
    update: access.userIsUsers,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
    auth: true,
  },
  plugins: {
    atTracking({
      createdAtField: "createdAt",
      updatedAtField: "updatedAt",
      format: "YYYY/MM/DD h:mm A",
    }),
	byTracking({
      ref: "User",
    }),
  }
};
