const { access } = require('./Permission.js');
const { Text, Select, Checkbox } = require('@keystonejs/fields');
const { atTracking } = require('@keystonejs/list-plugins');

const status_options = [
  { value: 'active', label: "active" },
  { value: 'inactive', label: "inactive" },
];

module.exports = { 
  label: "客戶",
  plural: "客戶",
  fields: {
    name: { label: "廣告客戶", type: Text, isRequired: true },
    resale: { label: "代理商", type: Text, isRequired: false },
    inv_title: { label: "發票抬頭", type: Text, isRequired: true},
    inv_number: { label: "發票統編", type: Text, isRequired: true},
    inv_address: { label: "發票地址", type: Text, isRequired: true},
    inv_receiver: { label: "發票收件人", type: Text, isRequired: true},
    inv_method: { label: "發票開立方式", type: Text, isRequired: false},
    client_status: { label: "狀態", type: Select, options: status_options, isRequired: true},
    contact: { label: "聯絡人姓名", type: Text, isRequired: false },
    contact_email: { label: "聯絡人 Email", type: Text, isRequired: false },
    contact_tel: { label: "聯絡人電話", type: Text, isRequired: false },
  },
  access: {
    read: access.everyone,
    update: access.userIsExecutor,
    create: access.userIsExecutor,
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
};
