import type { Article } from "../../types/legal-check";
import { Icon } from "../icon";

export function ArticleContent({ article }: { article: Article }) {
  return (
    <>
      <span className="article-category">{article.category}</span>
      <p className="article-body">{article.body}</p>
      {article.title.includes("Lemon") && (
        <a
          className="text-link"
          href="https://www.ratchakitcha.soc.go.th/"
          target="_blank"
          rel="noreferrer"
        >
          ตรวจสอบราชกิจจานุเบกษา
          <Icon name="external" size={15} />
        </a>
      )}
    </>
  );
}
