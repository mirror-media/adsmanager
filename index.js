const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { Select, Text, Checkbox, Password, Relationship, Integer, DateTime, Float } = require('@keystonejs/fields');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { atTracking } = require('@keystonejs/list-plugins');
const initialiseData = require('./initial-data');
const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const { access } = require('lists/Permission.js');
const PROJECT_NAME = "sales";
const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(),
  onConnect: initialiseData,
});
// Access control functions
const userIsAdmin = ({ authentication: { item: user } }) => Boolean(user && user.isAdmin);
const userOwnsItem = ({ authentication: { item: user } }) => {
  if (!user) {
    return false;
  }
  return { id: user.id };
};
const userIsAdminOrOwner = auth => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};
const status_options = [
  { value: 'active', label: "active" },
  { value: 'inactive', label: "inactive" },
];
const everyone = ({ authentication: { item: user } }) => Boolean(user);
keystone.createList('User', {
  fields: {
    name: { label: "姓名", type: Text, isRequired: true },
    phone: { label: "電話", type: Text, isRequired: true },
    email: {
      type: Text,
      isUnique: true,
    },
    role: { type: Select, options: 'user, admin, sales, executor, planner' },
    isAdmin: { type: Checkbox },
    password: {
      type: Password,
    },
    user_status: { label: "狀態", type: Select, options: status_options, isRequired: true},
  },
  access: {
    read: access.userIsAdminOrOwner,
    update: access.userIsAdminOrOwner,
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
});
const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      enableDefaultRoute: true,
      authStrategy,
    }),
  ],
};
//models
const ClientsSchema = require('./lists/Clients.js');
const OrdersSchema = require('./lists/Orders.js');
const StampsSchema = require('./lists/Stamps.js');
//const CommissionSchema = require('./lists/Commission.js');
const DailystampSchema = require('./lists/DailyStamp.js');
keystone.createList('Client', ClientsSchema);
keystone.createList('Order', OrdersSchema);
keystone.createList('Stamp', StampsSchema);
keystone.createList('Dailystamp', DailystampSchema);
//keystone.createList('Commission', CommissionSchema);
keystone.createList('Commission', {
	fields: {
		dailystamp: { label: "每日版位ID", type: Relationship, many: false, ref: 'Dailystamp',  isRequired: true},
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
});
