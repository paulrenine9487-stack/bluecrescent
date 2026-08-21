const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getPool, getIsConnected, fallbackData, hashPassword } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
// Set payload limits for Base64 image uploading
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    database: 'Bluecres',
    connected: getIsConnected()
  });
});

// Fallback legacy API for /api/news
app.get('/api/news', (req, res) => {
  res.json([]);
});

// ==========================================
// SETTINGS PERSISTENCE APIs (MySQL)
// ==========================================

app.get('/api/settings/company', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT * FROM company_settings LIMIT 1');
      if (rows.length > 0) {
        const raw = rows[0];
        const cleaned = {};
        for (const [key, val] of Object.entries(raw)) {
          if (val === null || val === undefined) continue;
          const str = String(val).trim();
          if (str === '' || str.toLowerCase() === 'null' || str.toLowerCase() === 'undefined') continue;
          cleaned[key] = val;
        }
        return res.json(cleaned);
      }
    }
  } catch (err) {
    console.error('Error fetching company settings:', err);
  }
  return res.json({});
});

const fs = require('fs');
const path = require('path');

// Uploads directory lives inside /server/uploads/ so it survives client rebuilds
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Helper to save base64 to file and return static path
const saveBase64File = (base64Str, prefix) => {
  if (!base64Str || !base64Str.startsWith('data:')) {
    return base64Str; // already a path or empty
  }
  
  try {
    const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return base64Str;
    }
    
    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Determine file extension
    let ext = 'bin';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
    else if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('mp4')) ext = 'mp4';
    else if (mimeType.includes('webm')) ext = 'webm';
    else if (mimeType.includes('quicktime') || mimeType.includes('mov')) ext = 'mov';
    
    const filename = `${prefix}_${Date.now()}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filePath, buffer);
    
    console.log(`Successfully saved Base64 upload to: ${filePath}`);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Error saving base64 to file:', err);
    return base64Str;
  }
};

app.post('/api/settings/company', async (req, res) => {
  const settings = req.body;
  try {
    // Process base64 uploads and save to disk
    if (settings.aboutUsHeroUrl && settings.aboutUsHeroUrl.startsWith('data:')) {
      settings.aboutUsHeroUrl = saveBase64File(settings.aboutUsHeroUrl, 'hero_banner');
    }
    if (settings.aboutUsVideoUrl && settings.aboutUsVideoUrl.startsWith('data:')) {
      settings.aboutUsVideoUrl = saveBase64File(settings.aboutUsVideoUrl, 'section_video');
    }
    if (settings.aboutUsMapImg && settings.aboutUsMapImg.startsWith('data:')) {
      settings.aboutUsMapImg = saveBase64File(settings.aboutUsMapImg, 'about_map');
    }
    if (settings.aboutUsCapaImg && settings.aboutUsCapaImg.startsWith('data:')) {
      settings.aboutUsCapaImg = saveBase64File(settings.aboutUsCapaImg, 'about_capa');
    }
    if (settings.aboutUsDigitalImg && settings.aboutUsDigitalImg.startsWith('data:')) {
      settings.aboutUsDigitalImg = saveBase64File(settings.aboutUsDigitalImg, 'about_digital');
    }
    if (settings.sustainabilityImage && settings.sustainabilityImage.startsWith('data:')) {
      settings.sustainabilityImage = saveBase64File(settings.sustainabilityImage, 'sustainability_img');
    }
    if (settings.remoteImage && settings.remoteImage.startsWith('data:')) {
      settings.remoteImage = saveBase64File(settings.remoteImage, 'remote_img');
    }

    if (settings.aboutUsPageBannerUrl && settings.aboutUsPageBannerUrl.startsWith('data:')) {
      settings.aboutUsPageBannerUrl = saveBase64File(settings.aboutUsPageBannerUrl, 'banner_aboutus');
    }
    if (settings.servicesPageBannerUrl && settings.servicesPageBannerUrl.startsWith('data:')) {
      settings.servicesPageBannerUrl = saveBase64File(settings.servicesPageBannerUrl, 'banner_services');
    }
    if (settings.projectsPageBannerUrl && settings.projectsPageBannerUrl.startsWith('data:')) {
      settings.projectsPageBannerUrl = saveBase64File(settings.projectsPageBannerUrl, 'banner_projects');
    }
    if (settings.mediaPageBannerUrl && settings.mediaPageBannerUrl.startsWith('data:')) {
      settings.mediaPageBannerUrl = saveBase64File(settings.mediaPageBannerUrl, 'banner_media');
    }
    if (settings.contactUsPageBannerUrl && settings.contactUsPageBannerUrl.startsWith('data:')) {
      settings.contactUsPageBannerUrl = saveBase64File(settings.contactUsPageBannerUrl, 'banner_contactus');
    }
    if (settings.homeBannerUrl && settings.homeBannerUrl.startsWith('data:')) {
      settings.homeBannerUrl = saveBase64File(settings.homeBannerUrl, 'banner_home');
    }

    const pool = getPool();
    if (getIsConnected() && pool) {
      // Ensure all keys in req.body exist as columns in company_settings
      try {
        const [existingCols] = await pool.query(`
          SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'company_settings'
        `);
        const existingColNames = new Set(existingCols.map(c => c.COLUMN_NAME));

        for (const k of Object.keys(settings)) {
          if (k !== 'id' && !existingColNames.has(k)) {
            try {
              await pool.query(`ALTER TABLE company_settings ADD COLUMN \`${k}\` LONGTEXT`);
            } catch (e) {
              console.warn(`Could not auto-add column ${k}:`, e.message);
            }
          }
        }
      } catch (colErr) {
        console.warn('Column check warning:', colErr.message);
      }

      const [rows] = await pool.query('SELECT id FROM company_settings LIMIT 1');
      if (rows.length > 0) {
        const id = rows[0].id;
        const keys = Object.keys(settings).filter(k => k !== 'id');
        const setQuery = keys.map(k => `${k} = ?`).join(', ');
        const values = keys.map(k => typeof settings[k] === 'object' ? JSON.stringify(settings[k]) : settings[k]);
        await pool.query(`UPDATE company_settings SET ${setQuery} WHERE id = ?`, [...values, id]);
        fallbackData.company_settings = { ...fallbackData.company_settings, ...settings };
        return res.json({ success: true, message: 'Settings updated.', data: settings });
      } else {
        const keys = Object.keys(settings).filter(k => k !== 'id');
        const colNames = keys.join(', ');
        const placeholders = keys.map(() => '?').join(', ');
        const values = keys.map(k => typeof settings[k] === 'object' ? JSON.stringify(settings[k]) : settings[k]);
        await pool.query(`INSERT INTO company_settings (${colNames}) VALUES (${placeholders})`, values);
        fallbackData.company_settings = { ...fallbackData.company_settings, ...settings };
        return res.json({ success: true, message: 'Settings inserted.', data: settings });
      }
    }
  } catch (err) {
    console.error('Error saving company settings:', err);
    return res.status(500).json({ error: err.message });
  }

  // Fallback in-memory storage if DB is not connected
  fallbackData.company_settings = { ...fallbackData.company_settings, ...settings };
  return res.json({ success: true, message: 'Settings saved (fallback mode).', data: settings });
});

// Dedicated Page Banners Endpoints
app.get('/api/settings/banners', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT * FROM company_settings LIMIT 1');
      if (rows.length > 0) {
        const s = rows[0];
        return res.json({
          homeBannerUrl: s.homeBannerUrl || s.aboutUsHeroUrl || '',
          aboutUsPageBannerUrl: s.aboutUsPageBannerUrl || '',
          servicesPageBannerUrl: s.servicesPageBannerUrl || '',
          projectsPageBannerUrl: s.projectsPageBannerUrl || '',
          mediaPageBannerUrl: s.mediaPageBannerUrl || '',
          contactUsPageBannerUrl: s.contactUsPageBannerUrl || ''
        });
      }
    }
  } catch (err) {
    console.error('Error fetching page banners:', err);
  }
  const s = fallbackData.company_settings || {};
  return res.json({
    homeBannerUrl: s.homeBannerUrl || s.aboutUsHeroUrl || '',
    aboutUsPageBannerUrl: s.aboutUsPageBannerUrl || '',
    servicesPageBannerUrl: s.servicesPageBannerUrl || '',
    projectsPageBannerUrl: s.projectsPageBannerUrl || '',
    mediaPageBannerUrl: s.mediaPageBannerUrl || '',
    contactUsPageBannerUrl: s.contactUsPageBannerUrl || ''
  });
});

app.post('/api/settings/banners', async (req, res) => {
  try {
    const { pageKey, bannerUrl } = req.body;
    if (!pageKey) return res.status(400).json({ error: 'pageKey is required.' });

    const keyMap = {
      'home': 'homeBannerUrl',
      'aboutus': 'aboutUsPageBannerUrl',
      'services': 'servicesPageBannerUrl',
      'projects': 'projectsPageBannerUrl',
      'media': 'mediaPageBannerUrl',
      'contactus': 'contactUsPageBannerUrl'
    };

    const targetCol = keyMap[pageKey] || pageKey;
    let savedUrl = bannerUrl || '';
    if (savedUrl.startsWith('data:')) {
      savedUrl = saveBase64File(savedUrl, `banner_${pageKey}`);
    }

    const payload = { [targetCol]: savedUrl };
    const pool = getPool();

    if (getIsConnected() && pool) {
      try {
        const [existingCols] = await pool.query(`
          SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'company_settings'
        `);
        const existingColNames = new Set(existingCols.map(c => c.COLUMN_NAME));
        if (!existingColNames.has(targetCol)) {
          await pool.query(`ALTER TABLE company_settings ADD COLUMN \`${targetCol}\` LONGTEXT`);
        }
      } catch (e) {
        console.warn('Banner column add check error:', e);
      }

      const [rows] = await pool.query('SELECT id FROM company_settings LIMIT 1');
      if (rows.length > 0) {
        await pool.query(`UPDATE company_settings SET \`${targetCol}\` = ? WHERE id = ?`, [savedUrl, rows[0].id]);
      } else {
        await pool.query(`INSERT INTO company_settings (\`${targetCol}\`) VALUES (?)`, [savedUrl]);
      }
    }

    if (!fallbackData.company_settings) fallbackData.company_settings = {};
    fallbackData.company_settings[targetCol] = savedUrl;

    return res.json({
      success: true,
      message: `Banner for ${pageKey} updated successfully.`,
      pageKey,
      bannerUrl: savedUrl,
      banners: fallbackData.company_settings
    });
  } catch (err) {
    console.error('Error saving banner:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/settings/banners/:pageKey', async (req, res) => {
  try {
    const { pageKey } = req.params;
    const keyMap = {
      'home': 'homeBannerUrl',
      'aboutus': 'aboutUsPageBannerUrl',
      'services': 'servicesPageBannerUrl',
      'projects': 'projectsPageBannerUrl',
      'media': 'mediaPageBannerUrl',
      'contactus': 'contactUsPageBannerUrl'
    };
    const targetCol = keyMap[pageKey] || pageKey;

    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT id FROM company_settings LIMIT 1');
      if (rows.length > 0) {
        await pool.query(`UPDATE company_settings SET \`${targetCol}\` = '' WHERE id = ?`, [rows[0].id]);
      }
    }

    if (!fallbackData.company_settings) fallbackData.company_settings = {};
    fallbackData.company_settings[targetCol] = '';

    return res.json({
      success: true,
      message: `Custom banner for ${pageKey} deleted/reset to default.`,
      pageKey,
      bannerUrl: ''
    });
  } catch (err) {
    console.error('Error deleting banner:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/settings/contact', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT * FROM contact_settings LIMIT 1');
      if (rows.length > 0) {
        return res.json(rows[0]);
      }
    }
  } catch (err) {
    console.error('Error fetching contact settings:', err);
  }
  return res.json({});
});

app.post('/api/settings/contact', async (req, res) => {
  const settings = req.body;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT id FROM contact_settings LIMIT 1');
      if (rows.length > 0) {
        const id = rows[0].id;
        const keys = Object.keys(settings).filter(k => k !== 'id');
        const setQuery = keys.map(k => `${k} = ?`).join(', ');
        const values = keys.map(k => settings[k]);
        await pool.query(`UPDATE contact_settings SET ${setQuery} WHERE id = ?`, [...values, id]);
        return res.json({ success: true, message: 'Settings updated.' });
      } else {
        const keys = Object.keys(settings);
        const colNames = keys.join(', ');
        const placeholders = keys.map(() => '?').join(', ');
        const values = keys.map(k => settings[k]);
        await pool.query(`INSERT INTO contact_settings (${colNames}) VALUES (${placeholders})`, values);
        return res.json({ success: true, message: 'Settings inserted.' });
      }
    }
  } catch (err) {
    console.error('Error saving contact settings:', err);
    return res.status(500).json({ error: err.message });
  }
  return res.status(503).json({ error: 'Database disconnected.' });
});

// ==========================================
// DYNAMIC MAINTENANCE MODE & AUDIT LOG APIs
// ==========================================

