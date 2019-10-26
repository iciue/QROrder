module.exports = {
  getDeskInfo: async(deskId) =>{
    const desk = await db.get(`SELECT 
    desks.id as did,
    users.id as uid,
    desks.name,users.title, capacity FROM desks JOIN users ON desks.rid = users.id 
    WHERE desks.id=?`, deskId)
    return desk
  },

  getDeskId: async({rid, did}) => {
    console.log(rid, did);
    const desk = await db.get(`SELECT id from desks WHERE rid=? AND name='${did}'`, rid)
    console.log(desk)
    return desk.id
  },

  getAllMenu: async (rid) => {
    return await db.all(`SELECT * FROM foods WHERE rid = ? AND status = 'on'`, rid)
  },

  getAllFood: async (rid) => {
    return await db.all('SELECT * FROM foods WHERE rid=?', rid)
  },

  findFoodById: async ({fid, uid}) => {
    return await db.get('SELECT * FROM foods WHERE id = ? AND rid = ?', fid, uid)
  },

  findOrderById: async (orderId) => {
    return await db.get('SELECT * FROM orders WHERE id = ?', orderId)
  },
  
  updateFood: async ({name, price, status, desc, category, fid, uid}) => {
    const t = await db.run(`
      UPDATE foods SET name = ?, price = ?, status = ?, desc = ?, category = ?
      WHERE id = ? AND rid = ?`,
      name, price, status, desc, category, fid, uid)
    return t.lastID
  },

  createDesk: async({uid, name, capacity}) => {
    const d = await db.run(`INSERT INTO desks (rid, name, capacity) VALUES (?, ?, ?)`, uid, name, capacity)
    return d.lastID
  },

  createFood: async ({uid, name, price, status}) => {
    return await db.run(`INSERT INTO foods (rid, name, price, status) VALUES (?, ?, ?, ?)`, uid, name, price, status)
  },

  placeOrder: async ({rid, did, deskName, totalPrice, customCount, details, status, timestamp}) => {
    const order = await db.run(`INSERT INTO orders 
    (rid, did, deskName, totalPrice, customCount, details, status, timestamp) VALUES (?,?,?,?,?,?,?)`
    ,rid, did, deskName, totalPrice, customCount, details, status, timestamp)
    
    return order.lstId
  }
}
