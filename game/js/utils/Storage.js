class Storage {
    static save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage save error:', e);
            return false;
        }
    }

    static load(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage load error:', e);
            return null;
        }
    }

    static clear(key) {
        try {
            if (key) {
                localStorage.removeItem(key);
            } else {
                localStorage.clear();
            }
            return true;
        } catch (e) {
            console.error('Storage clear error:', e);
            return false;
        }
    }
} 