// 1. Public Maintenance Status Endpoint (Exposes ONLY public non-sensitive info)
app.get('/api/settings/maintenance-status', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT maintenance_mode, maintenance_title, maintenance_message FROM system_settings LIMIT 1');
      if (rows.length > 0) {
        return res.json({
          maintenanceMode: Boolean(rows[0].maintenance_mode),
          maintenanceTitle: rows[0].maintenance_title || 'WEBSITE UNDER MAINTENANCE',
          maintenanceMessage: rows[0].maintenance_message || 'We are currently performing scheduled maintenance to improve our website and digital services.'
        });
      }
    }
  } catch (err) {
    console.error('Error fetching maintenance status:', err);
  }
  
  // Safe Fallback: Default to false (Website Live) if DB error or missing
  const fb = fallbackData.system_settings || {};
  return res.json({
    maintenanceMode: Boolean(fb.maintenanceMode),
    maintenanceTitle: fb.maintenanceTitle || 'WEBSITE UNDER MAINTENANCE',
    maintenanceMessage: fb.maintenanceMessage || 'We are currently performing scheduled maintenance to improve our website and digital services.'
  });
});

// 2. Super Admin GET Maintenance Details
app.get('/api/admin/settings/maintenance', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT * FROM system_settings LIMIT 1');
      if (rows.length > 0) {
        const s = rows[0];
        return res.json({
          maintenanceMode: Boolean(s.maintenance_mode),
          maintenanceTitle: s.maintenance_title || 'WEBSITE UNDER MAINTENANCE',
          maintenanceMessage: s.maintenance_message || 'We are currently performing scheduled maintenance to improve our website and digital services.',
          updatedBy: s.updated_by || 'Super Admin',
          updatedAt: s.updated_at,
          maintenanceStartedAt: s.maintenance_started_at,
          maintenanceEndedAt: s.maintenance_ended_at
        });
      }
    }
  } catch (err) {
    console.error('Error fetching admin maintenance settings:', err);
  }
  const fb = fallbackData.system_settings || {};
  return res.json({
    maintenanceMode: Boolean(fb.maintenanceMode),
    maintenanceTitle: fb.maintenanceTitle || 'WEBSITE UNDER MAINTENANCE',
    maintenanceMessage: fb.maintenanceMessage || 'We are currently performing scheduled maintenance to improve our website and digital services.',
    updatedBy: fb.updatedBy || 'Super Admin',
    updatedAt: fb.updatedAt || new Date().toISOString(),
    maintenanceStartedAt: fb.maintenanceStartedAt || null,
    maintenanceEndedAt: fb.maintenanceEndedAt || null
  });
});

