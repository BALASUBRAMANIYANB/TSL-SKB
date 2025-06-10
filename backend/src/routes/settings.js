const NotificationService = require('../services/scanner/notificationService');

// Update notification settings
router.put('/notifications', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationSettings = await NotificationService.updateNotificationSettings(userId, req.body);
    res.json(notificationSettings);
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({ message: 'Error updating notification settings' });
  }
});

// Get notification settings
router.get('/notifications', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationSettings = await NotificationService.getNotificationSettings(userId);
    res.json(notificationSettings);
  } catch (error) {
    console.error('Error getting notification settings:', error);
    res.status(500).json({ message: 'Error getting notification settings' });
  }
}); 