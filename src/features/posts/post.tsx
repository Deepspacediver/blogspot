import { type PostWithAuthorReturn } from "@/db/queries/post.queries";
import React from "react";
import { getFormattedDateWithAttribute } from "@/lib/utils";
import ImageExtension from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { renderToHTMLString } from "@tiptap/static-renderer";
import { User } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

type PostProps = {
  post: PostWithAuthorReturn;
};

const CustomImage = ImageExtension.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      textAlign: {
        default: "left",
        renderHTML: (attributes) => {
          const alignment = attributes.textAlign || "left";
          const marginMap: Record<string, string> = {
            left: "margin-right: auto; margin-left: 0;",
            center: "margin-left: auto; margin-right: auto;",
            right: "margin-left: auto; margin-right: 0;",
          };
          return {
            "data-text-align": alignment,
            style: `display: block; ${marginMap[alignment] || ""}`,
          };
        },
      },
    };
  },
});

const extensions = [StarterKit, CustomImage];
export default async function Post({ post }: PostProps) {
  const { title, shortDescription, content, createdAt, username, email, pictureUrl } = post;
  const { attributeDate, formattedDate } = getFormattedDateWithAttribute(createdAt);

  return (
    <>
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold tracking-tight text-foreground leading-[1.15] mb-4">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 font-normal">
          {shortDescription}
        </p>

        <div className="flex items-center gap-3 mb-8">
          <div className="relative size-12 rounded-full overflow-hidden bg-muted flex items-center justify-center border border-border">
            {pictureUrl ? (
              <Image src={pictureUrl} fill className="object-cover" alt="author" />
            ) : (
              <User className="size-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-bold text-foreground text-sm">{username || email}</span>
            <time className="text-sm text-muted-foreground" dateTime={attributeDate}>
              {formattedDate}
            </time>
          </div>
        </div>
        <Separator />
      </header>

      <section className="tiptap">
        <div
          dangerouslySetInnerHTML={{
            __html: renderToHTMLString({ content: content as unknown as JSON, extensions }),
          }}
        ></div>
      </section>
    </>
  );
}
