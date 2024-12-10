import { prisma } from "@/lib/prisma";
import {
  NextActionPostRequest,
  ActionError,
  CompletedAction,
  ACTIONS_CORS_HEADERS,
} from "@solana/actions";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const GET = async () => {
  return Response.json(
    { message: "Method not supported" },
    {
      headers: ACTIONS_CORS_HEADERS,
    }
  );
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    const body: NextActionPostRequest = await req.json();
    const url = new URL(req.url);
    const name = url.searchParams.get("name") ?? "";
    
    const signature = body.signature;
    if (!signature) throw "Invalid signature";
   

    try {
      let status = await connection.getSignatureStatus(signature);

      if (!status) throw "Unknown signature status";

      if (status.value?.confirmationStatus) {
        if (
          status.value.confirmationStatus != "confirmed" &&
          status.value.confirmationStatus != "finalized"
        ) {
          let actionError: ActionError = {
            message: "Signature not confirmed or finalized",
          };
          return new Response(JSON.stringify(actionError), {
            status: 400,
            headers: ACTIONS_CORS_HEADERS,
          });
        }
      }

      

      
      


      const transaction = await connection.getParsedTransaction(
        signature,
        "confirmed"
      );

     
      
      const payload: CompletedAction = {
        type: "completed",
        title: "Subscription created Successfully .Check Email",
        icon: "",
        label: "Subscription Created",
        description: `Your Blink URL to share is 
        or just scan the QR code to share . Check Your email for more info.`,
      };

      return new Response(JSON.stringify(payload), {
        headers: ACTIONS_CORS_HEADERS,
      });
    } catch (err) {
      console.error("Error in transaction or saving event:", err);
      if (typeof err == "string") throw err;
      throw "Unable to confirm the provided signature";
    }
  } catch (err) {
    console.error("General error:", err);
    let actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof err == "string") actionError.message = err;
    return new Response(JSON.stringify(actionError), {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};