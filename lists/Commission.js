const { access } = require('./Permission.js');
const { Select, Text, Relationship, DateTime, Integer } = require('@keystonejs/fields');
const { Keystone } = require('@keystonejs/keystone');

const updateamount = async (_, { dailystamp, order }) => {
  const dailyamount = keystone.lists.Dailystamp;
  const currentItem = await dailyamount.adapter.findById(dailystamp);
  const newItem = await dailyamount.adapter.update(dailyamount, {
    ...currentItem,
    remaining: (currnetItem.remaining || 0) - order,
  });
  return newItem;
};

module.exports = {
  fields: {
	dailystamp: { label: "每日版位ID", type: Relationship, many: false, ref: 'Dailystamp',  isRequired: true},
    order: { 
		label: "預定量", 
		type: Integer, 
		isRequired: true,
		hooks: {
			afterChange: updateamount,
		},
	},
    date: { label: "刊登日期", type: DateTime, yearRangeFrom: 2020, yearRangeTo: 2022, yearPickerType: 'select', isRequired: true},
	//orderstatus: { label: "狀態", type: Text },
	issue: { label: "期數（天數）", type: Integer, isRequired: true },
	discount: { label: "折扣", type: Float },
	price: { label: "售價", type: Integer, isRequired: true },
	charged: { label: "實收金額", type: Integer, isRequired: true },
	remark: { label: "備註", type: Text },
  },
  access: {
    read: access.everyone,
    update: access.userIsUsers,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
    auth: true,
  },
};
