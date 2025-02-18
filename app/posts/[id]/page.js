/* eslint-disable react-hooks/rules-of-hooks */
import { allPosts } from "contentlayer/generated";
// import { useMDXComponent } from "next-contentlayer/hooks";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import MDXContent from "components/MDXContent";

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    id: post._raw.flattenedPath,
  }));
}
export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = allPosts.find((post) => post._raw.flattenedPath === id);
  if (!post) throw new Error(`Post not found for id: ${id}`);
  return { title: post.title };
}

export default async function Page({ params }) {
  const { id } = await params;
  const post = allPosts.find((post) => post._raw.flattenedPath === id);
  if (!post) notFound();
//   const MDXContent = useMDXComponent(post.body.code);

  return (
    <article className="mx-auto max-w-xl py-8 prose prose-slate">
      <div className="mb-8 text-center">
        <time dateTime={post.date} className="mb-1 text-xs text-gray-600">
          {dayjs(post.date).format("DD/MM/YYYY")}
        </time>
        <h1 className="text-3xl font-bold">{post.title}</h1>
      </div>
      <MDXContent code={post.body.code} />
    </article>
  );
}

// import { compileMDX } from "next-mdx-remote/rsc";
// import { readFile } from "node:fs/promises";
// import path from "path";

// async function getMDXContent(name) {
//   try {
//     const filePath = path.join(process.cwd(), "/posts/", `${name}.mdx`);
//     const contents = await readFile(filePath, { encoding: "utf8" });
//     return await compileMDX({
//       source: contents,
//       options: { parseFrontmatter: true },
//     });
//   } catch (err) {
//     return null;
//   }
// }

// export async function generateMetadata({ params, searchParams }, parent) {
//   const res = await getMDXContent(params.id);
//   if (!res) return { title: "" };
//   const { frontmatter } = res;
//   return { title: frontmatter.title };
// }

// export default async function Home({ params }) {
//   const res = await getMDXContent(params.id);
//   if (!res) return <h1>Page not Found!</h1>;
//   const { content, frontmatter } = res;

//   return <>{content}</>;
// }