// 3. Super Admin UPDATE Maintenance Mode Endpoint
const updateMaintenanceHandler = async (req, res) => {
  // Validate Super Admin Authorization
  const userRole = req.headers['x-user-role'] || req.body.userRole || req.body.role;
  if (userRole && userRole !== 'super_admin') {
    return res.status(403).json({ error: 'Access denied. Only Super Admin can modify Maintenance Mode.' });
  }

  const { maintenanceMode, maintenanceTitle, maintenanceMessage, updatedBy } = req.body;
  const isEnabled = Boolean(maintenanceMode);
  const adminName = updatedBy || 'Super Admin';
  const now = new Date();

  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT id FROM system_settings LIMIT 1');

      if (rows.length > 0) {
        const id = rows[0].id;
        let updateQuery = 'UPDATE system_settings SET maintenance_mode = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP';
        const queryParams = [isEnabled ? 1 : 0, adminName];

        if (maintenanceTitle !== undefined) {
          updateQuery += ', maintenance_title = ?';
          queryParams.push(maintenanceTitle);
        }
        if (maintenanceMessage !== undefined) {
          updateQuery += ', maintenance_message = ?';
          queryParams.push(maintenanceMessage);
        }
        if (isEnabled) {
          updateQuery += ', maintenance_started_at = CURRENT_TIMESTAMP';
        } else {
          updateQuery += ', maintenance_ended_at = CURRENT_TIMESTAMP';
        }

        updateQuery += ' WHERE id = ?';
        queryParams.push(id);

        await pool.query(updateQuery, queryParams);
      } else {
        await pool.query(
          `INSERT INTO system_settings (maintenance_mode, maintenance_title, maintenance_message, updated_by, maintenance_started_at, maintenance_ended_at)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            isEnabled ? 1 : 0,
            maintenanceTitle || 'WEBSITE UNDER MAINTENANCE',
            maintenanceMessage || 'We are currently performing scheduled maintenance to improve our website and digital services.',
            adminName,
            isEnabled ? now : null,
            isEnabled ? null : now
          ]
        );
      }

      // Record Activity / Audit Log in MySQL
      const logAction = isEnabled ? 'Maintenance Mode ENABLED' : 'Maintenance Mode DISABLED';
      const logDetails = `Maintenance Mode set to ${isEnabled ? 'ON' : 'OFF'} by ${adminName}`;
      await pool.query(
        'INSERT INTO activity_logs (action, user_name, details) VALUES (?, ?, ?)',
        [logAction, adminName, logDetails]
      );
    }
  } catch (err) {
    console.error('Error updating maintenance mode in DB:', err);
  }

  // Update Fallback Data
  if (!fallbackData.system_settings) fallbackData.system_settings = {};
  fallbackData.system_settings = {
    ...fallbackData.system_settings,
    maintenanceMode: isEnabled,
    maintenanceTitle: maintenanceTitle || fallbackData.system_settings.maintenanceTitle || 'WEBSITE UNDER MAINTENANCE',
    maintenanceMessage: maintenanceMessage || fallbackData.system_settings.maintenanceMessage || 'We are currently performing scheduled maintenance to improve our website and digital services.',
    updatedBy: adminName,
    updatedAt: now.toISOString(),
    maintenanceStartedAt: isEnabled ? now.toISOString() : (fallbackData.system_settings.maintenanceStartedAt || null),
    maintenanceEndedAt: !isEnabled ? now.toISOString() : (fallbackData.system_settings.maintenanceEndedAt || null)
  };

  if (!fallbackData.activity_logs) fallbackData.activity_logs = [];
  fallbackData.activity_logs.unshift({
    id: Date.now(),
    action: isEnabled ? 'Maintenance Mode ENABLED' : 'Maintenance Mode DISABLED',
    user_name: adminName,
    details: `Maintenance Mode set to ${isEnabled ? 'ON' : 'OFF'} by ${adminName}`,
    created_at: now.toISOString()
  });

  return res.json({
    success: true,
    maintenanceMode: isEnabled,
    message: isEnabled ? 'Maintenance Mode enabled successfully.' : 'Maintenance Mode disabled successfully.',
    data: fallbackData.system_settings
  });
};

app.put('/api/admin/settings/maintenance', updateMaintenanceHandler);
app.patch('/api/admin/settings/maintenance', updateMaintenanceHandler);

// 4. Activity Logs Endpoint
app.get('/api/activity-logs', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT * FROM activity_logs ORDER BY id DESC LIMIT 50');
      return res.json(rows);
    }
  } catch (err) {
    console.error('Error fetching activity logs:', err);
  }
  return res.json(fallbackData.activity_logs || []);
});


// ==========================================
// 1. AUTHENTICATION & ACCESS CONTROL
// ==========================================

// POST Admin Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  const hashed = hashPassword(password);
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT id, username, role FROM users WHERE username = ? AND password = ?', [username, hashed]);
      if (rows.length > 0) {
        return res.json({ success: true, user: rows[0] });
      } else {
        return res.status(401).json({ error: 'Invalid username or password.' });
      }
    }
  } catch (err) {
    console.error('Error logging in:', err);
  }
  // Fallback for offline DB
  if (username === 'superadmin' && password === 'bluecrescentmccmrfip') {
    return res.json({ success: true, user: { id: 1, username: 'superadmin', role: 'super_admin' } });
  } else if (username === 'admin' && password === 'adminpassword') {
    return res.json({ success: true, user: { id: 2, username: 'admin', role: 'admin' } });
  }
  return res.status(401).json({ error: 'Invalid credentials (fallback)' });
});

// GET Admin Users
app.get('/api/users', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT id, username, role, created_at FROM users ORDER BY id DESC');
      return res.json(rows);
    }
  } catch (err) {
    console.error(err);
  }
  return res.json([{ id: 1, username: 'superadmin', role: 'super_admin' }, { id: 2, username: 'admin', role: 'admin' }]);
});

// POST Admin User
app.post('/api/users', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Username, password, and role are required.' });
  }
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const hashed = hashPassword(password);
      const [result] = await pool.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashed, role]);
      return res.status(201).json({ id: result.insertId, username, role });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// PUT Admin User
app.put('/api/users/:id', async (req, res) => {
  const { username, password, role } = req.body;
  const { id } = req.params;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      if (password) {
        const hashed = hashPassword(password);
        await pool.query('UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?', [username, hashed, role, id]);
      } else {
        await pool.query('UPDATE users SET username = ?, role = ? WHERE id = ?', [username, role, id]);
      }
      return res.json({ id, username, role });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE Admin User
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query('DELETE FROM users WHERE id = ?', [id]);
      return res.json({ success: true });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. CERTIFICATES API
// ==========================================
app.get('/api/certificates', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT * FROM certificates ORDER BY id DESC');
      return res.json(rows);
    }
  } catch (err) {
    console.error(err);
  }
  return res.json([]);
});

app.post('/api/certificates', async (req, res) => {
  const { title, org, licenseNo, territory, validity, borderColor, badgeText, image, scope } = req.body;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [result] = await pool.query(
        'INSERT INTO certificates (title, org, licenseNo, territory, validity, borderColor, badgeText, image, scope) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [title, org, licenseNo, territory, validity, borderColor || 'border-blue', badgeText || 'CERTIFIED', image, scope]
      );
      return res.status(201).json({ id: result.insertId, title, org, licenseNo, territory, validity, borderColor, badgeText, image, scope });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/certificates/:id', async (req, res) => {
  const { id } = req.params;
  const { title, org, licenseNo, territory, validity, borderColor, badgeText, image, scope } = req.body;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query(
        'UPDATE certificates SET title = ?, org = ?, licenseNo = ?, territory = ?, validity = ?, borderColor = ?, badgeText = ?, image = ?, scope = ? WHERE id = ?',
        [title, org, licenseNo, territory, validity, borderColor, badgeText, image, scope, id]
      );
      return res.json({ id, title, org, licenseNo, territory, validity, borderColor, badgeText, image, scope });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/certificates/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query('DELETE FROM certificates WHERE id = ?', [id]);
      return res.json({ success: true });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});



// ==========================================
// 4. TESTIMONIALS API
// ==========================================
app.get('/api/testimonials', async (req, res) => {
  const showAll = req.query.all === 'true';
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const query = showAll 
        ? 'SELECT * FROM testimonials ORDER BY id DESC'
        : "SELECT * FROM testimonials WHERE status = 'approved' ORDER BY id DESC";
      const [rows] = await pool.query(query);
      return res.json(rows);
    }
  } catch (err) {
    console.error('Error fetching testimonials:', err);
  }
  return res.json(fallbackData.testimonials);
});

app.post('/api/testimonials', async (req, res) => {
  const { title, content, author_name, company_name, status } = req.body;
  if (!title || !content || !author_name) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }
  const defaultStatus = status || 'pending';
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [result] = await pool.query(
        'INSERT INTO testimonials (title, content, author_name, company_name, status) VALUES (?, ?, ?, ?, ?)',
        [title, content, author_name, company_name || '', defaultStatus]
      );
      return res.status(201).json({
        id: result.insertId,
        title,
        content,
        author_name,
        company_name: company_name || '',
        status: defaultStatus
      });
    }
  } catch (err) {
    console.error('Error saving testimonial to MySQL:', err);
  }

  // Fallback
  const newTestimonial = {
    id: Date.now(),
    title,
    content,
    author_name,
    company_name: company_name || '',
    status: defaultStatus
  };
  fallbackData.testimonials.unshift(newTestimonial);
  return res.status(201).json(newTestimonial);
});

app.put('/api/testimonials/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, author_name, company_name, status } = req.body;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query(
        'UPDATE testimonials SET title = ?, content = ?, author_name = ?, company_name = ?, status = ? WHERE id = ?',
        [title, content, author_name, company_name || '', status, id]
      );
      return res.json({ id, title, content, author_name, company_name, status });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/testimonials/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query('DELETE FROM testimonials WHERE id = ?', [id]);
      return res.json({ success: true });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. MENUS API
// ==========================================
app.get('/api/menus', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query("SELECT * FROM menus ORDER BY order_num ASC");
      return res.json(rows);
    }
  } catch (err) {
    console.error(err);
  }
  return res.json([]);
});

app.post('/api/menus', async (req, res) => {
  const { name, url, parent_id, order_num } = req.body;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [result] = await pool.query(
        'INSERT INTO menus (name, url, parent_id, order_num) VALUES (?, ?, ?, ?)',
        [name, url, parent_id || null, order_num || 0]
      );
      return res.status(201).json({ id: result.insertId, name, url, parent_id, order_num });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/menus/:id', async (req, res) => {
  const { id } = req.params;
  const { name, url, parent_id, order_num } = req.body;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query(
        'UPDATE menus SET name = ?, url = ?, parent_id = ?, order_num = ? WHERE id = ?',
        [name, url, parent_id || null, order_num, id]
      );
      return res.json({ id, name, url, parent_id, order_num });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/menus/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query('DELETE FROM menus WHERE id = ?', [id]);
      return res.json({ success: true });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. FOOTER SETTINGS API
// ==========================================
app.get('/api/footer', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT * FROM footer_settings LIMIT 1');
      if (rows.length > 0) {
        return res.json(rows[0]);
      }
    }
  } catch (err) {
    console.error(err);
  }
  return res.json({
    brand_desc: 'Delivering innovative engineering solutions with excellence, integrity and sustainability.',
    facebook_url: '#',
    instagram_url: '#',
    address: 'Doha, Qatar',
    phone: '+974 4463 5250',
    fax: '+974 4441 8567',
    email: 'info@bluecrescent.com',
    website: 'www.bluecrescentqatar.com',
    copyright: '© 2026 BLUE CRESCENT ENGINEERING. All Rights Reserved.'
  });
});

app.put('/api/footer', async (req, res) => {
  const { brand_desc, facebook_url, instagram_url, address, phone, fax, email, website, copyright } = req.body;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT id FROM footer_settings LIMIT 1');
      if (rows.length > 0) {
        await pool.query(
          'UPDATE footer_settings SET brand_desc = ?, facebook_url = ?, instagram_url = ?, address = ?, phone = ?, fax = ?, email = ?, website = ?, copyright = ? WHERE id = ?',
          [brand_desc, facebook_url, instagram_url, address, phone, fax, email, website, copyright, rows[0].id]
        );
      } else {
        await pool.query(
          'INSERT INTO footer_settings (brand_desc, facebook_url, instagram_url, address, phone, fax, email, website, copyright) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [brand_desc, facebook_url, instagram_url, address, phone, fax, email, website, copyright]
        );
      }
      return res.json({ success: true });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7. SERVICES DETAILS & CATEGORIES API
// ==========================================

app.get('/api/service-categories', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const showAll = req.query.all === 'true';
      const sql = showAll 
        ? "SELECT * FROM service_categories ORDER BY display_order ASC, id ASC"
        : "SELECT * FROM service_categories WHERE status = 'Active' ORDER BY display_order ASC, id ASC";
      const [rows] = await pool.query(sql);
      return res.json(rows);
    }
  } catch (err) {
    console.error(err);
  }
  const showAll = req.query.all === 'true';
  const list = fallbackData.service_categories || [];
  return res.json(showAll ? list : list.filter(c => c.status === 'Active'));
});

app.post('/api/service-categories', async (req, res) => {
  const { name, slug, short_description, icon, image, display_order, status, featured } = req.body;
  try {
    const pool = getPool();
    const catSlug = slug || (name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'category');
    if (getIsConnected() && pool) {
      const [result] = await pool.query(
        'INSERT INTO service_categories (name, slug, short_description, icon, image, display_order, status, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, catSlug, short_description || '', icon || 'Building2', image || '', display_order || 0, status || 'Active', featured !== undefined ? featured : 1]
      );
      return res.status(201).json({ id: result.insertId, name, slug: catSlug, short_description, icon, image, display_order, status: status || 'Active', featured });
    } else {
      const newCat = { id: Date.now(), name, slug: catSlug, short_description, icon: icon || 'Building2', image: image || '', display_order: display_order || 0, status: status || 'Active', featured: 1 };
      fallbackData.service_categories.push(newCat);
      return res.status(201).json(newCat);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/service-categories/:id', async (req, res) => {
  const { id } = req.params;
  const { name, slug, short_description, icon, image, display_order, status, featured } = req.body;
  try {
    const pool = getPool();
    const catSlug = slug || (name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'category');
    if (getIsConnected() && pool) {
      // Get old name first
      const [oldCat] = await pool.query('SELECT name FROM service_categories WHERE id = ?', [id]);
      await pool.query(
        'UPDATE service_categories SET name = ?, slug = ?, short_description = ?, icon = ?, image = ?, display_order = ?, status = ?, featured = ? WHERE id = ?',
        [name, catSlug, short_description, icon, image || '', display_order || 0, status || 'Active', featured !== undefined ? featured : 1, id]
      );
      // Update sub-services category name if name changed
      if (oldCat.length > 0 && oldCat[0].name !== name) {
        await pool.query('UPDATE services SET category = ? WHERE category = ? OR category_id = ?', [name, oldCat[0].name, id]);
      }
      return res.json({ id: parseInt(id), name, slug: catSlug, short_description, icon, image, display_order, status, featured });
    } else {
      const idx = fallbackData.service_categories.findIndex(c => c.id === parseInt(id));
      if (idx !== -1) {
        fallbackData.service_categories[idx] = { ...fallbackData.service_categories[idx], name, slug: catSlug, short_description, icon, image, display_order, status, featured };
        return res.json(fallbackData.service_categories[idx]);
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/service-categories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [catRows] = await pool.query('SELECT name FROM service_categories WHERE id = ?', [id]);
      const catName = catRows.length > 0 ? catRows[0].name : null;

      await pool.query('DELETE FROM service_categories WHERE id = ?', [id]);
      if (catName) {
        await pool.query('DELETE FROM services WHERE category_id = ? OR category = ?', [id, catName]);
      } else {
        await pool.query('DELETE FROM services WHERE category_id = ?', [id]);
      }
      return res.json({ success: true, id });
    } else {
      const cat = fallbackData.service_categories.find(c => c.id === parseInt(id));
      if (cat) {
        fallbackData.services = fallbackData.services.filter(s => s.category !== cat.name && s.category_id !== cat.id);
      }
      fallbackData.service_categories = fallbackData.service_categories.filter(c => c.id !== parseInt(id));
      return res.json({ success: true, id });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/services', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const showAll = req.query.all === 'true';
      const sql = showAll 
        ? "SELECT * FROM services ORDER BY display_order ASC, id ASC"
        : "SELECT * FROM services WHERE status = 'Active' ORDER BY display_order ASC, id ASC";
      const [rows] = await pool.query(sql);
      return res.json(rows);
    }
  } catch (err) {
    console.error(err);
  }
  const showAll = req.query.all === 'true';
  const list = fallbackData.services || [];
  return res.json(showAll ? list : list.filter(s => s.status === 'Active'));
});

app.post('/api/services', async (req, res) => {
  const { category, category_id, title, slug, description, bullets, tools, banner_image, icon, display_order, status, featured } = req.body;
  try {
    const pool = getPool();
    const subSlug = slug || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'service');
    const bulletsStr = bullets ? (typeof bullets === 'string' ? bullets : JSON.stringify(bullets)) : '[]';
    const toolsStr = tools ? (typeof tools === 'string' ? tools : JSON.stringify(tools)) : '[]';
    
    if (getIsConnected() && pool) {
      const [result] = await pool.query(
        'INSERT INTO services (category, category_id, title, slug, description, bullets, tools, banner_image, icon, display_order, status, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          category,
          category_id || null,
          title,
          subSlug,
          description || '',
          bulletsStr,
          toolsStr,
          banner_image || '/servicepage1.png',
          icon || '',
          display_order || 0,
          status || 'Active',
          featured !== undefined ? featured : 1
        ]
      );
      return res.status(201).json({ id: result.insertId, category, category_id, title, slug: subSlug, description, bullets, tools, banner_image, icon, display_order, status: status || 'Active', featured });
    } else {
      const newSvc = { id: Date.now(), category, category_id, title, slug: subSlug, description, bullets: bulletsStr, tools: toolsStr, banner_image: banner_image || '/servicepage1.png', icon: icon || '', display_order: display_order || 0, status: status || 'Active', featured: 1 };
      fallbackData.services.push(newSvc);
      return res.status(201).json(newSvc);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/services/:id', async (req, res) => {
  const { id } = req.params;
  const { category, category_id, title, slug, description, bullets, tools, banner_image, icon, display_order, status, featured } = req.body;
  try {
    const pool = getPool();
    const subSlug = slug || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'service');
    const bulletsStr = bullets ? (typeof bullets === 'string' ? bullets : JSON.stringify(bullets)) : '[]';
    const toolsStr = tools ? (typeof tools === 'string' ? tools : JSON.stringify(tools)) : '[]';

    if (getIsConnected() && pool) {
      await pool.query(
        'UPDATE services SET category = ?, category_id = ?, title = ?, slug = ?, description = ?, bullets = ?, tools = ?, banner_image = ?, icon = ?, display_order = ?, status = ?, featured = ? WHERE id = ?',
        [
          category,
          category_id || null,
          title,
          subSlug,
          description,
          bulletsStr,
          toolsStr,
          banner_image,
          icon || '',
          display_order || 0,
          status || 'Active',
          featured !== undefined ? featured : 1,
          id
        ]
      );
      return res.json({ id: parseInt(id), category, category_id, title, slug: subSlug, description, bullets, tools, banner_image, icon, display_order, status, featured });
    } else {
      const idx = fallbackData.services.findIndex(s => s.id === parseInt(id));
      if (idx !== -1) {
        fallbackData.services[idx] = { ...fallbackData.services[idx], category, category_id, title, slug: subSlug, description, bullets: bulletsStr, tools: toolsStr, banner_image, icon, display_order, status, featured };
        return res.json(fallbackData.services[idx]);
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/services/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query('DELETE FROM services WHERE id = ?', [id]);
      return res.json({ success: true, id });
    } else {
      fallbackData.services = fallbackData.services.filter(s => s.id !== parseInt(id));
      return res.json({ success: true, id });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7c. GSAS SERVICE DETAIL CONTENT API
// ==========================================
app.get('/api/gsas', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT * FROM gsas_content LIMIT 1');
      if (rows.length > 0) {
        const row = rows[0];
        return res.json({
          page_title: row.page_title || 'GSAS',
          introduction: row.introduction || '',
          design_title: row.design_title || 'DESIGN',
          design_description: row.design_description || '',
          design_images: typeof row.design_images === 'string' ? JSON.parse(row.design_images) : (row.design_images || []),
          build_title: row.build_title || 'BUILD / CONSTRUCTION',
          build_description: row.build_description || '',
          build_images: typeof row.build_images === 'string' ? JSON.parse(row.build_images) : (row.build_images || []),
          operation_title: row.operation_title || 'OPERATION',
          operation_description: row.operation_description || '',
          operation_images: typeof row.operation_images === 'string' ? JSON.parse(row.operation_images) : (row.operation_images || [])
        });
      }
    }
  } catch (err) {
    console.error('Error fetching GSAS content:', err);
  }
  return res.json(fallbackData.gsas_content || {});
});

app.put('/api/gsas', async (req, res) => {
  try {
    const data = req.body;

    // Helper to process images array and save base64 files
    const processImages = (imgs, prefix) => {
      if (!Array.isArray(imgs)) return [];
      return imgs.map((imgObj, idx) => {
        const rawUrl = typeof imgObj === 'string' ? imgObj : (imgObj.url || '');
        const altText = typeof imgObj === 'object' && imgObj.alt ? imgObj.alt : `GSAS ${prefix} Image ${idx + 1}`;
        const displayOrder = typeof imgObj === 'object' && imgObj.display_order ? imgObj.display_order : (idx + 1);

        let finalUrl = rawUrl;
        if (rawUrl && rawUrl.startsWith('data:')) {
          finalUrl = saveBase64File(rawUrl, `gsas_${prefix.toLowerCase()}_${idx + 1}`);
        }
        return {
          url: finalUrl,
          alt: altText,
          display_order: displayOrder
        };
      });
    };

    const designImages = processImages(data.design_images, 'Design');
    const buildImages = processImages(data.build_images, 'Build');
    const operationImages = processImages(data.operation_images, 'Operation');

    const payload = {
      page_title: data.page_title || 'GSAS',
      introduction: data.introduction || '',
      design_title: data.design_title || 'DESIGN',
      design_description: data.design_description || '',
      design_images: designImages,
      build_title: data.build_title || 'BUILD / CONSTRUCTION',
      build_description: data.build_description || '',
      build_images: buildImages,
      operation_title: data.operation_title || 'OPERATION',
      operation_description: data.operation_description || '',
      operation_images: operationImages
    };

    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT id FROM gsas_content LIMIT 1');
      if (rows.length > 0) {
        await pool.query(`
          UPDATE gsas_content SET
            page_title = ?, introduction = ?,
            design_title = ?, design_description = ?, design_images = ?,
            build_title = ?, build_description = ?, build_images = ?,
            operation_title = ?, operation_description = ?, operation_images = ?
          WHERE id = ?
        `, [
          payload.page_title, payload.introduction,
          payload.design_title, payload.design_description, JSON.stringify(payload.design_images),
          payload.build_title, payload.build_description, JSON.stringify(payload.build_images),
          payload.operation_title, payload.operation_description, JSON.stringify(payload.operation_images),
          rows[0].id
        ]);
      } else {
        await pool.query(`
          INSERT INTO gsas_content (
            page_title, introduction,
            design_title, design_description, design_images,
            build_title, build_description, build_images,
            operation_title, operation_description, operation_images
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          payload.page_title, payload.introduction,
          payload.design_title, payload.design_description, JSON.stringify(payload.design_images),
          payload.build_title, payload.build_description, JSON.stringify(payload.build_images),
          payload.operation_title, payload.operation_description, JSON.stringify(payload.operation_images)
        ]);
      }
    }

    fallbackData.gsas_content = payload;
    return res.json({ success: true, message: 'GSAS content updated successfully.', data: payload });
  } catch (err) {
    console.error('Error updating GSAS content:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7d. LEED SERVICE DETAIL CONTENT API
// ==========================================
app.get('/api/leed', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT * FROM leed_content LIMIT 1');
      if (rows.length > 0) {
        const row = rows[0];
        return res.json({
          page_title: row.page_title || 'LEED',
          introduction: row.introduction || '',
          design_title: row.design_title || 'DESIGN',
          design_description: row.design_description || '',
          design_images: typeof row.design_images === 'string' ? JSON.parse(row.design_images) : (row.design_images || []),
          build_title: row.build_title || 'BUILD / CONSTRUCTION',
          build_description: row.build_description || '',
          build_images: typeof row.build_images === 'string' ? JSON.parse(row.build_images) : (row.build_images || []),
          operation_title: row.operation_title || 'OPERATION',
          operation_description: row.operation_description || '',
          operation_images: typeof row.operation_images === 'string' ? JSON.parse(row.operation_images) : (row.operation_images || [])
        });
      }
    }
  } catch (err) {
    console.error('Error fetching LEED content:', err);
  }
  return res.json(fallbackData.leed_content || {});
});

