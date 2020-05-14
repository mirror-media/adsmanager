const { access } = require('./Permission.js');
const { Select, Text, Relationship, DateTime, Integer } = require('@keystonejs/fields');
const { atTracking } = require('@keystonejs/list-plugins');

const options = [
  { value: 'start', label: "開始" },
  { value: 'end', label: "結束" },
];

const status_options = [
  { value: 'draft', label: "草稿" },
  { value: 'await', label: "待審核" },
  { value: 'approved', label: "核准" },
  { value: 'processing', label: "執行中" },
  { value: 'closed', label: "結案" },
];

module.exports = {
  label: "委刊單",
  plural: "委刊單",
  fields: {
    adname: { label: "廣告名稱", type: Text, isRequired: true},
    clientname: { label: "客戶ID", type: Relationship, many: false, ref: 'Client',  isRequired: true},
    username: { label: "使用者ID", type: Relationship, many: false, ref: 'User',  isRequired: true},
    commissions: { label: "委刊項ID", type: Relationship, many: true, ref: 'Z_Commission',  isRequired: true},
    order_status: { label: '狀態', type: Select, options: status_options, isRequired: true, default: 'draft' },
    start_date: { label: "開始日期", type: DateTime, yearRangeFrom: 2020, yearRangeTo: 2022, yearPickerType: 'select', isRequired: true},
    end_date: { label: "結束日期", type: DateTime, yearRangeFrom: 2020, yearRangeTo: 2022, yearPickerType: 'select', isRequired: true},
    period: { label: "期數／天數", type: Integer, isRequired: false},
    tax_free: { 
		label: "總金額（未稅）", type: Integer, isRequired: false,
		hooks: {
			beforeChange: async (operation, existingItem, originalInput, updatedItem, context) => {
				if (operation.resolvedData.tax_free > 0) {
					operation.resolvedData.tax_included = operation.resolvedData.tax_free * 1.05;
				}
			}
		}
	},
    tax_included: { label: "總金額（含稅）", type: Integer, isRequired: false},
    payment: { label: "付款條件", type: Text, isRequired: false},
    remark: { label: "其他備註", type: Text, isRequired: false},
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
