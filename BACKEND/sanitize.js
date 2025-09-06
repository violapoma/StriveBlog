import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

function sanitizeHtml(dirty) {
  return DOMPurify.sanitize(dirty);
}

export default sanitizeHtml;