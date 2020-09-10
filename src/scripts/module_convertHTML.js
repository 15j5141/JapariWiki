/**
 * file kara yomitoru tabun.
 * @param {string} fileName
 * @return {string}
 */
export function loadText(fileName) {
  const loadData = file_get_contents(fileName);
  if (loadData === false) {
    return filename + ' is not exist.';
  }
  return text2html(loadData);
}
/**
 *
 * @param {string} text
 * @return {string}
 */
export function text2html(text) {
  return text;
}
