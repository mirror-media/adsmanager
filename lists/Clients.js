const { access } = require('./Permission.js');                                                                                                                      
const { Text, Checkbox } = require('@keystonejs/fields');                                                                                                           
                                                                                                                                                                    
module.exports = {                                                                                                                                                  
  fields: {                                                                                                                                                         
    name: { label: "客戶名稱", type: Text, isRequired: true},
    resale: { label: "代理商名稱", type: Text, isRequired: true},
    inv_title: { label: "發票抬頭", type: Text, isRequired: true},
    inv_number: { label: "發票統編", type: Text, isRequired: true},
    inv_address: { label: "發票地址", type: Text, isRequired: true},
    inv_receiver: { label: "發票收件人姓名", type: Text, isRequired: true},
    inv_method: { label: "發票開立方式", type: Text, isRequired: true},
    contact: { label: "聯絡人姓名", type: Text, isRequired: true},
    contact_email: { label: "聯絡人 Email", type: Text, isRequired: true},
    contact_tel: { label: "聯絡人電話", type: Text, isRequired: true},
  },                                                                                                                                                                
  access: {                                                                                                                                                         
    read: access.everyone,                                                                                                                                          
    update: access.userIsUsers,                                                                                                                                     
    create: access.userIsAdmin,                                                                                                                                     
    delete: access.userIsAdmin,                                                                                                                                     
    auth: true,                                                                                                                                                     
  },                                                                                                                                                                
};
