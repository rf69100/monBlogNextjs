// Route dynamique /billets/[id]
// Délègue entièrement le rendu au composant Post.
import Post from "../../components/post";

export default function Page() {
  return <Post />;
}
