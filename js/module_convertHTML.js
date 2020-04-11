/**
 * file kara yomitoru tabun.
 * @param {string} fileName
 * @returns {string}
 */
export function loadText(fileName) {
    let loadData = file_get_contents(fileName);
    if (loadData === false) {
        return filename + ' is not exist.';
    }
    return text2html(loadData);
}
/**
 * 
 * @param {string} text 
 * @returns {string} 
 */
export function text2html(text){
    return text;
}