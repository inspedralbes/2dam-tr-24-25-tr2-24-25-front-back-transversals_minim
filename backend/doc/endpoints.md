# API Documentation

---

## Authentication Endpoints

### **Register**
**POST** `/auth/register`

Registers a new user.

#### **Request Body:**
```json
{
    "username": "string",
    "email": "string",
    "password": "string"
}
```

#### **Response:**
- **201 Created**:
```json
{
    "message": "Usuario registrado exitosamente"
}
```

- **400 Bad Request** (e.g., email already exists):
```json
{
    "message": "El usuario ya existe"
}
```

---

### **Login**
**POST** `/auth/login`

Authenticates a user and returns a JWT.

#### **Request Body:**
```json
{
    "email": "string",
    "password": "string"
}
```

#### **Response:**
- **200 OK**:
```json
{
    "message": "Inicio de sesión exitoso",
    "userInfo": {
        "id": INT,
        "username": "usr",
        "email": "usr@example.com"
    },
    "token": "your.jwt.token",
    "permission": "student"
}
```

- **401 Unauthorized** (e.g., incorrect credentials):
```json
{
    "message": "Credenciales incorrectas"
}
```

---

### **Get questions**
**GET** `/question`

A route to get shuffled random questions

#### **Request Body:**
```json
{
    "numAdditionQuestions": INT,
    "numSubtractionQuestions": INT,
    "numMultiplicationQuestions": INT,
    "numDivisionQuestions": INT
}
```

#### **Response:**
- **200 OK**:
```json
[
    {
        "question": "string",
        "option1": "string",
        "option2": "string",
        "option3": "string",
        "option4": "string",
        "correct_answer": INT
    },
    {
        "question": "string",
        "option1": "string",
        "option2": "string",
        "option3": "string",
        "option4": "string",
        "correct_answer": INT
    }
]
```

---

## Protected Endpoints

### **Example Protected Route**
**GET** `/protected`

A route that requires a valid JWT to access.

#### **Headers:**
```json
{
    "Authorization": "Bearer your.jwt.token"
}
```

#### **Response:**
- **200 OK**:
```json
{
    "message": "Bienvenido, {\"id\":1,\"username\":\"david\",\"email\":\"david@example.com\",\"iat\":1678376478,\"exp\":1678380078}"
}
```

- **401 Unauthorized** (e.g., no token provided):
```json
{
    "message": "Token no proporcionado"
}
```

- **403 Forbidden** (e.g., invalid token):
```json
{
    "message": "Token inválido o expirado"
}
```

---

### **Get users**
**GET** `/user`

A route to get all users (only admin)

#### **Headers:**
```json
{
    "Authorization": "Bearer your.jwt.token"
}
```
#### **Response:**
- **201 OK**:
```json
[
  {
    "id": 6,
    "username": "usr",
    "email": "usr@example.com"
  },
  {
    "id": 7,
    "username": "usr2",
    "email": "usr2@example.com"
  }
]
```

- **401 Unauthorized** (e.g., no token provided):
```json
{
    "message": "Token no proporcionado"
}
```

- **403 Forbidden** (e.g., invalid token):
```json
{
    "message": "Token inválido o expirado"
}
```
- **500 Error getting users**:
```json
{
    "message": "Error al obtener los grupos"
}
```

---

### **Modify permission**
**POST** `/modify-permission`

A route to change permissions for a user (only admin)

#### **Headers:**
```json
{
    "Authorization": "Bearer your.jwt.token"
}
```
#### **Request Body:**
```json
{
    "user_id": INT,
    "permission_type_id": INT
}
```

#### **Response:**
- **201 OK**:
```json
{
    "message": "Permiso modificado exitosamente"
}
```

- **400 No email or No permission type**:
```json
{
    "message": "Se requieren usuario y permiso"
}
```

- **401 Unauthorized** (e.g., no token provided):
```json
{
    "message": "Token no proporcionado"
}
```

- **403 Forbidden** (e.g., invalid token):
```json
{
    "message": "Token inválido o expirado"
}
```

- **404 User not found**:
```json
{
    "message": "Usuario no encontrado"
}
```

- **500 Error modifying**:
```json
{
    "message": "Error al modificar permiso"
}
```

---

### **Add group**
**POST** `/group`

A route to create/join group "groupName" to specify the name and autoJoin to specify if you want to be asigned

#### **Headers:**
```json
{
    "Authorization": "Bearer your.jwt.token"
}
```
#### **Request Body:**
```json
{
    "groupName": "string",
    "autoJoin": boolean
}
```

#### **Response:**
- **201 OK**:
```json
{
    "message": "Grupo registrado exitosamente"
}
```

- **400 Group name not provided**:
```json
{
    "message": "Se requiere un grupo"
}
```

- **401 Unauthorized** (e.g., no token provided):
```json
{
    "message": "Token no proporcionado"
}
```

- **403 Forbidden** (e.g., invalid token):
```json
{
    "message": "Token inválido o expirado"
}
```

- **500 Error modifying**:
```json
{
    "message": "Error al modificar permiso"
}
```

---

### **Get groups**
**GET** `/group`

A route to get all groups (teacher/admin)

#### **Headers:**
```json
{
    "Authorization": "Bearer your.jwt.token"
}
```

#### **Response:**
- **200 OK**:
```json
[
  {
    "class_group_id": INT,
    "class_group_name": "string"
  },
  {
    "class_group_id": INT,
    "class_group_name": "string"
  }
]
```

- **500 Error getting groups**:
```json
{
    "message": "Error al obtener los grupos"
}
```

---

### **Get groups assigned to me**
**GET** `/group/assigned`

A route to get all groups assigned to the user token (teacher/admin)

#### **Headers:**
```json
{
    "Authorization": "Bearer your.jwt.token"
}
```

#### **Response:**
- **200 OK**:
```json
[
  {
    "class_group_id": INT,
    "class_group_name": "string"
  },
  {
    "class_group_id": INT,
    "class_group_name": "string"
  }
]
```

- **500 Error getting groups**:
```json
{
    "message": "Error al obtener los grupos"
}
```

## Error Codes

| Status Code | Description                  |
|-------------|------------------------------|
| 200         | Request succeeded            |
| 201         | Resource created successfully|
| 400         | Bad request                  |
| 401         | Unauthorized                 |
| 403         | Forbidden                    |
| 500         | Internal server error        |

---

### Notes
- Always include the JWT token in the `Authorization` header for protected routes.
- Use a `.env` file to configure the `JWT_SECRET`'s and database connection details.

