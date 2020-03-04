const { access } = require('./Permission.js');                                                                                                                      
const { Text, Select, Integer } = require('@keystonejs/fields');                                                                                                           
                                                                                                                                                                    
module.exports = {                                                                                                                                                  
  fields: {                                                                                                                                                         
    platform: { label: '平台', type: Select, options: '桌機廣告, 手機廣告, 跨裝置廣告, 原生廣告, 數位廣編, Facebook, LINE, IG', isRequired: true, default: '跨裝置廣告' },
    section: { label: '頻道分區', type: Select, options: '不指定, 時事, 娛樂, 財經理財, 人物, 影音, 國際, 美食旅遊, 瑪法達, 文化, 汽車鐘錶', isRequired: true, default: '不指定' },
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
