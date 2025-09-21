import { useEffect } from "react";
import { Badge, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function PostPreview({ post }) {

  const knownCategories = ["coding", "mental-health", "vegan", "gaming", 'world-news','anime'];
  const normalized = normalizeCategory(post.category);
  const isKnown = knownCategories.includes(normalized);
  const categoryClass = isKnown
    ? `fw-normal badge-${normalized}`
    : "fw-semibold badge-default";
    
  useEffect(()=>{console.log(post), []});

  function getTextPreview(html, maxLength = 200) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || ""; //prendo solo la parte leggibile, senza tag
    return text.length > maxLength
      ? text.slice(0, maxLength).trim() + "..." // tronco a 200 caratteri
      : text;
  };

  function normalizeCategory(category) {
    console.log('norm category', category.toLowerCase().replace(/\s+/g, "-") )
    return category.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <Link to={`/posts/${post._id}`}>
      <Row className="mb-3 align-items-center rounded-2 postPreview">
        <Col sm={9}>
          <p className="fw-bold">
            {post.author.nome} {post.author.cognome}
          </p>
          <h2 className="fw-bolder">{post.title}</h2>
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="d-inline fs-4">
              <Badge pill className={categoryClass}>
                {post.category.toUpperCase()}
              </Badge>
            </h3>
            <h4 className="d-inline fs-6">
              {post.readTime.value} {post.readTime.unit} read
            </h4>
          </div>
          <p>{getTextPreview(post.content)}</p>
        </Col>
        <Col sm={3}>
          <img src={post.cover} alt="post cover" className="postPreviewImg" />
        </Col>
      </Row>
    </Link>
  );
}

export default PostPreview;
