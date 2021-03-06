const { access } = require('./Permission.js');
const { Select, Text, Relationship, DateTime, Integer } = require('@keystonejs/fields');
const { atTracking } = require('@keystonejs/list-plugins');

const options = [
  { value: 'start', label: "開始" },
  { value: 'end', label: "結束" },
];

const payment_options = [
  { value: 'cash', label: "出刊前付現" },
  { value: 'd30', label: "月結30天" },
  { value: 'd60', label: "月結60天" },
  { value: 'other', label: "其他：依據合約執行" },
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
    clientname: { label: "廣告客戶", type: Relationship, many: false, ref: 'Client',  isRequired: true},
    username: { label: "訂版人員", type: Relationship, many: false, ref: 'User',  isRequired: true},
    order_status: { label: '狀態', type: Select, options: status_options, isRequired: true, default: 'draft' },
    start_date: { label: "開始日", type: DateTime, yearRangeFrom: 2020, yearRangeTo: 2022, yearPickerType: 'select', isRequired: true},
    end_date: { label: "結束日", type: DateTime, yearRangeFrom: 2020, yearRangeTo: 2022, yearPickerType: 'select', isRequired: true},
    commissions: { label: "委刊項", type: Relationship, many: true, ref: 'Commission',  isRequired: true},
    days: { label: "天數", type: Text, isRequired: false},
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
    payment: { label: "付款條件", type: Select, options: payment_options, isRequired: false},
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
