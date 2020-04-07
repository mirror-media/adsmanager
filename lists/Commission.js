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
			afterChange: updateamount.
		},
	},
	orderstatus: { label: "狀態", type: Text },
  },
  access: {
    read: access.everyone,
    update: access.userIsUsers,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
    auth: true,
  },
};
