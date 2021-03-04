const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { Select, Text, Checkbox, Password, Relationship, Integer, DateTime, Float } = require('@keystonejs/fields');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { atTracking } = require('@keystonejs/list-plugins');
const initialiseData = require('./initial-data');
const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const { access } = require('./lists/Permission.js');
const PROJECT_NAME = "sales";
const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(),
  onConnect: initialiseData,
});
/*
const userIsAdminOrOwner = auth => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};
*/
const status_options = [
  { value: 'active', label: "active" },
  { value: 'inactive', label: "inactive" },
];

const everyone = ({ authentication: { item: user } }) => Boolean(user);
keystone.createList('User', {
  label: "使用者",
  plural: "使用者",
  fields: {
    name: { label: "姓名", type: Text, isRequired: true },
    phone: { label: "電話", type: Text, isRequired: true },
    email: {
      type: Text,
      isUnique: true,
    },
    role: { type: Select, options: 'admin, sales, executor, planner' },
    password: {
      type: Password,
    },
    user_status: { label: "狀態", type: Select, options: status_options, isRequired: true},
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
});
const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
});

//models
const lists = require('./lists/index.js')
for (var name in lists){
	keystone.createList(name, lists[name])
}

//keystone.createList('Commission', CommissionSchema);


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
