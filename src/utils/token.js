// 操作 “令牌” token
const key = 'heimamm_token';

const setToken = token => {
    localStorage.setItem(key, token);
}

const getToken = () => {
    return localStorage.getItem(key);
}

const removeToken = () => {
    localStorage.removeItem(key);
}

// 按需导出 导出对象
export { setToken, getToken, removeToken }