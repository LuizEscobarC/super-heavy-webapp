
const superhavyBaseUrl = 'http://localhost:3001';

const superhavyApi = {
    get: async (route) => {
        try {
            const response = await fetch(`${superhavyBaseUrl}/${route}`);
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro:', error);
        }    
    },
    post: async (route, data) => {
        try {
            const response = await fetch(`${superhavyBaseUrl}/${route}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response) throw new Error(`Erro HTTP: ${response.status}`);
            console.log('Resposta:', response);
            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error('Erro:', error);
            return false;
        }
    },
    put: async (route, data) => {
        try {
            const response = await fetch(`${superhavyBaseUrl}/${route}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            return true;
        } catch (error) {
            console.error('Erro:', error);
            return false;
        }
    },
    patch: async (route, data) => {
        try {
            const response = await fetch(`${superhavyBaseUrl}/${route}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            return true;
        } catch (error) {
            console.error('Erro:', error);
            return false;
        }
    },
    delete: async (route) => {
        try {
            const response = await fetch(`${superhavyBaseUrl}/${route}`, {
                method: 'DELETE'
            });
            
            return response.body() && response.json();
        } catch (error) {
            return false;
        }
    }
}


export default superhavyApi;