app.put('/api/leed', async (req, res) => {
  try {
    const data = req.body;

    const processImages = (imgs, prefix) => {
      if (!Array.isArray(imgs)) return [];
      return imgs.map((imgObj, idx) => {
        const rawUrl = typeof imgObj === 'string' ? imgObj : (imgObj.url || '');
        const altText = typeof imgObj === 'object' && imgObj.alt ? imgObj.alt : `LEED ${prefix} Image ${idx + 1}`;
        const displayOrder = typeof imgObj === 'object' && imgObj.display_order ? imgObj.display_order : (idx + 1);

        let finalUrl = rawUrl;
        if (rawUrl && rawUrl.startsWith('data:')) {
          finalUrl = saveBase64File(rawUrl, `leed_${prefix.toLowerCase()}_${idx + 1}`);
        }
        return {
          url: finalUrl,
          alt: altText,
          display_order: displayOrder
        };
      });
    };

    const designImages = processImages(data.design_images, 'Design');
    const buildImages = processImages(data.build_images, 'Build');
    const operationImages = processImages(data.operation_images, 'Operation');

    const payload = {
      page_title: data.page_title || 'LEED',
      introduction: data.introduction || '',
      design_title: data.design_title || 'DESIGN',
      design_description: data.design_description || '',
      design_images: designImages,
      build_title: data.build_title || 'BUILD / CONSTRUCTION',
      build_description: data.build_description || '',
      build_images: buildImages,
      operation_title: data.operation_title || 'OPERATION',
      operation_description: data.operation_description || '',
      operation_images: operationImages
    };

    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT id FROM leed_content LIMIT 1');
      if (rows.length > 0) {
        await pool.query(`
          UPDATE leed_content SET
            page_title = ?, introduction = ?,
            design_title = ?, design_description = ?, design_images = ?,
            build_title = ?, build_description = ?, build_images = ?,
            operation_title = ?, operation_description = ?, operation_images = ?
          WHERE id = ?
        `, [
          payload.page_title, payload.introduction,
          payload.design_title, payload.design_description, JSON.stringify(payload.design_images),
          payload.build_title, payload.build_description, JSON.stringify(payload.build_images),
          payload.operation_title, payload.operation_description, JSON.stringify(payload.operation_images),
          rows[0].id
        ]);
      } else {
        await pool.query(`
          INSERT INTO leed_content (
            page_title, introduction,
            design_title, design_description, design_images,
            build_title, build_description, build_images,
            operation_title, operation_description, operation_images
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          payload.page_title, payload.introduction,
          payload.design_title, payload.design_description, JSON.stringify(payload.design_images),
          payload.build_title, payload.build_description, JSON.stringify(payload.build_images),
          payload.operation_title, payload.operation_description, JSON.stringify(payload.operation_images)
        ]);
      }
    }

    fallbackData.leed_content = payload;
    return res.json({ success: true, message: 'LEED content updated successfully.', data: payload });
  } catch (err) {
    console.error('Error updating LEED content:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7e. ENERGY AUDIT SERVICE DETAIL CONTENT API
// ==========================================
app.get('/api/energy-audit', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT * FROM energy_audit_content LIMIT 1');
      if (rows.length > 0) {
        const row = rows[0];
        return res.json({
          page_title: row.page_title || 'Energy Audit',
          introduction: row.introduction || '',
          residential_title: row.residential_title || 'RESIDENTIAL BUILDING',
          residential_description: row.residential_description || '',
          residential_images: typeof row.residential_images === 'string' ? JSON.parse(row.residential_images) : (row.residential_images || []),
          commercial_title: row.commercial_title || 'COMMERCIAL BUILDING',
          commercial_description: row.commercial_description || '',
          commercial_images: typeof row.commercial_images === 'string' ? JSON.parse(row.commercial_images) : (row.commercial_images || [])
        });
      }
    }
  } catch (err) {
    console.error('Error fetching Energy Audit content:', err);
  }
  return res.json(fallbackData.energy_audit_content || {});
});

app.put('/api/energy-audit', async (req, res) => {
  try {
    const data = req.body;

    const processImages = (imgs, prefix) => {
      if (!Array.isArray(imgs)) return [];
      return imgs.map((imgObj, idx) => {
        const rawUrl = typeof imgObj === 'string' ? imgObj : (imgObj.url || '');
        const altText = typeof imgObj === 'object' && imgObj.alt ? imgObj.alt : `Energy Audit ${prefix} Image ${idx + 1}`;
        const displayOrder = typeof imgObj === 'object' && imgObj.display_order ? imgObj.display_order : (idx + 1);

        let finalUrl = rawUrl;
        if (rawUrl && rawUrl.startsWith('data:')) {
          finalUrl = saveBase64File(rawUrl, `energy_audit_${prefix.toLowerCase()}_${idx + 1}`);
        }
        return {
          url: finalUrl,
          alt: altText,
          display_order: displayOrder
        };
      });
    };

    const residentialImages = processImages(data.residential_images, 'Residential');
    const commercialImages = processImages(data.commercial_images, 'Commercial');

    const payload = {
      page_title: data.page_title || 'Energy Audit',
      introduction: data.introduction || '',
      residential_title: data.residential_title || 'RESIDENTIAL BUILDING',
      residential_description: data.residential_description || '',
      residential_images: residentialImages,
      commercial_title: data.commercial_title || 'COMMERCIAL BUILDING',
      commercial_description: data.commercial_description || '',
      commercial_images: commercialImages
    };

    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT id FROM energy_audit_content LIMIT 1');
      if (rows.length > 0) {
        await pool.query(`
          UPDATE energy_audit_content SET
            page_title = ?, introduction = ?,
            residential_title = ?, residential_description = ?, residential_images = ?,
            commercial_title = ?, commercial_description = ?, commercial_images = ?
          WHERE id = ?
        `, [
          payload.page_title, payload.introduction,
          payload.residential_title, payload.residential_description, JSON.stringify(payload.residential_images),
          payload.commercial_title, payload.commercial_description, JSON.stringify(payload.commercial_images),
          rows[0].id
        ]);
      } else {
        await pool.query(`
          INSERT INTO energy_audit_content (
            page_title, introduction,
            residential_title, residential_description, residential_images,
            commercial_title, commercial_description, commercial_images
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          payload.page_title, payload.introduction,
          payload.residential_title, payload.residential_description, JSON.stringify(payload.residential_images),
          payload.commercial_title, payload.commercial_description, JSON.stringify(payload.commercial_images)
        ]);
      }
    }

    fallbackData.energy_audit_content = payload;
    return res.json({ success: true, message: 'Energy Audit content updated successfully.', data: payload });
  } catch (err) {
    console.error('Error updating Energy Audit content:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7f. ENVIRONMENTAL SERVICE DETAIL CONTENT API
// ==========================================
app.get('/api/environmental', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT * FROM environmental_content LIMIT 1');
      if (rows.length > 0) {
        const row = rows[0];
        return res.json({
          page_title: row.page_title || 'ENVIRONMENTAL',
          introduction: row.introduction || '',
          noise_title: row.noise_title || 'NOISE MONITORING',
          noise_description: row.noise_description || '',
          noise_images: typeof row.noise_images === 'string' ? JSON.parse(row.noise_images) : (row.noise_images || []),
          carbon_title: row.carbon_title || 'CARBON MANAGEMENT',
          carbon_description: row.carbon_description || '',
          carbon_images: typeof row.carbon_images === 'string' ? JSON.parse(row.carbon_images) : (row.carbon_images || [])
        });
      }
    }
  } catch (err) {
    console.error('Error fetching Environmental content:', err);
  }
  return res.json(fallbackData.environmental_content || {});
});

