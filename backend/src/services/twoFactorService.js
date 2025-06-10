const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');
const User = require('../models/user');
const logger = require('../utils/logger');

class TwoFactorService {
  static async generateSecret(userId) {
    try {
      const secret = speakeasy.generateSecret({
        name: `Security Scanner:${userId}`,
      });

      const user = await User.findById(userId);
      user.twoFactorSecret = secret.base32;
      user.twoFactorRecoveryCodes = this.generateRecoveryCodes();
      await user.save();

      const qrCode = await QRCode.toDataURL(secret.otpauth_url);

      return {
        secret: secret.base32,
        qrCode,
        recoveryCodes: user.twoFactorRecoveryCodes,
      };
    } catch (error) {
      logger.error(`Error generating 2FA secret: ${error.message}`);
      throw error;
    }
  }

  static generateRecoveryCodes() {
    const codes = [];
    for (let i = 0; i < 8; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }

  static async verifyToken(userId, token) {
    try {
      const user = await User.findById(userId).select('+twoFactorSecret');
      if (!user.twoFactorSecret) {
        throw new Error('2FA not enabled');
      }

      return speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token,
      });
    } catch (error) {
      logger.error(`Error verifying 2FA token: ${error.message}`);
      throw error;
    }
  }

  static async verifyRecoveryCode(userId, code) {
    try {
      const user = await User.findById(userId).select('+twoFactorRecoveryCodes');
      if (!user.twoFactorRecoveryCodes) {
        throw new Error('No recovery codes found');
      }

      const index = user.twoFactorRecoveryCodes.indexOf(code);
      if (index === -1) {
        return false;
      }

      // Remove used recovery code
      user.twoFactorRecoveryCodes.splice(index, 1);
      await user.save();

      return true;
    } catch (error) {
      logger.error(`Error verifying recovery code: ${error.message}`);
      throw error;
    }
  }

  static async enable2FA(userId) {
    try {
      const user = await User.findById(userId);
      user.twoFactorEnabled = true;
      await user.save();
      logger.info(`2FA enabled for user: ${user.email}`);
    } catch (error) {
      logger.error(`Error enabling 2FA: ${error.message}`);
      throw error;
    }
  }

  static async disable2FA(userId) {
    try {
      const user = await User.findById(userId);
      user.twoFactorEnabled = false;
      user.twoFactorSecret = undefined;
      user.twoFactorRecoveryCodes = [];
      await user.save();
      logger.info(`2FA disabled for user: ${user.email}`);
    } catch (error) {
      logger.error(`Error disabling 2FA: ${error.message}`);
      throw error;
    }
  }
}

module.exports = TwoFactorService; 