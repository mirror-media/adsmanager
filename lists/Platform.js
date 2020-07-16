const { access } = require('./Permission.js');
const { Select, Text, Relationship, DateTime, Integer } = require('@keystonejs/fields');
const { atTracking } = require('@keystonejs/list-plugins');
 
const status_options = [
  { value: 'active', label: "active" },
  { value: 'inactive', label: "inactive" },
  { value: 'archived', label: "archived" },
];

module.exports = {
  label: "平台",
  plural: "平台",
  fields: {
    slug: { type: Text, isRequired: true },
    title: { label: "標題", type: Text, isRequired: true},
    section_status: { label: '狀態', type: Select, options: status_options, isRequired: true, default: 'inactive' },
  },
  access: {
    read: access.userIsAdmin,
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
  labelField: 'slug',
};
