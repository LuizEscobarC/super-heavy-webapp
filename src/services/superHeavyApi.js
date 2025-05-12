
const superhavyBaseUrl = 'http://localhost:3000';

const superhavyApi = {
    get: async (route) => {
        try {
            const response = await fetch(`${superhavyBaseUrl}/${route}`);
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            const data = await response.json();
            console.log('Dados:', data);
            return data;
        } catch (error) {
            console.error('Erro:', error);
        }    
    },
    post: (route, data) => {
        try {
            const response = fetch(`${superhavyBaseUrl}/${route}`, {
                method: 'POST',
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
    remove: (route) => {
        try {
            const response = fetch(`${superhavyBaseUrl}/${route}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            return true;
        } catch (error) {
            console.error('Erro:', error);
            return false;
        }
    }
}


export default superhavyApi;