const { access } = require('./Permission.js');
const { Text, Select, Integer, Float, Relationship } = require('@keystonejs/fields');
const { atTracking } = require('@keystonejs/list-plugins');

const status_options = [
  { value: 'active', label: "active" },
  { value: 'inactive', label: "inactive" },
];

const charge_options = [
  { value: 'cpm', label: 'CPM' },
  { value: 'single', label: '一則' },
  { value: 'NA', label: 'N/A' },
];

module.exports = { 
  label: "版位",
  plural: "版位",
  fields: {
    platform: { label: '平台', type: Relationship, many: true, ref: 'Platform', isRequired: true, default: '跨裝置廣告' },
    section: { label: '頻道分區', type: Relationship, many:true, ref: 'Section', isRequired: true, default: '不指定' },
    //category: { label: "頻道分類", type: Text, isRequired: true},
    stamp: { label: "版位", type: Text, isRequired: true},
    adname: { label: "廣告名稱", type: Text, isRequired: true},
    gam_id: { label: "GAM ID", type: Text, isRequired: true},
    spec: { label: "素材尺寸規格", type: Text, isRequired: true},
    charge: { label: "計價方式", type: Select, options: charge_options, isRequired: true},
    price: { label: "單價", type: Integer, isRequired: true},
	//estimate: {label: "預估曝光量", type: Integer, isRequired: false},
	est_ctr: {label: "預估點擊率", type: Float, isRequired: false},
    stamp_status: { label: "狀態", type: Select, options: status_options, isRequired: true},
  },
  access: {
    read: access.userIsExecutor,
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
  adminConfig: {
    defaultColumns: 'stamp, adname, platform',
	//defaultSort: 'email',
  },
};
