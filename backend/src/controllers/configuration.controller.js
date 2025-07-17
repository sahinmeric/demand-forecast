const { getUserConfig, upsertUserConfig } = require('../services/configuration.service');

const getUserConfiguration = async (req, res) => {
  try {
    const config = await getUserConfig(req.user.userId);
    if (!config) {
      return res.status(404).json({ message: 'No configuration found' });
    }
    res.json(config);
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const upsertUserConfiguration = async (req, res) => {
  try {
    const updated = await upsertUserConfig(req.user.userId, req.body);
    res.json(updated);
  } catch (error) {
    console.error('Error updating config:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getUserConfiguration,
  upsertUserConfiguration,
};
