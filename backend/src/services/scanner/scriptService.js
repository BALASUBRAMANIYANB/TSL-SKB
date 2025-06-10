const Setting = require('../../models/setting');
const fs = require('fs').promises;
const path = require('path');

class ScriptService {
  static async getScripts(userId) {
    const settings = await Setting.findOne({ userId });
    return settings?.scan?.customScripts || [];
  }

  static async addScript(userId, script) {
    const settings = await Setting.findOne({ userId });
    if (!settings) {
      throw new Error('Settings not found');
    }

    // If it's a file upload, save the file
    if (script.type === 'file' && script.content) {
      const scriptDir = path.join(__dirname, '../../../scripts', userId);
      await fs.mkdir(scriptDir, { recursive: true });
      
      const fileName = `${script.name}.${script.language === 'python' ? 'py' : script.language === 'javascript' ? 'js' : 'sh'}`;
      const filePath = path.join(scriptDir, fileName);
      
      await fs.writeFile(filePath, script.content);
      script.filePath = filePath;
      delete script.content;
    }

    settings.scan.customScripts.push(script);
    await settings.save();
    return script;
  }

  static async updateScript(userId, scriptName, updates) {
    const settings = await Setting.findOne({ userId });
    if (!settings) {
      throw new Error('Settings not found');
    }

    const scriptIndex = settings.scan.customScripts.findIndex(s => s.name === scriptName);
    if (scriptIndex === -1) {
      throw new Error('Script not found');
    }

    const currentScript = settings.scan.customScripts[scriptIndex];

    // Handle file updates
    if (updates.type === 'file' && updates.content) {
      const scriptDir = path.join(__dirname, '../../../scripts', userId);
      await fs.mkdir(scriptDir, { recursive: true });
      
      const fileName = `${updates.name || currentScript.name}.${updates.language === 'python' ? 'py' : updates.language === 'javascript' ? 'js' : 'sh'}`;
      const filePath = path.join(scriptDir, fileName);
      
      await fs.writeFile(filePath, updates.content);
      updates.filePath = filePath;
      delete updates.content;

      // Delete old file if it exists
      if (currentScript.filePath) {
        try {
          await fs.unlink(currentScript.filePath);
        } catch (error) {
          console.error('Error deleting old script file:', error);
        }
      }
    }

    settings.scan.customScripts[scriptIndex] = {
      ...currentScript,
      ...updates,
    };

    await settings.save();
    return settings.scan.customScripts[scriptIndex];
  }

  static async deleteScript(userId, scriptName) {
    const settings = await Setting.findOne({ userId });
    if (!settings) {
      throw new Error('Settings not found');
    }

    const scriptIndex = settings.scan.customScripts.findIndex(s => s.name === scriptName);
    if (scriptIndex === -1) {
      throw new Error('Script not found');
    }

    const script = settings.scan.customScripts[scriptIndex];

    // Delete the file if it exists
    if (script.filePath) {
      try {
        await fs.unlink(script.filePath);
      } catch (error) {
        console.error('Error deleting script file:', error);
      }
    }

    settings.scan.customScripts.splice(scriptIndex, 1);
    await settings.save();
  }

  static async getScriptContent(userId, scriptName) {
    const settings = await Setting.findOne({ userId });
    if (!settings) {
      throw new Error('Settings not found');
    }

    const script = settings.scan.customScripts.find(s => s.name === scriptName);
    if (!script) {
      throw new Error('Script not found');
    }

    if (script.type === 'file' && script.filePath) {
      try {
        const content = await fs.readFile(script.filePath, 'utf8');
        return content;
      } catch (error) {
        console.error('Error reading script file:', error);
        throw new Error('Error reading script file');
      }
    }

    return script.content;
  }

  static async executeScript(userId, scriptName, params = {}) {
    const script = await this.getScriptContent(userId, scriptName);
    if (!script) {
      throw new Error('Script not found');
    }

    // TODO: Implement script execution based on language
    // This would involve:
    // 1. Creating a temporary file with the script content
    // 2. Executing the script with the provided parameters
    // 3. Capturing and returning the output
    // 4. Cleaning up temporary files

    throw new Error('Script execution not implemented');
  }
}

module.exports = ScriptService; 