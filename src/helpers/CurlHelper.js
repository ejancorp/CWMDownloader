import shellQuote from "shell-quote";

export default class CurlHelper {
  static parse(curlString) {
    const parsedCommand = shellQuote.parse(curlString);

    let method = 'GET';
    let url = '';
    const headers = {};
    let body = null;

    let currentFlag = null;

    parsedCommand.forEach(part => {
      if (typeof part === 'object' && part.op) {
        return;
      }
      if (part.startsWith('-')) {
        currentFlag = part;
      } else {
        switch (currentFlag) {
          case '-X':
            method = part;
            break;
          case '-H':
            const [headerName, headerValue] = part.split(/:(.*)/s).map(h => h.trim());
            headers[headerName] = headerValue;
            break;
          case '-d':
          case '--data':
            body = part;
            break;
          default:
            if (!url) {
              url = part;
            }
        }
        currentFlag = null;
      }
    });

    return { method, url, headers, body };
  }
}
