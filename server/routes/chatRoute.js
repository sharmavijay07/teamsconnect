const express = require('express')
const {createChat,findUserChats,findChat} = require('../controllers/chatController')
const {
    createGroup,
    addUserToGroup,
    getGroupsInOrganization,
    searchGroups,
    sendGroupMessages,
    getGroupMessages,
    findGroupChats,
    getUserGroups,
    findGroupMessages
  } = require('../controllers/groupController');

const router = express.Router()

router.post('/',createChat)
router.get('/:userId',findUserChats)
router.get('/find/:memberId1/:memberId2',findChat)


//group

// Create a new group
router.post('/group', createGroup);

// Add a user to a group
router.post('/group/add', addUserToGroup);

// Get all groups in an organization
router.get('/organization/:orgId', getGroupsInOrganization);

// Search groups within an organization
router.get('/search/:orgId/:query', searchGroups);

// Express route to get messages for a group
router.get('/:groupId/messages', getGroupMessages);

// Express route to send a message to a group
router.post('/:groupId/messages', sendGroupMessages);

router.get('/:groupId/findChat', findGroupChats);

router.get('/user/:userId/groups',getUserGroups)

router.get('/:groupId/findMessages',findGroupMessages)


module.exports = router;

