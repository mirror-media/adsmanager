const { access } = require('./Permission.js');
const { Select, Text, Relationship, DateTime, Integer, Float } = require('@keystonejs/fields');
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
    	commision_status: { label: "狀態", type: Select, options: status_options, isRequired: true},
		order: {
			label: "預定量",
			type: Integer,
			isRequired: true,
			hooks: {
				validateInput: async (operation, existingItem, originalInput, resolvedData, context, addFieldValidationError) => {
					const daily_model = keystone.lists.Dailystamp;
					if ( operation.operation == 'update') {
						const daily_id = operation.existingItem.dailystamp;
						const currentRemaining = await daily_model.adapter.findById(daily_id); 
						const remain = currentRemaining.remaining;
						if (remain + operation.existingItem.order - operation.resolvedData.order < 0) {
							operation.addFieldValidationError("數量不足");
						}
					} else {
						const daily_id = operation.resolvedData.dailystamp;
						const currentRemaining = await daily_model.adapter.findById(daily_id); 
						const remain = currentRemaining.remaining;
						if (remain - operation.resolvedData.order < 0) {
							operation.addFieldValidationError("數量不足");
						}
					}
				},
				afterChange: async (operation, existingItem, originalInput, updateItem, context) => {
					const daily_model = keystone.lists.Dailystamp;
					if ( operation.operation == 'update') {
						daily_id = operation.existingItem.dailystamp;
						currentRemaining = await daily_model.adapter.findById(daily_id); 
						remain = currentRemaining.remaining + operation.existingItem.order - operation.originalInput.order;
					} else {
						daily_id = operation.originalInput.dailystamp.connect.id;
						currentRemaining = await daily_model.adapter.findById(daily_id); 
						remain = currentRemaining.remaining - operation.originalInput.order;
					}
					if (remain > 0) {
						updated = await daily_model.adapter.update(daily_id, {
							...currentRemaining,
							remaining: remain, 
						});
					} else if (remain < 0) {
						operation.addFieldValidationError("數量不足");
					}
				},
				afterDelete: async (operation, existingItem, context, actions) => {
					const daily_model = keystone.lists.Dailystamp;
					const daily_id = operation.existingItem.dailystamp;
					const currentRemaining = await daily_model.adapter.findById(daily_id); 
					const remain = currentRemaining.remaining + operation.existingItem.order;
					updated = await daily_model.adapter.update(daily_id, {
						...currentRemaining,
						remaining: remain, 
					});
				},
			},
		},
		date: { label: "刊登日期", type: DateTime, yearRangeFrom: 2020, yearRangeTo: 2022, yearPickerType: 'select', isRequired: true},
		//orderstatus: { label: "狀態", type: Text },
		issue: { label: "期數（天數）", type: Integer, isRequired: true },
		discount: { label: "折扣", type: Float },
		price: { label: "售價", type: Integer, isRequired: true },
		charged: { label: "實收金額", type: Integer, isRequired: true },
		remark: { label: "備註", type: Text },
		ordername: { label: "訂單", type: Relationship, ref: 'Order' },
	},
	access: {
		read: access.userIsPlanner,
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
}
