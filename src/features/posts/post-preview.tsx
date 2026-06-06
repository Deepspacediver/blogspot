import { type FindPostsReturn } from "@/db/queries/post.queries";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import UserProfile from "../user/user-profile";
import { getFormattedDateWithAttribute } from "@/lib/utils";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DEFAULT_POST_IMAGE_URL =
  "https://img.freepik.com/free-vector/cute-bee-flying-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium-vector_138676-6016.jpg?t=st=1765216630~exp=1765220230~hmac=ef55c716ffcd7870cf8931dfaf2036ec395508f47fa069b5b59a93182a90ec3d&w=1480";

type PostPreviewProps = {
  data: FindPostsReturn;
};

export default async function PostPreview({ data }: PostPreviewProps) {
  const { id, title, headerImageUrl, createdAt, email: authorEmail, username } = data;
  const { attributeDate, formattedDate } = getFormattedDateWithAttribute(createdAt);
  return (
    <Link className="block w-full group" href={`/posts/${id}`}>
      <Card className="flex flex-col bg-card hover:bg-card/90 border border-border/80 rounded-2xl p-4 gap-4 h-full transition-all duration-300">
        <div className="rounded-xl overflow-hidden h-64 w-full">
          <Image
            src={headerImageUrl || DEFAULT_POST_IMAGE_URL}
            alt="post article"
            width={384}
            height={256}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col text-sm text-muted-foreground gap-2 px-1 flex-grow">
          <div className="flex">
            <time className="after:content-['•'] after:mx-1.5" dateTime={attributeDate}>
              {formattedDate}
            </time>
            <UserProfile
              withPicture={false}
              user={{
                email: authorEmail,
                username,
              }}
            />
          </div>
          <CardTitle className="text-xl text-foreground font-bold leading-snug">{title}</CardTitle>
        </div>
        <Button variant={"outline"} className="ml-auto min-w-32 w-fit mt-auto">
          View Post
        </Button>
      </Card>
    </Link>
  );
}

export async function MainPostPreview({ data }: PostPreviewProps) {
  const { id, title, headerImageUrl, createdAt, email: authorEmail, username, shortDescription } = data;
  const { attributeDate, formattedDate } = getFormattedDateWithAttribute(createdAt);

  return (
    <Link href={`/posts/${id}`} className="block group w-full my-10">
      <Card className="flex flex-col md:flex-row bg-card hover:bg-card/90 border border-border/80 rounded-2xl p-6 gap-6 transition-all duration-300">
        <div className="flex-2/3 rounded-xl overflow-hidden ">
          <Image
            src={headerImageUrl || DEFAULT_POST_IMAGE_URL}
            width={500}
            height={500}
            className="w-full transition-transform duration-500 group-hover:scale-105 min-h-[400px] max-h-[500px] object-cover "
            alt={""}
          />
        </div>
        <div className="flex flex-col text-sm text-muted-foreground flex-1/3 justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex ">
              <time className="after:content-['•'] after:mx-1.5" dateTime={attributeDate}>
                {formattedDate}
              </time>
              <UserProfile
                withPicture={false}
                user={{
                  email: authorEmail,
                  username,
                }}
              />
            </div>
            <CardTitle className="text-3xl text-foreground font-bold leading-tight">{title}</CardTitle>
            <CardDescription className="text-foreground/80 text-base leading-relaxed">
              {shortDescription}
            </CardDescription>
          </div>
          <Button variant={"outline"} className="ml-auto min-w-32 w-fit mt-6">
            View Post
          </Button>
        </div>
      </Card>
    </Link>
  );
}
