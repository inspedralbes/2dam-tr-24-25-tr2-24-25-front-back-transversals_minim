import { useAppStore } from "@/stores/app";
import { emitRoleChange } from '@/services/socketManager';

const urlBase = 'http://catch-the-math.dam.inspedralbes.cat:29876'

async function login(email, password) {
    const response = await fetch(`${urlBase}/auth/login`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });
    return response;
}

async function register(username, email, password) {
    const response = await fetch(`${urlBase}/auth/register`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            email,
            password,
        }),
    });
    return response;
}

async function modifyPermission(userId, permissionTypeId) {
    const pinia = useAppStore();
    const response = await fetch(`${urlBase}/modify-permission`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Accept': "application/json",
            'Authorization': `Bearer ${pinia.token}`,
        },
        body: JSON.stringify({
            user_id: userId,
            permission_type_id: permissionTypeId
        }),
    });
    
    if (response.ok) {
        // Emitir el cambio de rol a través del socket
        emitRoleChange(userId, permissionTypeId);
    }
    
    return response;
}

async function getUser () {
    const pinia = useAppStore();
    const response = await fetch(`${urlBase}/user`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Accept': "application/json",
            'Authorization': `Bearer ${pinia.token}`,
        },
    });
    return response;
}

async function getCode () {
    const pinia = useAppStore();
    const response = await fetch(`${urlBase}/create-code`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Accept': "application/json",
            'Authorization': `Bearer ${pinia.token}`,
        },
    });
    return response;
}

async function obtenerEstadisticas(bodyRequest) {
    const pinia = useAppStore();

    console.log('Enviando los siguientes datos:', {
     bodyRequest
    });

    // Log de la URL y los headers enviados
    console.log('Headers enviados:', {
        "Content-Type": "application/json",
        'Accept': "application/json",
        'Authorization': `Bearer ${pinia.token}`,
    });

    try {
        const response = await fetch(`${urlBase}/createStats`, {
            method: 'POST', 
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json",
                'Authorization': `Bearer ${pinia.token}`,
            },
            body: JSON.stringify(
                bodyRequest
            ),
        });

        if (!response.ok) {
            throw new Error(`Error al obtener las estadísticas: ${response.status}`);
        }

        const data = await response.json();
        console.log('Datos recibidos:', data);
        return data;
    } catch (error) {
        console.error('Error al obtener las estadísticas:', error);
        throw error;
    }
}



const communicationManager = {
 login,
 register,
 getUser,
 getCode,
 modifyPermission,
 obtenerEstadisticas
}

export default communicationManager;
