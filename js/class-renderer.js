import JWPage from "./class-page";
import JWSyntax from "./jw-class";
class Renderer {
    constructor() {

    }
    /**
     * ページを描画する.
     * @param {JWPage} pageClass 
     */
    render(pageClass) {
        const rawText = pageClass.rawText;
        // JW独自の構文チェック. AppやPluginを判定.
        JWSyntax.check(rawText);
        // FX2構文の場合.

    }
}
export default Renderer;