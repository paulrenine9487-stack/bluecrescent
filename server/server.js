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

// ==========================================
// SETTINGS PERSISTENCE APIs (MySQL)
// ==========================================

app.get('/api/settings/company', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT * FROM company_settings LIMIT 1');
      if (rows.length > 0) {
        return res.json(rows[0]);
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

    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT id FROM company_settings LIMIT 1');
      if (rows.length > 0) {
        const id = rows[0].id;
        const keys = Object.keys(settings).filter(k => k !== 'id');
        const setQuery = keys.map(k => `${k} = ?`).join(', ');
        const values = keys.map(k => settings[k]);
        await pool.query(`UPDATE company_settings SET ${setQuery} WHERE id = ?`, [...values, id]);
        return res.json({ success: true, message: 'Settings updated.', data: settings });
      } else {
        const keys = Object.keys(settings);
        const colNames = keys.join(', ');
        const placeholders = keys.map(() => '?').join(', ');
        const values = keys.map(k => settings[k]);
        await pool.query(`INSERT INTO company_settings (${colNames}) VALUES (${placeholders})`, values);
        return res.json({ success: true, message: 'Settings inserted.', data: settings });
      }
    }
  } catch (err) {
    console.error('Error saving company settings:', err);
    return res.status(500).json({ error: err.message });
  }
  return res.status(503).json({ error: 'Database disconnected.' });
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
  if (username === 'superadmin' && password === 'superpassword') {
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
// 3. NEWS API
// ==========================================
app.get('/api/news', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query('SELECT * FROM news ORDER BY id DESC');
      return res.json(rows);
    }
  } catch (err) {
    console.error('Error fetching news:', err);
  }
  return res.json(fallbackData.news);
});

app.post('/api/news', async (req, res) => {
  const { title, content, category, image, date } = req.body;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [result] = await pool.query(
        'INSERT INTO news (title, content, category, image, date) VALUES (?, ?, ?, ?, ?)',
        [title, content, category || 'NEWS', image || null, date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })]
      );
      return res.status(201).json({ id: result.insertId, title, content, category, image, date });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/news/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, category, image, date } = req.body;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query(
        'UPDATE news SET title = ?, content = ?, category = ?, image = ?, date = ? WHERE id = ?',
        [title, content, category, image, date, id]
      );
      return res.json({ id, title, content, category, image, date });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/news/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query('DELETE FROM news WHERE id = ?', [id]);
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
      await pool.query('DELETE FROM service_categories WHERE id = ?', [id]);
      return res.json({ success: true, id });
    } else {
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
  const { title, subtitle, btn1_text, btn2_text, image, status, order_num } = req.body;
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
  const { title, subtitle, btn1_text, btn2_text, image, status, order_num } = req.body;
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
  const { type, title, url } = req.body;
  if (!type || !title || !url) return res.status(400).json({ error: 'Type, title, and url are required.' });
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [result] = await pool.query(
        'INSERT INTO media_items (type, title, url) VALUES (?, ?, ?)',
        [type, title, url]
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
  const { type, title, url } = req.body;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query(
        'UPDATE media_items SET type=?, title=?, url=? WHERE id=?',
        [type, title, url, id]
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