app.put('/api/environmental', async (req, res) => {
  try {
    const data = req.body;

    const processImages = (imgs, prefix) => {
      if (!Array.isArray(imgs)) return [];
      return imgs.map((imgObj, idx) => {
        const rawUrl = typeof imgObj === 'string' ? imgObj : (imgObj.url || '');
        const altText = typeof imgObj === 'object' && imgObj.alt ? imgObj.alt : `Environmental ${prefix} Image ${idx + 1}`;
        const displayOrder = typeof imgObj === 'object' && imgObj.display_order ? imgObj.display_order : (idx + 1);

        let finalUrl = rawUrl;
        if (rawUrl && rawUrl.startsWith('data:')) {
          finalUrl = saveBase64File(rawUrl, `environmental_${prefix.toLowerCase()}_${idx + 1}`);
        }
        return {
          url: finalUrl,
          alt: altText,
          display_order: displayOrder
        };
      });
    };

    const noiseImages = processImages(data.noise_images, 'Noise');
    const carbonImages = processImages(data.carbon_images, 'Carbon');

    const payload = {
      page_title: data.page_title || 'ENVIRONMENTAL',
      introduction: data.introduction || '',
      noise_title: data.noise_title || 'NOISE MONITORING',
      noise_description: data.noise_description || '',
      noise_images: noiseImages,
      carbon_title: data.carbon_title || 'CARBON MANAGEMENT',
      carbon_description: data.carbon_description || '',
      carbon_images: carbonImages
    };

    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT id FROM environmental_content LIMIT 1');
      if (rows.length > 0) {
        await pool.query(`
          UPDATE environmental_content SET
            page_title = ?, introduction = ?,
            noise_title = ?, noise_description = ?, noise_images = ?,
            carbon_title = ?, carbon_description = ?, carbon_images = ?
          WHERE id = ?
        `, [
          payload.page_title, payload.introduction,
          payload.noise_title, payload.noise_description, JSON.stringify(payload.noise_images),
          payload.carbon_title, payload.carbon_description, JSON.stringify(payload.carbon_images),
          rows[0].id
        ]);
      } else {
        await pool.query(`
          INSERT INTO environmental_content (
            page_title, introduction,
            noise_title, noise_description, noise_images,
            carbon_title, carbon_description, carbon_images
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          payload.page_title, payload.introduction,
          payload.noise_title, payload.noise_description, JSON.stringify(payload.noise_images),
          payload.carbon_title, payload.carbon_description, JSON.stringify(payload.carbon_images)
        ]);
      }
    }

    fallbackData.environmental_content = payload;
    return res.json({ success: true, message: 'Environmental content updated successfully.', data: payload });
  } catch (err) {
    console.error('Error updating Environmental content:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7g. LASER SCANNING SERVICE DETAIL CONTENT API
// ==========================================
app.get('/api/laser-scanning', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT * FROM laser_scanning_content LIMIT 1');
      if (rows.length > 0) {
        const row = rows[0];
        return res.json({
          page_title: row.page_title || 'LASER SCANNING SERVICES',
          introduction: row.introduction || '',
          building_title: row.building_title || 'BUILDING',
          building_description: row.building_description || '',
          building_images: typeof row.building_images === 'string' ? JSON.parse(row.building_images) : (row.building_images || []),
          infrastructure_title: row.infrastructure_title || 'INFRASTRUCTURE',
          infrastructure_description: row.infrastructure_description || '',
          infrastructure_images: typeof row.infrastructure_images === 'string' ? JSON.parse(row.infrastructure_images) : (row.infrastructure_images || []),
          recap_title: row.recap_title || 'RECAP WORK',
          recap_description: row.recap_description || '',
          recap_images: typeof row.recap_images === 'string' ? JSON.parse(row.recap_images) : (row.recap_images || []),
          scan_to_bim_title: row.scan_to_bim_title || 'SCAN TO BIM',
          scan_to_bim_description: row.scan_to_bim_description || '',
          scan_to_bim_images: typeof row.scan_to_bim_images === 'string' ? JSON.parse(row.scan_to_bim_images) : (row.scan_to_bim_images || [])
        });
      }
    }
  } catch (err) {
    console.error('Error fetching Laser Scanning content:', err);
  }
  return res.json(fallbackData.laser_scanning_content || {});
});

app.put('/api/laser-scanning', async (req, res) => {
  try {
    const data = req.body;

    const processImages = (imgs, prefix) => {
      if (!Array.isArray(imgs)) return [];
      return imgs.map((imgObj, idx) => {
        const rawUrl = typeof imgObj === 'string' ? imgObj : (imgObj.url || '');
        const altText = typeof imgObj === 'object' && imgObj.alt ? imgObj.alt : `Laser Scanning ${prefix} Image ${idx + 1}`;
        const displayOrder = typeof imgObj === 'object' && imgObj.display_order ? imgObj.display_order : (idx + 1);

        let finalUrl = rawUrl;
        if (rawUrl && rawUrl.startsWith('data:')) {
          finalUrl = saveBase64File(rawUrl, `laser_scanning_${prefix.toLowerCase()}_${idx + 1}`);
        }
        return {
          url: finalUrl,
          alt: altText,
          display_order: displayOrder
        };
      });
    };

    const buildingImages = processImages(data.building_images, 'Building');
    const infrastructureImages = processImages(data.infrastructure_images, 'Infrastructure');
    const recapImages = processImages(data.recap_images, 'Recap');
    const scanToBimImages = processImages(data.scan_to_bim_images, 'ScanToBim');

    const payload = {
      page_title: data.page_title || 'LASER SCANNING SERVICES',
      introduction: data.introduction || '',
      building_title: data.building_title || 'BUILDING',
      building_description: data.building_description || '',
      building_images: buildingImages,
      infrastructure_title: data.infrastructure_title || 'INFRASTRUCTURE',
      infrastructure_description: data.infrastructure_description || '',
      infrastructure_images: infrastructureImages,
      recap_title: data.recap_title || 'RECAP WORK',
      recap_description: data.recap_description || '',
      recap_images: recapImages,
      scan_to_bim_title: data.scan_to_bim_title || 'SCAN TO BIM',
      scan_to_bim_description: data.scan_to_bim_description || '',
      scan_to_bim_images: scanToBimImages
    };

    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT id FROM laser_scanning_content LIMIT 1');
      if (rows.length > 0) {
        await pool.query(`
          UPDATE laser_scanning_content SET
            page_title = ?, introduction = ?,
            building_title = ?, building_description = ?, building_images = ?,
            infrastructure_title = ?, infrastructure_description = ?, infrastructure_images = ?,
            recap_title = ?, recap_description = ?, recap_images = ?,
            scan_to_bim_title = ?, scan_to_bim_description = ?, scan_to_bim_images = ?
          WHERE id = ?
        `, [
          payload.page_title, payload.introduction,
          payload.building_title, payload.building_description, JSON.stringify(payload.building_images),
          payload.infrastructure_title, payload.infrastructure_description, JSON.stringify(payload.infrastructure_images),
          payload.recap_title, payload.recap_description, JSON.stringify(payload.recap_images),
          payload.scan_to_bim_title, payload.scan_to_bim_description, JSON.stringify(payload.scan_to_bim_images),
          rows[0].id
        ]);
      } else {
        await pool.query(`
          INSERT INTO laser_scanning_content (
            page_title, introduction,
            building_title, building_description, building_images,
            infrastructure_title, infrastructure_description, infrastructure_images,
            recap_title, recap_description, recap_images,
            scan_to_bim_title, scan_to_bim_description, scan_to_bim_images
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          payload.page_title, payload.introduction,
          payload.building_title, payload.building_description, JSON.stringify(payload.building_images),
          payload.infrastructure_title, payload.infrastructure_description, JSON.stringify(payload.infrastructure_images),
          payload.recap_title, payload.recap_description, JSON.stringify(payload.recap_images),
          payload.scan_to_bim_title, payload.scan_to_bim_description, JSON.stringify(payload.scan_to_bim_images)
        ]);
      }
    }

    fallbackData.laser_scanning_content = payload;
    return res.json({ success: true, message: 'Laser Scanning content updated successfully.', data: payload });
  } catch (err) {
    console.error('Error updating Laser Scanning content:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7h. CAD SERVICE DETAIL CONTENT API
// ==========================================
app.get('/api/cad', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT * FROM cad_content LIMIT 1');
      if (rows.length > 0) {
        const row = rows[0];
        return res.json({
          page_title: row.page_title || 'CAD',
          introduction: row.introduction || '',
          arch_title: row.arch_title || 'ARCHITECTURE',
          arch_description: row.arch_description || '',
          arch_images: typeof row.arch_images === 'string' ? JSON.parse(row.arch_images) : (row.arch_images || []),
          struct_title: row.struct_title || 'STRUCTURE',
          struct_description: row.struct_description || '',
          struct_images: typeof row.struct_images === 'string' ? JSON.parse(row.struct_images) : (row.struct_images || []),
          interior_title: row.interior_title || 'INTERIOR',
          interior_description: row.interior_description || '',
          interior_images: typeof row.interior_images === 'string' ? JSON.parse(row.interior_images) : (row.interior_images || []),
          mech_title: row.mech_title || 'MECHANICAL',
          mech_description: row.mech_description || '',
          mech_images: typeof row.mech_images === 'string' ? JSON.parse(row.mech_images) : (row.mech_images || []),
          elec_title: row.elec_title || 'ELECTRICAL',
          elec_description: row.elec_description || '',
          elec_images: typeof row.elec_images === 'string' ? JSON.parse(row.elec_images) : (row.elec_images || []),
          landscape_title: row.landscape_title || 'LANDSCAPING',
          landscape_description: row.landscape_description || '',
          landscape_images: typeof row.landscape_images === 'string' ? JSON.parse(row.landscape_images) : (row.landscape_images || []),
          road_title: row.road_title || 'ROAD',
          road_description: row.road_description || '',
          road_images: typeof row.road_images === 'string' ? JSON.parse(row.road_images) : (row.road_images || []),
          street_light_title: row.street_light_title || 'STREET LIGHT',
          street_light_description: row.street_light_description || '',
          street_light_images: typeof row.street_light_images === 'string' ? JSON.parse(row.street_light_images) : (row.street_light_images || []),
          util_title: row.util_title || 'UNDERGROUND UTILITIES',
          util_description: row.util_description || '',
          util_images: typeof row.util_images === 'string' ? JSON.parse(row.util_images) : (row.util_images || [])
        });
      }
    }
  } catch (err) {
    console.error('Error fetching CAD content:', err);
  }
  return res.json(fallbackData.cad_content || {});
});

