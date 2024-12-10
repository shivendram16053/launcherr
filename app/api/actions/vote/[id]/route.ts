import { NextRequest } from "next/server";
import {
  Transaction,
  PublicKey,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  SystemProgram,
} from "@solana/web3.js";
import {
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionError,
} from "@solana/actions";
import { prisma } from "@/lib/prisma";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const GET = async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const pathSegments = pathname.split("/");
  const productId = pathSegments[4];

  const productDetails = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!productDetails) {
    return new Response("Product not found", { status: 404 });
  }

  const payload: ActionGetResponse = {
    icon: `${productDetails.logoUrl}`,
    title: `Checkout ${productDetails.name}`,
    description: `${productDetails.description}`,
    label: "Submit",
    links: {
      actions: [
        {
          type: "external-link",
          label: "Check Twitter",
          href: `/api/actions/vote/${productId}/twitter`,
        },
        {
          type: "post",
          label: "Submit Review",
          href: `/api/actions/vote/${productId}?comment={comment}&tip={tip}&vote={vote}`,
          parameters: [
            {
              type: "text",
              name: "comment",
              label: "Any Comments...",
              required: true,
            },
            {
              type: "number",
              name: "tip",
              label: "Any Tip...",
            },
            {
              type: "select",
              name: "vote",
              label: "Vote the product",
              options: [
                { label: "UPVOTE", value: "up" },
                { label: "DOWNVOTE", value: "down" },
              ],
            },
          ],
        },
      ],
    },
    type: "action",
  };

  return new Response(JSON.stringify(payload), {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = GET;

export const POST = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as { account: string; signature: string };
    const { searchParams } = new URL(req.url);
    const comment = searchParams.get("comment") ?? "";
    const tip = searchParams.get("tip") ?? 0;
    const vote = searchParams.get("vote") ?? "";
    const { pathname } = new URL(req.url);
    const pathSegments = pathname.split("/");
    const productId = pathSegments[4];

    const productDetails = await prisma.product.findUnique({
      where: { id: productId },
    });
    const userDetails = await prisma.user.findUnique({
      where: { id: productDetails?.publicKey },
    });

    if (!productDetails) {
      return new Response("Product not found", { status: 404 });
    }
    if (!userDetails) {
      return new Response("user not found", { status: 404 });
    }

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(body.account),
        toPubkey: new PublicKey(userDetails.publicKey),
        lamports: Number(tip) * LAMPORTS_PER_SOL,
      })
    );

    transaction.feePayer = new PublicKey(body.account);
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload = await createPostResponse({
      fields: {
        transaction,
        message: "",
        links: {
          next: {
            type: "post",
            href: `/api/actions/reveal?productId=${productId}&comment=${comment}&vote=${vote}&tip=${tip}`,
          },
        },
       type:"transaction"
      },
    });

    return new Response(JSON.stringify(payload), {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (error) {
    console.error("Error processing POST request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: ACTIONS_CORS_HEADERS,
      }
    );
  }
};
