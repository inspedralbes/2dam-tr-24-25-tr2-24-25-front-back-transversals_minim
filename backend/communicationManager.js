import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// USER FUNCTIONS
// Función para obtener los usuarios
async function getUsers() {
  const query = 'SELECT id, username, email, permission_type_id FROM users';
  const [rows] = await pool.query(query);
  return rows;
}

//Funcion para obtener un usuario por su id
async function getUserById(id) {
  const query = 'SELECT * FROM users WHERE id = ?';
  const [rows] = await pool.query(query, [id]);
  return rows[0];
}

// Función para cambiar el correo de un usuario
async function changeEmail(userId, newEmail) {
  const query = 'UPDATE users SET email = ? WHERE id = ?';
  const [result] = await pool.query(query, [newEmail, userId]);
  return result;
}

// Función para cambiar el nombre de usuario de un usuario
async function changeUsername(userId, newUsername) {
  const query = 'UPDATE users SET username = ? WHERE id = ?';
  const [result] = await pool.query(query, [newUsername, userId]);
  return result;
}

// Función para cambiar la contraseña de un usuario
async function changePassword(userId, newPassword) {
  const query = 'UPDATE users SET password = ? WHERE id = ?';
  const [result] = await pool.query(query, [newPassword, userId]);
  return result;
}

// Función para buscar un usuario por su useremail
async function findUserByMail(useremail) {
  const query = 'SELECT * FROM users WHERE email = ?';
  const [rows] = await pool.query(query, [useremail]);
  return rows[0]; // Devuelve el primer resultado (puede ser undefined)
}
// Función para registrar un usuario
async function registerUser(username, email, hashedPassword, permission_type_id) {
  const query = 'INSERT INTO users (username, email, password, permission_type_id	) VALUES (?, ?, ?, ?)';
  const [result] = await pool.query(query, [username, email, hashedPassword, permission_type_id]);
  return result;
}
// Función para actualizar un usuario
async function updateUser(userId, newEmail, newUsername) {
  const query = 'UPDATE users SET email = ?, username = ? WHERE id = ?';
  const [result] = await pool.query(query, [newEmail, newUsername, userId]);
}
// Función para modificar el permiso de un usuario
async function modifyPermission(user_id, permission_type_id) {
  const query = 'UPDATE users SET permission_type_id = ? WHERE id = ?';
  const [result] = await pool.query(query, [permission_type_id, user_id]);
}

// GROUP FUNCTIONS
// Función para obtener todos los grupos
async function getAllGroups() {
  const query = 'SELECT * FROM class_groups';
  const [rows] = await pool.query(query);
  return rows;
}

// Función para buscar un grupo por su nombre
async function findGroupByName(group) {
  const query = 'SELECT * FROM class_groups WHERE name = ?';
  const [rows] = await pool.query(query, [group]);
  return rows[0]; // Devuelve el primer resultado (puede ser undefined)
}

// Función para obtener los grupos de un profesor
async function getGroupsFromTeacher(teacher_id) {
  const query = 'SELECT cg.id AS class_group_id, cg.name AS class_group_name FROM class_groups cg JOIN teacher_class_groups tcg ON cg.id = tcg.class_group_id WHERE tcg.user_id = ?'
  const [rows] = await pool.query(query, [teacher_id]);
  return rows;
}

// Función para registrar un grupo
async function registerGroup(group) {
  const query = 'INSERT INTO class_groups (name) VALUES (?)';
  const [result] = await pool.query(query, [group]);
  return result;
}
// Función para actualizar un grupo
async function updateGroup(groupId, newName) {
  const query = 'UPDATE class_groups SET name = ? WHERE id = ?';
  const [result] = await pool.query(query, [newName, groupId]);
}
// Función para eliminar un grupo
async function deleteGroup(groupId) {
  const query = 'DELETE FROM class_groups WHERE id = ?';
  const [result] = await pool.query(query, [groupId]);
}

// Funcion de asignacion de grupo a un usuario
async function assignGroupToUser(userId, groupId) {
  const query = 'INSERT INTO teacher_class_groups (user_id, class_group_id) VALUES (?, ?)';
  const [result] = await pool.query(query, [userId, groupId]);
  return result;
}


// PERMISSION FUNCTIONS
async function getAllPermissions() {
  const query = 'SELECT * FROM permission_types';
  const [rows] = await pool.query(query);
  return rows;
}
async function getPermissionById(id) {
  const query = 'SELECT * FROM permission_types WHERE id = ?';
  const [rows] = await pool.query(query, [id]);
  return rows[0];
}

const communicationManager = {
  getUsers,
  getUserById,
  changeEmail,
  changeUsername,
  changePassword,
  findUserByMail,
  registerUser,
  updateUser,
  modifyPermission,
  findGroupByName,
  registerGroup,
  updateGroup,
  deleteGroup,
  getAllGroups,
  getGroupsFromTeacher,
  assignGroupToUser,
  getAllPermissions,
  getPermissionById,
};

export default communicationManager;