app.put('/api/cad', async (req, res) => {
  try {
    const data = req.body;

    const processImages = (imgs, prefix) => {
      if (!Array.isArray(imgs)) return [];
      return imgs.map((imgObj, idx) => {
        const rawUrl = typeof imgObj === 'string' ? imgObj : (imgObj.url || '');
        const altText = typeof imgObj === 'object' && imgObj.alt ? imgObj.alt : `CAD ${prefix} Image ${idx + 1}`;
        const displayOrder = typeof imgObj === 'object' && imgObj.display_order ? imgObj.display_order : (idx + 1);

        let finalUrl = rawUrl;
        if (rawUrl && rawUrl.startsWith('data:')) {
          finalUrl = saveBase64File(rawUrl, `cad_${prefix.toLowerCase()}_${idx + 1}`);
        }
        return {
          url: finalUrl,
          alt: altText,
          display_order: displayOrder
        };
      });
    };

    const archImages = processImages(data.arch_images, 'Architecture');
    const structImages = processImages(data.struct_images, 'Structure');
    const interiorImages = processImages(data.interior_images, 'Interior');
    const mechImages = processImages(data.mech_images, 'Mechanical');
    const elecImages = processImages(data.elec_images, 'Electrical');
    const landscapeImages = processImages(data.landscape_images, 'Landscaping');
    const roadImages = processImages(data.road_images, 'Road');
    const streetLightImages = processImages(data.street_light_images, 'StreetLight');
    const utilImages = processImages(data.util_images, 'UndergroundUtilities');

    const payload = {
      page_title: data.page_title || 'CAD',
      introduction: data.introduction || '',
      arch_title: data.arch_title || 'ARCHITECTURE',
      arch_description: data.arch_description || '',
      arch_images: archImages,
      struct_title: data.struct_title || 'STRUCTURE',
      struct_description: data.struct_description || '',
      struct_images: structImages,
      interior_title: data.interior_title || 'INTERIOR',
      interior_description: data.interior_description || '',
      interior_images: interiorImages,
      mech_title: data.mech_title || 'MECHANICAL',
      mech_description: data.mech_description || '',
      mech_images: mechImages,
      elec_title: data.elec_title || 'ELECTRICAL',
      elec_description: data.elec_description || '',
      elec_images: elecImages,
      landscape_title: data.landscape_title || 'LANDSCAPING',
      landscape_description: data.landscape_description || '',
      landscape_images: landscapeImages,
      road_title: data.road_title || 'ROAD',
      road_description: data.road_description || '',
      road_images: roadImages,
      street_light_title: data.street_light_title || 'STREET LIGHT',
      street_light_description: data.street_light_description || '',
      street_light_images: streetLightImages,
      util_title: data.util_title || 'UNDERGROUND UTILITIES',
      util_description: data.util_description || '',
      util_images: utilImages
    };

    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT id FROM cad_content LIMIT 1');
      if (rows.length > 0) {
        await pool.query(`
          UPDATE cad_content SET
            page_title = ?, introduction = ?,
            arch_title = ?, arch_description = ?, arch_images = ?,
            struct_title = ?, struct_description = ?, struct_images = ?,
            interior_title = ?, interior_description = ?, interior_images = ?,
            mech_title = ?, mech_description = ?, mech_images = ?,
            elec_title = ?, elec_description = ?, elec_images = ?,
            landscape_title = ?, landscape_description = ?, landscape_images = ?,
            road_title = ?, road_description = ?, road_images = ?,
            street_light_title = ?, street_light_description = ?, street_light_images = ?,
            util_title = ?, util_description = ?, util_images = ?
          WHERE id = ?
        `, [
          payload.page_title, payload.introduction,
          payload.arch_title, payload.arch_description, JSON.stringify(payload.arch_images),
          payload.struct_title, payload.struct_description, JSON.stringify(payload.struct_images),
          payload.interior_title, payload.interior_description, JSON.stringify(payload.interior_images),
          payload.mech_title, payload.mech_description, JSON.stringify(payload.mech_images),
          payload.elec_title, payload.elec_description, JSON.stringify(payload.elec_images),
          payload.landscape_title, payload.landscape_description, JSON.stringify(payload.landscape_images),
          payload.road_title, payload.road_description, JSON.stringify(payload.road_images),
          payload.street_light_title, payload.street_light_description, JSON.stringify(payload.street_light_images),
          payload.util_title, payload.util_description, JSON.stringify(payload.util_images),
          rows[0].id
        ]);
      } else {
        await pool.query(`
          INSERT INTO cad_content (
            page_title, introduction,
            arch_title, arch_description, arch_images,
            struct_title, struct_description, struct_images,
            interior_title, interior_description, interior_images,
            mech_title, mech_description, mech_images,
            elec_title, elec_description, elec_images,
            landscape_title, landscape_description, landscape_images,
            road_title, road_description, road_images,
            street_light_title, street_light_description, street_light_images,
            util_title, util_description, util_images
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          payload.page_title, payload.introduction,
          payload.arch_title, payload.arch_description, JSON.stringify(payload.arch_images),
          payload.struct_title, payload.struct_description, JSON.stringify(payload.struct_images),
          payload.interior_title, payload.interior_description, JSON.stringify(payload.interior_images),
          payload.mech_title, payload.mech_description, JSON.stringify(payload.mech_images),
          payload.elec_title, payload.elec_description, JSON.stringify(payload.elec_images),
          payload.landscape_title, payload.landscape_description, JSON.stringify(payload.landscape_images),
          payload.road_title, payload.road_description, JSON.stringify(payload.road_images),
          payload.street_light_title, payload.street_light_description, JSON.stringify(payload.street_light_images),
          payload.util_title, payload.util_description, JSON.stringify(payload.util_images)
        ]);
      }
    }

    fallbackData.cad_content = payload;
    return res.json({ success: true, message: 'CAD content updated successfully.', data: payload });
  } catch (err) {
    console.error('Error updating CAD content:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7i. BIM SERVICE DETAIL CONTENT API
// ==========================================
app.get('/api/bim', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT * FROM bim_content LIMIT 1');
      if (rows.length > 0) {
        const row = rows[0];
        return res.json({
          page_title: row.page_title || 'BIM',
          introduction: row.introduction || '',
          building_main_title: row.building_main_title || 'BUILDING',
          building_main_desc: row.building_main_desc || '',
          b_arch_title: row.b_arch_title || 'ARCHITECTURE',
          b_arch_desc: row.b_arch_desc || '',
          b_arch_images: typeof row.b_arch_images === 'string' ? JSON.parse(row.b_arch_images) : (row.b_arch_images || []),
          b_struct_title: row.b_struct_title || 'STRUCTURE',
          b_struct_desc: row.b_struct_desc || '',
          b_struct_images: typeof row.b_struct_images === 'string' ? JSON.parse(row.b_struct_images) : (row.b_struct_images || []),
          b_interior_title: row.b_interior_title || 'INTERIOR',
          b_interior_desc: row.b_interior_desc || '',
          b_interior_images: typeof row.b_interior_images === 'string' ? JSON.parse(row.b_interior_images) : (row.b_interior_images || []),
          b_mep_title: row.b_mep_title || 'MECHANICAL ELECTRICAL',
          b_mep_desc: row.b_mep_desc || '',
          b_mep_images: typeof row.b_mep_images === 'string' ? JSON.parse(row.b_mep_images) : (row.b_mep_images || []),
          infra_main_title: row.infra_main_title || 'INFRASTRUCTURE',
          infra_main_desc: row.infra_main_desc || '',
          i_landscape_title: row.i_landscape_title || 'LANDSCAPING',
          i_landscape_desc: row.i_landscape_desc || '',
          i_landscape_images: typeof row.i_landscape_images === 'string' ? JSON.parse(row.i_landscape_images) : (row.i_landscape_images || []),
          i_road_title: row.i_road_title || 'ROAD',
          i_road_desc: row.i_road_desc || '',
          i_road_images: typeof row.i_road_images === 'string' ? JSON.parse(row.i_road_images) : (row.i_road_images || []),
          i_street_light_title: row.i_street_light_title || 'STREET LIGHT',
          i_street_light_desc: row.i_street_light_desc || '',
          i_street_light_images: typeof row.i_street_light_images === 'string' ? JSON.parse(row.i_street_light_images) : (row.i_street_light_images || []),
          i_util_title: row.i_util_title || 'UNDERGROUND UTILITIES',
          i_util_desc: row.i_util_desc || '',
          i_util_images: typeof row.i_util_images === 'string' ? JSON.parse(row.i_util_images) : (row.i_util_images || []),
          fourd_main_title: row.fourd_main_title || '4D',
          fourd_main_desc: row.fourd_main_desc || '',
          fourd_b_title: row.fourd_b_title || 'BUILDING',
          fourd_b_desc: row.fourd_b_desc || '',
          fourd_b_images: typeof row.fourd_b_images === 'string' ? JSON.parse(row.fourd_b_images) : (row.fourd_b_images || []),
          fourd_i_title: row.fourd_i_title || 'INFRASTRUCTURE',
          fourd_i_desc: row.fourd_i_desc || '',
          fourd_i_images: typeof row.fourd_i_images === 'string' ? JSON.parse(row.fourd_i_images) : (row.fourd_i_images || []),
          fived_main_title: row.fived_main_title || '5D',
          fived_main_desc: row.fived_main_desc || '',
          fived_b_title: row.fived_b_title || 'BUILDING',
          fived_b_desc: row.fived_b_desc || '',
          fived_b_images: typeof row.fived_b_images === 'string' ? JSON.parse(row.fived_b_images) : (row.fived_b_images || []),
          fived_i_title: row.fived_i_title || 'INFRASTRUCTURE',
          fived_i_desc: row.fived_i_desc || '',
          fived_i_images: typeof row.fived_i_images === 'string' ? JSON.parse(row.fived_i_images) : (row.fived_i_images || []),
          render_main_title: row.render_main_title || 'RENDERING',
          render_main_desc: row.render_main_desc || '',
          r_walkthrough_title: row.r_walkthrough_title || 'WALK THROUGH',
          r_walkthrough_desc: row.r_walkthrough_desc || '',
          r_walkthrough_images: typeof row.r_walkthrough_images === 'string' ? JSON.parse(row.r_walkthrough_images) : (row.r_walkthrough_images || []),
          report_main_title: row.report_main_title || 'REPORTING',
          report_main_desc: row.report_main_desc || '',
          rep_periodic_title: row.rep_periodic_title || 'PERIODICALLY',
          rep_periodic_desc: row.rep_periodic_desc || '',
          rep_periodic_images: typeof row.rep_periodic_images === 'string' ? JSON.parse(row.rep_periodic_images) : (row.rep_periodic_images || [])
        });
      }
    }
  } catch (err) {
    console.error('Error fetching BIM content:', err);
  }
  return res.json(fallbackData.bim_content || {});
});

app.put('/api/bim', async (req, res) => {
  try {
    const data = req.body;

    const processImages = (imgs, prefix) => {
      if (!Array.isArray(imgs)) return [];
      return imgs.map((imgObj, idx) => {
        const rawUrl = typeof imgObj === 'string' ? imgObj : (imgObj.url || '');
        const altText = typeof imgObj === 'object' && imgObj.alt ? imgObj.alt : `BIM ${prefix} Image ${idx + 1}`;
        const displayOrder = typeof imgObj === 'object' && imgObj.display_order ? imgObj.display_order : (idx + 1);

        let finalUrl = rawUrl;
        if (rawUrl && rawUrl.startsWith('data:')) {
          finalUrl = saveBase64File(rawUrl, `bim_${prefix.toLowerCase()}_${idx + 1}`);
        }
        return {
          url: finalUrl,
          alt: altText,
          display_order: displayOrder
        };
      });
    };

    const bArchImages = processImages(data.b_arch_images, 'BuildingArch');
    const bStructImages = processImages(data.b_struct_images, 'BuildingStruct');
    const bInteriorImages = processImages(data.b_interior_images, 'BuildingInterior');
    const bMepImages = processImages(data.b_mep_images, 'BuildingMep');
    const iLandscapeImages = processImages(data.i_landscape_images, 'InfraLandscape');
    const iRoadImages = processImages(data.i_road_images, 'InfraRoad');
    const iStreetLightImages = processImages(data.i_street_light_images, 'InfraStreetLight');
    const iUtilImages = processImages(data.i_util_images, 'InfraUtilities');
    const fourdBImages = processImages(data.fourd_b_images, '4DBuilding');
    const fourdIImages = processImages(data.fourd_i_images, '4DInfra');
    const fivedBImages = processImages(data.fived_b_images, '5DBuilding');
    const fivedIImages = processImages(data.fived_i_images, '5DInfra');
    const rWalkthroughImages = processImages(data.r_walkthrough_images, 'RenderWalkthrough');
    const repPeriodicImages = processImages(data.rep_periodic_images, 'ReportPeriodic');

    const payload = {
      page_title: data.page_title || 'BIM',
      introduction: data.introduction || '',
      building_main_title: data.building_main_title || 'BUILDING',
      building_main_desc: data.building_main_desc || '',
      b_arch_title: data.b_arch_title || 'ARCHITECTURE',
      b_arch_desc: data.b_arch_desc || '',
      b_arch_images: bArchImages,
      b_struct_title: data.b_struct_title || 'STRUCTURE',
      b_struct_desc: data.b_struct_desc || '',
      b_struct_images: bStructImages,
      b_interior_title: data.b_interior_title || 'INTERIOR',
      b_interior_desc: data.b_interior_desc || '',
      b_interior_images: bInteriorImages,
      b_mep_title: data.b_mep_title || 'MECHANICAL ELECTRICAL',
      b_mep_desc: data.b_mep_desc || '',
      b_mep_images: bMepImages,
      infra_main_title: data.infra_main_title || 'INFRASTRUCTURE',
      infra_main_desc: data.infra_main_desc || '',
      i_landscape_title: data.i_landscape_title || 'LANDSCAPING',
      i_landscape_desc: data.i_landscape_desc || '',
      i_landscape_images: iLandscapeImages,
      i_road_title: data.i_road_title || 'ROAD',
      i_road_desc: data.i_road_desc || '',
      i_road_images: iRoadImages,
      i_street_light_title: data.i_street_light_title || 'STREET LIGHT',
      i_street_light_desc: data.i_street_light_desc || '',
      i_street_light_images: iStreetLightImages,
      i_util_title: data.i_util_title || 'UNDERGROUND UTILITIES',
      i_util_desc: data.i_util_desc || '',
      i_util_images: iUtilImages,
      fourd_main_title: data.fourd_main_title || '4D',
      fourd_main_desc: data.fourd_main_desc || '',
      fourd_b_title: data.fourd_b_title || 'BUILDING',
      fourd_b_desc: data.fourd_b_desc || '',
      fourd_b_images: fourdBImages,
      fourd_i_title: data.fourd_i_title || 'INFRASTRUCTURE',
      fourd_i_desc: data.fourd_i_desc || '',
      fourd_i_images: fourdIImages,
      fived_main_title: data.fived_main_title || '5D',
      fived_main_desc: data.fived_main_desc || '',
      fived_b_title: data.fived_b_title || 'BUILDING',
      fived_b_desc: data.fived_b_desc || '',
      fived_b_images: fivedBImages,
      fived_i_title: data.fived_i_title || 'INFRASTRUCTURE',
      fived_i_desc: data.fived_i_desc || '',
      fived_i_images: fivedIImages,
      render_main_title: data.render_main_title || 'RENDERING',
      render_main_desc: data.render_main_desc || '',
      r_walkthrough_title: data.r_walkthrough_title || 'WALK THROUGH',
      r_walkthrough_desc: data.r_walkthrough_desc || '',
      r_walkthrough_images: rWalkthroughImages,
      report_main_title: data.report_main_title || 'REPORTING',
      report_main_desc: data.report_main_desc || '',
      rep_periodic_title: data.rep_periodic_title || 'PERIODICALLY',
      rep_periodic_desc: data.rep_periodic_desc || '',
      rep_periodic_images: repPeriodicImages
    };

    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT id FROM bim_content LIMIT 1');
      if (rows.length > 0) {
        await pool.query(`
          UPDATE bim_content SET
            page_title = ?, introduction = ?,
            building_main_title = ?, building_main_desc = ?,
            b_arch_title = ?, b_arch_desc = ?, b_arch_images = ?,
            b_struct_title = ?, b_struct_desc = ?, b_struct_images = ?,
            b_interior_title = ?, b_interior_desc = ?, b_interior_images = ?,
            b_mep_title = ?, b_mep_desc = ?, b_mep_images = ?,
            infra_main_title = ?, infra_main_desc = ?,
            i_landscape_title = ?, i_landscape_desc = ?, i_landscape_images = ?,
            i_road_title = ?, i_road_desc = ?, i_road_images = ?,
            i_street_light_title = ?, i_street_light_desc = ?, i_street_light_images = ?,
            i_util_title = ?, i_util_desc = ?, i_util_images = ?,
            fourd_main_title = ?, fourd_main_desc = ?,
            fourd_b_title = ?, fourd_b_desc = ?, fourd_b_images = ?,
            fourd_i_title = ?, fourd_i_desc = ?, fourd_i_images = ?,
            fived_main_title = ?, fived_main_desc = ?,
            fived_b_title = ?, fived_b_desc = ?, fived_b_images = ?,
            fived_i_title = ?, fived_i_desc = ?, fived_i_images = ?,
            render_main_title = ?, render_main_desc = ?,
            r_walkthrough_title = ?, r_walkthrough_desc = ?, r_walkthrough_images = ?,
            report_main_title = ?, report_main_desc = ?,
            rep_periodic_title = ?, rep_periodic_desc = ?, rep_periodic_images = ?
          WHERE id = ?
        `, [
          payload.page_title, payload.introduction,
          payload.building_main_title, payload.building_main_desc,
          payload.b_arch_title, payload.b_arch_desc, JSON.stringify(payload.b_arch_images),
          payload.b_struct_title, payload.b_struct_desc, JSON.stringify(payload.b_struct_images),
          payload.b_interior_title, payload.b_interior_desc, JSON.stringify(payload.b_interior_images),
          payload.b_mep_title, payload.b_mep_desc, JSON.stringify(payload.b_mep_images),
          payload.infra_main_title, payload.infra_main_desc,
          payload.i_landscape_title, payload.i_landscape_desc, JSON.stringify(payload.i_landscape_images),
          payload.i_road_title, payload.i_road_desc, JSON.stringify(payload.i_road_images),
          payload.i_street_light_title, payload.i_street_light_desc, JSON.stringify(payload.i_street_light_images),
          payload.i_util_title, payload.i_util_desc, JSON.stringify(payload.i_util_images),
          payload.fourd_main_title, payload.fourd_main_desc,
          payload.fourd_b_title, payload.fourd_b_desc, JSON.stringify(payload.fourd_b_images),
          payload.fourd_i_title, payload.fourd_i_desc, JSON.stringify(payload.fourd_i_images),
          payload.fived_main_title, payload.fived_main_desc,
          payload.fived_b_title, payload.fived_b_desc, JSON.stringify(payload.fived_b_images),
          payload.fived_i_title, payload.fived_i_desc, JSON.stringify(payload.fived_i_images),
          payload.render_main_title, payload.render_main_desc,
          payload.r_walkthrough_title, payload.r_walkthrough_desc, JSON.stringify(payload.r_walkthrough_images),
          payload.report_main_title, payload.report_main_desc,
          payload.rep_periodic_title, payload.rep_periodic_desc, JSON.stringify(payload.rep_periodic_images),
          rows[0].id
        ]);
      } else {
        await pool.query(`
          INSERT INTO bim_content (
            page_title, introduction,
            building_main_title, building_main_desc,
            b_arch_title, b_arch_desc, b_arch_images,
            b_struct_title, b_struct_desc, b_struct_images,
            b_interior_title, b_interior_desc, b_interior_images,
            b_mep_title, b_mep_desc, b_mep_images,
            infra_main_title, infra_main_desc,
            i_landscape_title, i_landscape_desc, i_landscape_images,
            i_road_title, i_road_desc, i_road_images,
            i_street_light_title, i_street_light_desc, i_street_light_images,
            i_util_title, i_util_desc, i_util_images,
            fourd_main_title, fourd_main_desc,
            fourd_b_title, fourd_b_desc, fourd_b_images,
            fourd_i_title, fourd_i_desc, fourd_i_images,
            fived_main_title, fived_main_desc,
            fived_b_title, fived_b_desc, fived_b_images,
            fived_i_title, fived_i_desc, fived_i_images,
            render_main_title, render_main_desc,
            r_walkthrough_title, r_walkthrough_desc, r_walkthrough_images,
            report_main_title, report_main_desc,
            rep_periodic_title, rep_periodic_desc, rep_periodic_images
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          payload.page_title, payload.introduction,
          payload.building_main_title, payload.building_main_desc,
          payload.b_arch_title, payload.b_arch_desc, JSON.stringify(payload.b_arch_images),
          payload.b_struct_title, payload.b_struct_desc, JSON.stringify(payload.b_struct_images),
          payload.b_interior_title, payload.b_interior_desc, JSON.stringify(payload.b_interior_images),
          payload.b_mep_title, payload.b_mep_desc, JSON.stringify(payload.b_mep_images),
          payload.infra_main_title, payload.infra_main_desc,
          payload.i_landscape_title, payload.i_landscape_desc, JSON.stringify(payload.i_landscape_images),
          payload.i_road_title, payload.i_road_desc, JSON.stringify(payload.i_road_images),
          payload.i_street_light_title, payload.i_street_light_desc, JSON.stringify(payload.i_street_light_images),
          payload.i_util_title, payload.i_util_desc, JSON.stringify(payload.i_util_images),
          payload.fourd_main_title, payload.fourd_main_desc,
          payload.fourd_b_title, payload.fourd_b_desc, JSON.stringify(payload.fourd_b_images),
          payload.fourd_i_title, payload.fourd_i_desc, JSON.stringify(payload.fourd_i_images),
          payload.fived_main_title, payload.fived_main_desc,
          payload.fived_b_title, payload.fived_b_desc, JSON.stringify(payload.fived_b_images),
          payload.fived_i_title, payload.fived_i_desc, JSON.stringify(payload.fived_i_images),
          payload.render_main_title, payload.render_main_desc,
          payload.r_walkthrough_title, payload.r_walkthrough_desc, JSON.stringify(payload.r_walkthrough_images),
          payload.report_main_title, payload.report_main_desc,
          payload.rep_periodic_title, payload.rep_periodic_desc, JSON.stringify(payload.rep_periodic_images)
        ]);
      }
    }

    fallbackData.bim_content = payload;
    return res.json({ success: true, message: 'BIM content updated successfully.', data: payload });
  } catch (err) {
    console.error('Error updating BIM content:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 8. CONTACT FORM SUBMISSION
// ==========================================
app.post('/api/contact', async (req, res) => {
  const { name, company, phone, email, country, comments } = req.body;
  if (!name || !company || !email) {
    return res.status(400).json({ error: 'Name, company, and email are required.' });
  }

  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query(
        'INSERT INTO contact_submissions (name, email, message) VALUES (?, ?, ?)',
        [name, email, `Company: ${company} | Phone: ${phone || ''} | Country: ${country || ''} | Message: ${comments || ''}`]
      );
      return res.status(201).json({ success: true, message: 'Contact message saved successfully.' });
    }
  } catch (err) {
    console.error('Error saving contact to MySQL:', err);
  }

  return res.status(201).json({ success: true, message: 'Message received (Demo mode).' });
});

// ==========================================
// 9. HERO SLIDES API
// ==========================================
app.get('/api/hero_slides', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT * FROM hero_slides ORDER BY order_num ASC, id ASC');
      return res.json(rows);
    }
  } catch (err) {
    console.error(err);
  }
  return res.json([]);
});

