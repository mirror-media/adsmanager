const userIsAdmin = ({ authentication: { item: user } }) => Boolean(user && user.isAdmin);
const userIsUsers = ({ authentication: { item: user } }) => Boolean(user && user.role == 'users');
const userIsSales = ({ authentication: { item: user } }) => Boolean(user && (user.role == 'sales' || user.isAdmin));
const userIsExecutor = ({ authentication: { item: user } }) => Boolean(user && (user.role == 'executor' || user.role == 'sales' || user.isAdmin));
const userIsPlanner = ({ authentication: { item: user } }) => Boolean(user && (user.role == 'planner' || user.role == 'executor' || user.role == 'sales' || user.isAdmin));
const everyone = ({ authentication: { item: user } }) => Boolean(user);
const access = { userIsAdmin, userIsUsers, everyone, userIsSales, userIsExecutor, userIsPlanner };

module.exports = { "access": access }
