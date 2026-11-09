import { articles } from "../../data/legal-check";
import type { Article } from "../../types/legal-check";
import { Icon } from "../icon";
import { ViewLink } from "../view-link";

export function KnowledgeSection({
  onArticle,
  onNavigate,
}: {
  onArticle: (article: Article) => void;
  onNavigate: () => void;
}) {
  return (
    <section className="knowledge">
      <div className="section-heading">
        <h2>
          รู้สิทธิ ก่อนเกิดปัญหา{" "}
          <span className="heading-note">
            เรื่องกฎหมาย เข้าใจง่ายกว่าที่คิด
          </span>
        </h2>
        <ViewLink
          view="resources"
          className="text-link"
          onNavigate={onNavigate}
        >
          ดูบทความทั้งหมด <Icon name="arrow" size={16} />
        </ViewLink>
      </div>
      <div className="article-grid">
        {articles.map((a) => (
          <button
            className="article-card"
            key={a.title}
            onClick={() => onArticle(a)}
          >
            <div
              className="article-image"
              style={{
                backgroundImage: `url(https://images.unsplash.com/${a.image}?auto=format&fit=crop&w=700&q=85)`,
              }}
            >
              <span>{a.category}</span>
            </div>
            <div className="article-content">
              <h3>
                {a.title}
                <Icon name="arrow" size={18} />
              </h3>
              <p>{a.description}</p>
              <small>
                อ่านต่อ <Icon name="arrow" size={13} />
              </small>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
