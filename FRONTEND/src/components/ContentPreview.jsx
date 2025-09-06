import DOMPurify from "dompurify";

function ContentPreview({content}) {
  const cleanHtml = DOMPurify.sanitize(content); //pulito, così posso usare dangerouslySetHTML in sicurezza


  return (
    <div className="preview-box mt-4 p-3 border rounded">
      <div
        className="preview-content"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </div>
  );
}
export default ContentPreview; 