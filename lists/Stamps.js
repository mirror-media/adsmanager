const { access } = require('./Permission.js');                                                                                                                      
const { Text, Select, Integer } = require('@keystonejs/fields');                                                                                                           

const platform_options = [
  { value: 'desktop', label: "桌機廣告" },
  { value: 'mobile', label: "手機廣告" },
  { value: 'cross', label: "跨裝置廣告" },
  { value: 'native', label: "原生廣告" },
  { value: 'article', label: "數位廣編" },
  { value: 'fb', label: "Facebook" },
  { value: 'line', label: "line" },
  { value: 'ig', label: "IG" },
];

const section_options = [
  { value: 'all', label: "不指定" },
  { value: 'news', label: "時事" },
  { value: 'ent', label: "娛樂" },
  { value: 'finance', label: "財經理財" },
  { value: 'people', label: "人物" },
  { value: 'video', label: "影音" },
  { value: 'food', label: "美食旅遊" },
  { value: 'mafada', label: "瑪法達" },
  { value: 'culture', label: "文化" },
  { value: 'watch', label: "汽車鐘錶" },
];
module.exports = {                                                                                                                                                  
  fields: {                                                                                                                                                         
    platform: { label: '平台', type: Select, platform_options, isRequired: true, default: '跨裝置廣告' },
    section: { label: '頻道分區', type: Select, section_options, isRequired: true, default: '不指定' },
    category: { label: "頻道分類", type: Text, isRequired: true},
    stamp: { label: "版位", type: Text, isRequired: true},
    adname: { label: "廣告名稱", type: Text, isRequired: true},
    spec: { label: "素材尺寸規格", type: Text, isRequired: true},
    charge: { label: "計價方式", type: Text, isRequired: true},
    price: { label: "售價金額", type: Integer, isRequired: true},
  },                                                                                                                                                                
  access: {                                                                                                                                                         
    read: access.everyone,                                                                                                                                          
    update: access.userIsUsers,                                                                                                                                     
    create: access.userIsAdmin,                                                                                                                                     
    delete: access.userIsAdmin,                                                                                                                                     
    auth: true,                                                                                                                                                     
  },                                                                                                                                                                
};
