export function randomStr(len, str = '') {
    let baseStr = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    if (str.length > 0) {
        baseStr = str
    }
    let result = '';
    for (let i = 0; i < len; i++) {
        let index = Math.floor(Math.random() * baseStr.length);
        result += baseStr[index];
    }
    return result;
}