app.post('/api/hero_slides', async (req, res) => {
  let { title, subtitle, btn1_text, btn2_text, image, status, order_num } = req.body;
  if (image && image.startsWith('data:')) {
    image = saveBase64File(image, 'hero_slide');
  }
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [result] = await pool.query(
        'INSERT INTO hero_slides (title, subtitle, btn1_text, btn2_text, image, status, order_num) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, subtitle || '', btn1_text || '', btn2_text || '', image || null, status || 'published', order_num || 0]
      );
      return res.status(201).json({ id: result.insertId, title, subtitle, btn1_text, btn2_text, image, status, order_num });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/hero_slides/:id', async (req, res) => {
  const { id } = req.params;
  let { title, subtitle, btn1_text, btn2_text, image, status, order_num } = req.body;
  if (image && image.startsWith('data:')) {
    image = saveBase64File(image, 'hero_slide');
  }
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query(
        'UPDATE hero_slides SET title = ?, subtitle = ?, btn1_text = ?, btn2_text = ?, image = ?, status = ?, order_num = ? WHERE id = ?',
        [title, subtitle, btn1_text, btn2_text, image, status, order_num, id]
      );
      return res.json({ id, title, subtitle, btn1_text, btn2_text, image, status, order_num });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/hero_slides/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query('DELETE FROM hero_slides WHERE id = ?', [id]);
      return res.json({ success: true });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 10. SUBSCRIBERS API
// ==========================================
app.get('/api/subscribers', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT * FROM subscribers ORDER BY id DESC');
      return res.json(rows);
    }
  } catch (err) {
    console.error(err);
  }
  return res.json([]);
});

app.post('/api/subscribers', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query('INSERT INTO subscribers (email) VALUES (?)', [email]);
      return res.status(201).json({ success: true });
    }
  } catch (err) {
    console.error(err);
    // Ignore duplicate entries for demo robustness
    return res.status(201).json({ success: true, message: 'Subscribed' });
  }
});

app.delete('/api/subscribers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query('DELETE FROM subscribers WHERE id = ?', [id]);
      return res.json({ success: true });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 11. CONTACT INQUIRIES API (GET/DELETE)
// ==========================================
app.get('/api/contact', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT * FROM contact_submissions ORDER BY id DESC');
      return res.json(rows);
    }
  } catch (err) {
    console.error(err);
  }
  return res.json([]);
});

app.delete('/api/contact/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query('DELETE FROM contact_submissions WHERE id = ?', [id]);
      return res.json({ success: true });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// PROJECTS API
// ==========================================
const fallbackProjects = [
  {
    id: 1,
    name: 'Qatar Free Zone Project',
    slug: 'qatar-free-zone',
    division_type: 'BIM Projects',
    client: 'Free Zones Authority (QFZA)',
    contractor: 'Consolidated Contractors Company (CCC)',
    consultant: 'Dar Al-Handasah',
    location: 'Doha, Qatar',
    sector: 'Infrastructure & Buildings',
    status: 'Completed',
    year: '2024',
    short_description: 'Multidisciplinary BIM coordination and digital asset information supporting infrastructure and building requirements.',
    description: 'Development and coordination of multidisciplinary BIM models and preparation of digital asset information to support operational requirements for Qatar Free Zone development.',
    services: JSON.stringify(['BIM', 'Digital Twin', 'Laser Scanning']),
    disciplines: JSON.stringify(['Architecture', 'Structure', 'MEP', 'Infrastructure']),
    project_stage: 'As-Built / Asset Handover',
    bim_level: 'LOD 500',
    scope_of_work: 'Development and coordination of multidisciplinary BIM models and preparation of digital asset information to support operational requirements.',
    deliverables: JSON.stringify(['BIM Models', 'As-Built Information', 'Asset Data', 'Digital Twin Integration']),
    technologies: JSON.stringify(['Revit', 'Navisworks', 'Digital Twin Platform', 'AutoCAD']),
    project_highlights: 'Multidisciplinary BIM coordination and digital asset information supporting infrastructure and building requirements.',
    image: '/project1.png',
    display_order: 1
  },
  {
    id: 2,
    name: 'Hamad Port Maritime Facilities',
    slug: 'hamad-port-maritime',
    division_type: 'CAD Projects',
    client: 'Mwani Qatar / Ministry of Transport',
    contractor: 'China Harbour Engineering Company',
    consultant: 'AECOM',
    location: 'Umm Said, Qatar',
    sector: 'Transportation & Maritime',
    status: 'Completed',
    year: '2023',
    short_description: 'Multidisciplinary CAD drafting, shop drawings, and engineering documentation support.',
    description: 'Comprehensive CAD drafting, shop drawings, as-built documentation, and GSAS green building compliance management for maritime port facilities.',
    services: JSON.stringify(['CAD', 'GSAS', 'Engineering Services']),
    disciplines: JSON.stringify(['Infrastructure', 'Roads', 'Utilities', 'MEP']),
    project_stage: 'Construction & As-Built',
    bim_level: 'LOD 300',
    scope_of_work: 'Comprehensive CAD drafting, shop drawings, and GSAS green building compliance management for maritime port facilities.',
    deliverables: JSON.stringify(['Shop Drawings', 'As-Built Documentation', 'GSAS Certification Data']),
    technologies: JSON.stringify(['AutoCAD', 'Civil 3D', 'MicroStation']),
    project_highlights: 'Large-scale maritime infrastructure CAD documentation and environmental sustainability verification.',
    image: '/project1.png',
    display_order: 2
  },
  {
    id: 3,
    name: 'Doha Port Terminal Renovation',
    slug: 'doha-port-terminal',
    division_type: 'Sustainability Projects',
    client: 'Mwani Qatar',
    contractor: 'Al Jaber Engineering',
    consultant: 'KEO International Consultants',
    location: 'Doha, Qatar',
    sector: 'Hospitality & Maritime',
    status: 'Completed',
    year: '2023',
    short_description: 'GSAS green building certification management and energy diagnostic audits.',
    description: 'GSAS green building certification management, energy diagnostic audits, and sustainable material sourcing for commercial cruise terminal facilities.',
    services: JSON.stringify(['Sustainability Services', 'GSAS', 'Energy Audit']),
    disciplines: JSON.stringify(['Architecture', 'MEP', 'Landscape']),
    project_stage: 'Design & Commissioning',
    bim_level: 'LOD 300',
    scope_of_work: 'GSAS green building certification management, energy diagnostic audits, and sustainable material sourcing.',
    deliverables: JSON.stringify(['GSAS Documentation', 'Energy Audit Reports', 'Sustainability Guidelines']),
    technologies: JSON.stringify(['IES VE', 'EnergyPlus', 'GSAS Gate Tool']),
    project_highlights: 'Achievement of 3-Star GSAS Design & Build rating for commercial cruise terminal facilities.',
    image: '/project1.png',
    display_order: 3
  },
  {
    id: 4,
    name: 'Qatar Rail Station Project',
    slug: 'qatar-rail-station',
    division_type: 'BIM Projects',
    client: 'Qatar Rail',
    contractor: 'RHK Joint Venture',
    consultant: 'Atkins',
    location: 'Doha, Qatar',
    sector: 'Transportation & Metro',
    status: 'Completed',
    year: '2022',
    short_description: 'Building Information Modeling up to LOD 400, clash detection, and 4D/5D simulations.',
    description: 'Complex 3D BIM modeling, clash detection, and underground station coordination across architectural, structural, and MEP disciplines.',
    services: JSON.stringify(['BIM', 'Scan to BIM', 'Laser Scanning']),
    disciplines: JSON.stringify(['Architecture', 'Structure', 'MEP', 'Underground Utilities']),
    project_stage: 'Construction & As-Built',
    bim_level: 'LOD 400',
    scope_of_work: 'Complex 3D BIM modeling, clash detection, and underground station coordination across architectural and MEP disciplines.',
    deliverables: JSON.stringify(['3D BIM Models', 'Clash Reports', '4D Scheduling Models']),
    technologies: JSON.stringify(['Revit', 'Navisworks Manage', 'BIM 360']),
    project_highlights: 'Zero-clash resolution across 12,000+ underground utility & MEP interfaces.',
    image: '/project1.png',
    display_order: 4
  }
];

// Helper: safe JSON parsing
const safeParseJSON = (str, fallback = []) => {
  if (!str) return fallback;
  if (Array.isArray(str)) return str;
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (e) {
    if (typeof str === 'string') {
      return str.split(',').map(s => s.trim()).filter(Boolean);
    }
    return fallback;
  }
};

// Helper: safe Slug generation
const safeSlug = (name) => {
  return (name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// GET all projects
app.get('/api/projects', async (req, res) => {
  const { category, all } = req.query;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      let query = "SELECT * FROM projects";
      let params = [];
      let conditions = [];

      if (!all || all === 'false') {
        conditions.push("status != 'Inactive'");
      }

      if (category) {
        conditions.push("(division_type LIKE ? OR category LIKE ?)");
        params.push(`%${category}%`, `%${category}%`);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      query += " ORDER BY display_order ASC, id ASC";
      const [rows] = await pool.query(query, params);
      if (rows.length > 0) return res.json(rows);
    }
  } catch (err) {
    console.error('Error fetching projects:', err);
  }
  return res.json(fallbackProjects);
});

// GET single project by slug or ID
app.get('/api/projects/:identifier', async (req, res) => {
  const { identifier } = req.params;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      let [rows] = await pool.query("SELECT * FROM projects WHERE slug = ? OR id = ?", [identifier, identifier]);
      if (rows.length > 0) {
        const project = rows[0];
        
        // Fetch 3 related projects (same category or general active)
        const [related] = await pool.query(
          "SELECT * FROM projects WHERE id != ? AND status != 'Inactive' AND (division_type = ? OR sector = ?) ORDER BY id DESC LIMIT 3",
          [project.id, project.division_type || '', project.sector || '']
        );

        let finalRelated = related;
        if (finalRelated.length < 3) {
          const [moreRelated] = await pool.query(
            "SELECT * FROM projects WHERE id != ? AND status != 'Inactive' ORDER BY id ASC LIMIT 3",
            [project.id]
          );
          finalRelated = moreRelated;
        }

        return res.json({ project, relatedProjects: finalRelated });
      }
    }
  } catch (err) {
    console.error('Error fetching project by identifier:', err);
  }

  // Fallback lookup
  const found = fallbackProjects.find(p => p.slug === identifier || String(p.id) === String(identifier)) || fallbackProjects[0];
  const related = fallbackProjects.filter(p => p.id !== found.id).slice(0, 3);
  return res.json({ project: found, relatedProjects: related });
});

