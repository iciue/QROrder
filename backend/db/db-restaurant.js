module.exports = {
  getDeskInfo: async({rid, did}) => {
    return await db.get(`SELECT * from desks WHERE rid=? AND name='${did}'`, rid)
  },

  getAllMenu: async (rid) => {
    return await db.all(`SELECT * FROM foods WHERE rid = ? AND status = 'on'`, rid)
  },

  getAllFood: async (rid) => {
    return await db.all('SELECT * FROM foods WHERE rid=?', rid)
  },

  getAllDesk: async (rid) => {
    return await db.all('SELECT * FROM desks WHERE rid=?', rid)
  },

  getAllOrder: async (rid) => {
    return await db.all('SELECT * FROM orders WHERE rid=?', rid)
  },

  findFoodById: async ({fid, uid}) => {
    return await db.get('SELECT * FROM foods WHERE id = ? AND rid = ?', fid, uid)
  },

  findOrderById: async (orderId) => {
    return await db.get('SELECT * FROM orders WHERE id = ?', orderId)
  },

  findDeskById: async ({did, uid}) => {
    return await db.get('SELECT * FROM desks WHERE id = ? AND rid = ?', did, uid)
  },

  findDeskByName: async({rid, deskName}) => {
    return await db.get('SELECT * FROM desks WHERE rid = ? AND name = ?', rid, deskName)
  },

  findNewestDesk: async(rid) => {
    return await db.get('select * from desks WHERE rid = ? order by id desc limit 1', rid)
  },

  findNewestOrder: async({rid, did}) => {
    return await db.get('select * from orders WHERE rid = ? AND did = ? order by id desc limit 1', rid, did)
  },

  findNewestFood: async(rid) => {
    return await db.get('select * from foods WHERE rid = ? order by id desc limit 1', rid)
  },
  
  updateFood: async ({name, price, status, desc, category, fid, uid, img}) => {
    const f = await db.run(`
      UPDATE foods SET name = ?, price = ?, status = ?, desc = ?, category = ?, img = ?
      WHERE id = ? AND rid = ?`,
      name, price, status, desc, category, img, fid, uid)
    return f.lastID
  },

  updateDesk: async ({uid, did, name, capacity}) => {
    const d = await db.run(`UPDATE desks SET name = ?, capacity = ? WHERE id = ? AND rid = ?`, name, capacity, did, uid)
    return d.lastID
  },

  updateOrder: async ({oid, uid, status}) => {
    return await db.run(`UPDATE orders SET status = ? WHERE id = ? AND rid = ?`, status, oid, uid)
  },

  createDesk: async({uid, name, capacity}) => {
    const d = await db.run(`INSERT INTO desks (rid, name, capacity) VALUES (?, ?, ?)`, uid, name, capacity)
    return d.lastID
  },

  createFood: async ({uid, name, desc, price, category, status = 'on', img = 'default.png'}) => {
    const f =  await db.run(`INSERT INTO foods (rid, name, desc, price, category, status, img) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
      uid, name, desc, price, category, status, img)
    return f.lastID
  },

  deleteDesk: async ({uid, did}) =>{
    const d = await db.run('DELETE FROM desks WHERE rid = ? AND id = ?', uid, did)
    console.log(d);
    return d
  },

  placeOrder: async ({rid, did, deskName, totalPrice, customCount, details, status, timestamp}) => {
    console.log(rid, did, deskName, totalPrice, customCount, details, status, timestamp);
    const order = await db.run(`INSERT INTO orders 
    (rid, did, deskName, totalPrice, customCount, details, status, timestamp) VALUES (?, ?,?,?,?,?,?,?)`
    ,rid, did, deskName, totalPrice, customCount, details, status, timestamp)
    
    return order
  }
}
