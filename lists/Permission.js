const userIsAdmin = ({ authentication: { item: user } }) => Boolean(user && user.isAdmin);                                                                          
const userIsUsers = ({ authentication: { item: user } }) => Boolean(user && user.role == 'users');                                                                  
const everyone = ({ authentication: { item: user } }) => Boolean(user);                                                                                             
const access = { userIsAdmin, userIsUsers, everyone };                                                                                                              
                                                                                                                                                                    
module.exports = { "access": access }
