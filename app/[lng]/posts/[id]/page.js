import { allPosts } from "contentlayer/generated";
// import { useMDXComponent } from "next-contentlayer/hooks";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import MDXContent from "components/MDXContent";
import siteMetadata from "@/data/siteMetadata";

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    id: post._raw.flattenedPath,
  }));
}
export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = allPosts.find((post) => post._raw.flattenedPath === id);
  if (!post) throw new Error(`Post not found for id: ${id}`);

  const publishedAt = new Date(post.date).toISOString();
  const modifiedAt = new Date(post.lastmod || post.date).toISOString();

  let imageList = [siteMetadata.socialBanner];
  if (post.images) {
    imageList = typeof post.images === "string" ? [post.images] : post.images;
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes("http") ? img : siteMetadata.siteUrl + img,
    };
  });

  const authors = post?.authors || [siteMetadata.author];
  
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      siteName: siteMetadata.title,
      locale: "zh_CN",
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: "./",
      images: ogImages,
      authors: authors,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: imageList,
    },
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  const post = allPosts.find((post) => post._raw.flattenedPath === id);
  if (!post) notFound();
  //   const MDXContent = useMDXComponent(post.body.code);
  const jsonLd = post.structuredData;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-xl py-8 prose prose-slate dark:prose-invert">
        <div className="mb-8 text-center">
          <time dateTime={post.date} className="mb-1 text-xs text-gray-600">
            {dayjs(post.date).format("DD/MM/YYYY")}
          </time>
          <h1 className="text-3xl font-bold">{post.title}</h1>
        </div>
        <MDXContent code={post.body.code} />
      </article>
    </>
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
