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
// 7. SERVICES DETAILS API
// ==========================================
app.get('/api/services', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query("SELECT * FROM services WHERE category NOT LIKE '%Telecom%' AND title NOT IN ('Engineering Design support Services', 'Specialised Simulation & Analysis', 'BIM Modelling - 3D') ORDER BY category ASC, id ASC");
      return res.json(rows);
    }
  } catch (err) {
    console.error(err);
  }
  return res.json([]);
});

app.post('/api/services', async (req, res) => {
  const { category, title, description, bullets, tools, banner_image } = req.body;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [result] = await pool.query(
        'INSERT INTO services (category, title, description, bullets, tools, banner_image) VALUES (?, ?, ?, ?, ?, ?)',
        [
          category,
          title,
          description || '',
          bullets ? (typeof bullets === 'string' ? bullets : JSON.stringify(bullets)) : '[]',
          tools ? (typeof tools === 'string' ? tools : JSON.stringify(tools)) : '[]',
          banner_image || '/servicepage1.png'
        ]
      );
      return res.status(201).json({ id: result.insertId, category, title, description, bullets, tools, banner_image });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/services/:id', async (req, res) => {
  const { id } = req.params;
  const { category, title, description, bullets, tools, banner_image } = req.body;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query(
        'UPDATE services SET category = ?, title = ?, description = ?, bullets = ?, tools = ?, banner_image = ? WHERE id = ?',
        [
          category,
          title,
          description,
          bullets ? (typeof bullets === 'string' ? bullets : JSON.stringify(bullets)) : '[]',
          tools ? (typeof tools === 'string' ? tools : JSON.stringify(tools)) : '[]',
          banner_image,
          id
        ]
      );
      return res.json({ id, category, title, description, bullets, tools, banner_image });
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
      return res.json({ success: true });
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
  { id: 1, name: 'Engineering Design Support Works', division_type: 'Engineering Division', project_count: 24, description: '', image: '', status: 'Active' },
  { id: 2, name: 'BIM Modeling & Coordination',       division_type: 'Engineering Division', project_count: 18, description: '', image: '', status: 'Active' },
  { id: 3, name: 'LEED/GSAS Gold Commissioning',      division_type: 'Sustainability Division', project_count: 12, description: '', image: '', status: 'Active' },
  { id: 4, name: 'Life Cycle Twin Asset Management',  division_type: 'Digital Twin Division', project_count: 12, description: '', image: '', status: 'Active' },
];

// GET all projects
app.get('/api/projects', async (req, res) => {
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [rows] = await pool.query("SELECT * FROM projects ORDER BY id ASC");
      if (rows.length > 0) return res.json(rows);
    }
  } catch (err) { console.error(err); }
  return res.json(fallbackProjects);
});

// POST create project
app.post('/api/projects', async (req, res) => {
  const { name, division_type, project_count, description, image, status } = req.body;
  if (!name || !division_type) return res.status(400).json({ error: 'Name and division type are required.' });
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      const [result] = await pool.query(
        'INSERT INTO projects (name, division_type, project_count, description, image, status) VALUES (?, ?, ?, ?, ?, ?)',
        [name, division_type, project_count || 0, description || '', image || '', status || 'Active']
      );
      return res.status(201).json({ id: result.insertId, name, division_type, project_count, description, image, status });
    }
  } catch (err) { console.error(err); return res.status(500).json({ error: err.message }); }
  return res.status(503).json({ error: 'Database not connected.' });
});

// PUT update project
app.put('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { name, division_type, project_count, description, image, status } = req.body;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query(
        'UPDATE projects SET name=?, division_type=?, project_count=?, description=?, image=?, status=? WHERE id=?',
        [name, division_type, project_count || 0, description || '', image || '', status || 'Active', id]
      );
      return res.json({ id, name, division_type, project_count, description, image, status });
    }
  } catch (err) { console.error(err); return res.status(500).json({ error: err.message }); }
  return res.status(503).json({ error: 'Database not connected.' });
});

// DELETE project
app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    if (getIsConnected() && pool) {
      await pool.query('DELETE FROM projects WHERE id = ?', [id]);
      return res.json({ success: true });
    }
  } catch (err) { console.error(err); return res.status(500).json({ error: err.message }); }
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

