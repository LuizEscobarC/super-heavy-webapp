const localStorageService = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Erro ao ler ${key} do localStorage:`, error);
            return null;
        }    
    },
    set: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Erro ao salvar ${key} no localStorage:`, error);
            return false;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Erro ao remover ${key} do localStorage:`, error);
            return false;
        }
    }
}

export default localStorageService;