// POST create project (Admin)
app.post('/api/projects', async (req, res) => {
  const {
    name,
    slug,
    division_type,
    category,
    project_count,
    client,
    contractor,
    consultant,
    location,
    sector,
    status,
    year,
    short_description,
    description,
    services,
    disciplines,
    project_stage,
    bim_level,
    scope_of_work,
    deliverables,
    technologies,
    project_highlights,
    image,
    gallery,
    display_order,
    seo_title,
    seo_description
  } = req.body;

  if (!name) return res.status(400).json({ error: 'Project name is required.' });

  const finalSlug = slug ? safeSlug(slug) : safeSlug(name);
  const divType = division_type || category || 'BIM Projects';
  const servicesJson = typeof services === 'string' ? services : JSON.stringify(services || []);
  const disciplinesJson = typeof disciplines === 'string' ? disciplines : JSON.stringify(disciplines || []);
  const deliverablesJson = typeof deliverables === 'string' ? deliverables : JSON.stringify(deliverables || []);
  const technologiesJson = typeof technologies === 'string' ? technologies : JSON.stringify(technologies || []);
  const galleryJson = typeof gallery === 'string' ? gallery : JSON.stringify(gallery || []);

  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [result] = await pool.query(
        `INSERT INTO projects (
          name, slug, division_type, project_count, client, contractor, consultant, location, sector, status, year,
          short_description, description, services, disciplines, project_stage, bim_level, scope_of_work,
          deliverables, technologies, project_highlights, image, gallery, display_order, seo_title, seo_description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name, finalSlug, divType, project_count || 0, client || '', contractor || '', consultant || '',
          location || 'Qatar', sector || 'Infrastructure & Buildings', status || 'Completed', year || '2024',
          short_description || '', description || '', servicesJson, disciplinesJson, project_stage || '',
          bim_level || '', scope_of_work || '', deliverablesJson, technologiesJson, project_highlights || '',
          image || '/project1.png', galleryJson, display_order || 0, seo_title || '', seo_description || ''
        ]
      );
      return res.status(201).json({ id: result.insertId, name, slug: finalSlug, division_type: divType, status });
    }
  } catch (err) {
    console.error('Error creating project:', err);
    return res.status(500).json({ error: err.message });
  }
  return res.status(503).json({ error: 'Database not connected.' });
});

// PUT update project (Admin)
app.put('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    slug,
    division_type,
    category,
    project_count,
    client,
    contractor,
    consultant,
    location,
    sector,
    status,
    year,
    short_description,
    description,
    services,
    disciplines,
    project_stage,
    bim_level,
    scope_of_work,
    deliverables,
    technologies,
    project_highlights,
    image,
    gallery,
    display_order,
    seo_title,
    seo_description
  } = req.body;

  const finalSlug = slug ? safeSlug(slug) : (name ? safeSlug(name) : 'project');
  const divType = division_type || category || 'BIM Projects';
  const servicesJson = typeof services === 'string' ? services : JSON.stringify(services || []);
  const disciplinesJson = typeof disciplines === 'string' ? disciplines : JSON.stringify(disciplines || []);
  const deliverablesJson = typeof deliverables === 'string' ? deliverables : JSON.stringify(deliverables || []);
  const technologiesJson = typeof technologies === 'string' ? technologies : JSON.stringify(technologies || []);
  const galleryJson = typeof gallery === 'string' ? gallery : JSON.stringify(gallery || []);

  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query(
        `UPDATE projects SET
          name=?, slug=?, division_type=?, project_count=?, client=?, contractor=?, consultant=?, location=?, sector=?,
          status=?, year=?, short_description=?, description=?, services=?, disciplines=?, project_stage=?,
          bim_level=?, scope_of_work=?, deliverables=?, technologies=?, project_highlights=?, image=?,
          gallery=?, display_order=?, seo_title=?, seo_description=?
        WHERE id=?`,
        [
          name, finalSlug, divType, project_count || 0, client || '', contractor || '', consultant || '',
          location || 'Qatar', sector || 'Infrastructure & Buildings', status || 'Completed', year || '2024',
          short_description || '', description || '', servicesJson, disciplinesJson, project_stage || '',
          bim_level || '', scope_of_work || '', deliverablesJson, technologiesJson, project_highlights || '',
          image || '/project1.png', galleryJson, display_order || 0, seo_title || '', seo_description || '', id
        ]
      );
      return res.json({ id, name, slug: finalSlug, division_type: divType, status });
    }
  } catch (err) {
    console.error('Error updating project:', err);
    return res.status(500).json({ error: err.message });
  }
  return res.status(503).json({ error: 'Database not connected.' });
});

// DELETE project (Admin)
app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query('DELETE FROM projects WHERE id = ?', [id]);
      return res.json({ success: true });
    }
  } catch (err) {
    console.error('Error deleting project:', err);
    return res.status(500).json({ error: err.message });
  }
  return res.status(503).json({ error: 'Database not connected.' });
});

// ==========================================
// PARTNERS API
// ==========================================


// GET all partners
app.get('/api/partners', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT * FROM partners ORDER BY order_num ASC, id ASC');
      return res.json(rows);
    }
  } catch (err) {
    console.error('Error fetching partners:', err);
  }
  return res.json([]);
});

// POST create partner
app.post('/api/partners', async (req, res) => {
  const { name, role, image, order_num } = req.body;
  if (!name) return res.status(400).json({ error: 'Partner name is required.' });
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [result] = await pool.query(
        'INSERT INTO partners (name, role, image, order_num) VALUES (?, ?, ?, ?)',
        [name, role || 'Working Partner', image || '', order_num || 0]
      );
      const [rows] = await pool.query('SELECT * FROM partners WHERE id = ?', [result.insertId]);
      return res.status(201).json(rows[0]);
    }
  } catch (err) {
    console.error('Error creating partner:', err);
    return res.status(500).json({ error: err.message });
  }
  return res.status(503).json({ error: 'Database not connected.' });
});

// PUT update partner
app.put('/api/partners/:id', async (req, res) => {
  const { id } = req.params;
  const { name, role, image, order_num } = req.body;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query(
        'UPDATE partners SET name=?, role=?, image=?, order_num=? WHERE id=?',
        [name, role, image, order_num || 0, id]
      );
      const [rows] = await pool.query('SELECT * FROM partners WHERE id = ?', [id]);
      return res.json(rows[0]);
    }
  } catch (err) {
    console.error('Error updating partner:', err);
    return res.status(500).json({ error: err.message });
  }
  return res.status(503).json({ error: 'Database not connected.' });
});

// DELETE partner
app.delete('/api/partners/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query('DELETE FROM partners WHERE id = ?', [id]);
      return res.json({ success: true });
    }
  } catch (err) {
    console.error('Error deleting partner:', err);
    return res.status(500).json({ error: err.message });
  }
  return res.status(503).json({ error: 'Database not connected.' });
});

// ==========================================
// MEDIA ITEMS API
// ==========================================

// GET all media items
app.get('/api/media', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT * FROM media_items ORDER BY id DESC');
      return res.json(rows);
    }
  } catch (err) {
    console.error('Error fetching media items:', err);
  }
  return res.json([]);
});

// POST add media item
app.post('/api/media', async (req, res) => {
  const { type, title, url, category } = req.body;
  if (!type || !title || !url) return res.status(400).json({ error: 'Type, title, and url are required.' });
  const catToSave = category || (type === 'gallery' ? 'Site' : 'Our Work');
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [result] = await pool.query(
        'INSERT INTO media_items (type, category, title, url) VALUES (?, ?, ?, ?)',
        [type, catToSave, title, url]
      );
      const [rows] = await pool.query('SELECT * FROM media_items WHERE id = ?', [result.insertId]);
      return res.status(201).json(rows[0]);
    }
  } catch (err) {
    console.error('Error adding media item:', err);
    return res.status(500).json({ error: err.message });
  }
  return res.status(503).json({ error: 'Database not connected.' });
});

// PUT update media item
app.put('/api/media/:id', async (req, res) => {
  const { id } = req.params;
  const { type, title, url, category } = req.body;
  const catToSave = category || (type === 'gallery' ? 'Site' : 'Our Work');
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query(
        'UPDATE media_items SET type=?, category=?, title=?, url=? WHERE id=?',
        [type, catToSave, title, url, id]
      );
      const [rows] = await pool.query('SELECT * FROM media_items WHERE id = ?', [id]);
      return res.json(rows[0]);
    }
  } catch (err) {
    console.error('Error updating media item:', err);
    return res.status(500).json({ error: err.message });
  }
  return res.status(503).json({ error: 'Database not connected.' });
});

// DELETE media item
app.delete('/api/media/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query('DELETE FROM media_items WHERE id = ?', [id]);
      return res.json({ success: true });
    }
  } catch (err) {
    console.error('Error deleting media item:', err);
    return res.status(500).json({ error: err.message });
  }
  return res.status(503).json({ error: 'Database not connected.' });
});

// ==========================================
// 11. OUR TEAM API ENDPOINTS
// ==========================================

// GET all team members (Optimized for instant response)
app.get('/api/team', async (req, res) => {
  const { all } = req.query;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      let query = "SELECT id, name, role, image, department, order_num, status FROM team_members";
      if (!all || all === 'false') {
        query += " WHERE status != 'Inactive'";
      }
      query += " ORDER BY order_num ASC, id ASC";
      const [rows] = await pool.query(query);
      
      // Return response immediately for fast UI paint
      res.json(rows);

      // Asynchronously optimize base64 images in background if any exist
      setImmediate(async () => {
        for (const row of rows) {
          if (row.image && row.image.startsWith('data:')) {
            const fastPath = saveBase64File(row.image, 'team');
            if (fastPath) {
              try {
                await pool.query('UPDATE team_members SET image = ? WHERE id = ?', [fastPath, row.id]);
              } catch (e) {
                // background update catch
              }
            }
          }
        }
      });
      return;
    }
  } catch (err) {
    console.error('Error fetching team members:', err);
  }
  return res.json([
    { id: 1, name: 'Praveen', role: 'Team Member', image: '/uploads/team_1786560739404.jpg', department: 'Engineering', order_num: 1, status: 'Active' },
    { id: 2, name: 'Nancy', role: 'Team Member', image: '/uploads/team_1786562045607.jpg', department: 'BIM & CAD', order_num: 2, status: 'Active' },
    { id: 3, name: 'Raghul', role: 'Team Member', image: '/uploads/team_1786562084689.jpg', department: 'Digital Twin', order_num: 3, status: 'Active' },
    { id: 4, name: 'Zubariya', role: 'Team Member', image: '/uploads/team_1786562368113.jpg', department: 'Sustainability', order_num: 4, status: 'Active' },
    { id: 5, name: 'Mohammed', role: 'BIM Specialist', image: '/uploads/team_1786562504613.jpg', department: 'BIM & CAD', order_num: 5, status: 'Active' },
    { id: 6, name: 'Ananya', role: 'CAD Engineer', image: null, department: 'Engineering', order_num: 6, status: 'Active' },
    { id: 7, name: 'Karthik', role: 'Project Lead', image: null, department: 'Management', order_num: 7, status: 'Active' },
    { id: 8, name: 'Divya', role: 'Sustainability Specialist', image: null, department: 'Sustainability', order_num: 8, status: 'Active' }
  ]);
});

// POST add team member
app.post('/api/team', async (req, res) => {
  let { name, role, image, department, order_num, status } = req.body;
  if (!name) return res.status(400).json({ error: 'Team member name is required.' });
  if (image && image.startsWith('data:')) {
    image = saveBase64File(image, 'team');
  }
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [result] = await pool.query(
        'INSERT INTO team_members (name, role, image, department, order_num, status) VALUES (?, ?, ?, ?, ?, ?)',
        [name, role || 'Team Member', image || null, department || '', order_num || 0, status || 'Active']
      );
      const [rows] = await pool.query('SELECT * FROM team_members WHERE id = ?', [result.insertId]);
      return res.status(201).json(rows[0]);
    }
  } catch (err) {
    console.error('Error adding team member:', err);
    return res.status(500).json({ error: err.message });
  }
  return res.status(503).json({ error: 'Database not connected.' });
});

// PUT update team member
app.put('/api/team/:id', async (req, res) => {
  const { id } = req.params;
  let { name, role, image, department, order_num, status } = req.body;
  if (image && image.startsWith('data:')) {
    image = saveBase64File(image, 'team');
  }
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query(
        'UPDATE team_members SET name=?, role=?, image=?, department=?, order_num=?, status=? WHERE id=?',
        [name, role, image, department, order_num || 0, status || 'Active', id]
      );
      const [rows] = await pool.query('SELECT * FROM team_members WHERE id = ?', [id]);
      return res.json(rows[0]);
    }
  } catch (err) {
    console.error('Error updating team member:', err);
    return res.status(500).json({ error: err.message });
  }
  return res.status(503).json({ error: 'Database not connected.' });
});

// DELETE team member
app.delete('/api/team/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query('DELETE FROM team_members WHERE id = ?', [id]);
      return res.json({ success: true });
    }
  } catch (err) {
    console.error('Error deleting team member:', err);
    return res.status(500).json({ error: err.message });
  }
  return res.status(503).json({ error: 'Database not connected.' });
});

// ==========================================
// 12. SERVE STATIC ASSETS & FRONTEND IN PRODUCTION
// ==========================================

// Serve dynamic user uploads from the persistent server/uploads/ directory
// This directory is outside client/dist so uploads survive production builds
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Also serve from legacy client/public/uploads for backward compatibility
app.use('/uploads', express.static(path.join(__dirname, '..', 'client', 'public', 'uploads')));

// Serve React production build files
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// Wildcard route to serve index.html for any SPA routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Frontend client build is not found. Please compile the app first.');
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Blue Crescent Express Server running on port ${PORT}`);
});

// Trigger nodemon reload

