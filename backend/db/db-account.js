// const db = require('./db-conn')

const findUserByName = async (name) => {
  const user = await db.get('SELECT * FROM users WHERE name=?', name)
  return user
}

const findUserById = async (uid) => {
  const user = await db.get('SELECT id,name,title FROM users WHERE id=?', uid)
  return user
}

const createUser = async ({name, email, password, title}) => {
  try {
    const user = await db.run('INSERT INTO users (name, email, password, title) VALUES (?,?,?,?)', name, email, password, title)
    return user.lastID
  } catch (error) {
    console.log(error);
    return -1
  }
}

const tryLogin = async ({name, password}) => {
  const user = await db.get('SELECT id, name, title FROM users WHERE name=? AND password=?', name, password)
  return user
}

module.exports = {
  findUserByName,
  findUserById,
  createUser,
  tryLogin,
}