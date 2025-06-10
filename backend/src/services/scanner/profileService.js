const Setting = require('../../models/setting');

class ProfileService {
  static async getProfiles(userId) {
    const settings = await Setting.findOne({ userId });
    return settings?.scan?.scanProfiles || [];
  }

  static async addProfile(userId, profile) {
    const settings = await Setting.findOne({ userId });
    if (!settings) {
      throw new Error('Settings not found');
    }

    // If this is set as default, unset any existing default
    if (profile.isDefault) {
      settings.scan.scanProfiles = settings.scan.scanProfiles.map(p => ({
        ...p,
        isDefault: false,
      }));
    }

    settings.scan.scanProfiles.push(profile);
    await settings.save();
    return profile;
  }

  static async updateProfile(userId, profileName, updates) {
    const settings = await Setting.findOne({ userId });
    if (!settings) {
      throw new Error('Settings not found');
    }

    const profileIndex = settings.scan.scanProfiles.findIndex(p => p.name === profileName);
    if (profileIndex === -1) {
      throw new Error('Profile not found');
    }

    // If this is set as default, unset any existing default
    if (updates.isDefault) {
      settings.scan.scanProfiles = settings.scan.scanProfiles.map(p => ({
        ...p,
        isDefault: false,
      }));
    }

    settings.scan.scanProfiles[profileIndex] = {
      ...settings.scan.scanProfiles[profileIndex],
      ...updates,
    };

    await settings.save();
    return settings.scan.scanProfiles[profileIndex];
  }

  static async deleteProfile(userId, profileName) {
    const settings = await Setting.findOne({ userId });
    if (!settings) {
      throw new Error('Settings not found');
    }

    const profileIndex = settings.scan.scanProfiles.findIndex(p => p.name === profileName);
    if (profileIndex === -1) {
      throw new Error('Profile not found');
    }

    settings.scan.scanProfiles.splice(profileIndex, 1);
    await settings.save();
  }

  static async getDefaultProfile(userId) {
    const settings = await Setting.findOne({ userId });
    if (!settings) {
      throw new Error('Settings not found');
    }

    const defaultProfile = settings.scan.scanProfiles.find(p => p.isDefault);
    if (!defaultProfile) {
      // Return a default profile if none is set
      return {
        name: 'Default',
        description: 'Default scan profile',
        settings: {
          scanType: 'standard',
          timeout: 30,
          threads: 2,
          depth: 1,
          advanced: {
            followRedirects: true,
            verifySSL: true,
            rateLimit: 100,
          },
        },
        isDefault: true,
      };
    }

    return defaultProfile;
  }
}

module.exports = ProfileService; 