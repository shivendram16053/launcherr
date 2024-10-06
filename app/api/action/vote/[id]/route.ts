import {
    Transaction,
    PublicKey,
    SystemProgram,
    Connection,
    clusterApiUrl,
    LAMPORTS_PER_SOL,
  } from "@solana/web3.js";
  import {
    ACTIONS_CORS_HEADERS,
    createPostResponse,
    ActionGetResponse,
    ActionPostResponse,
  } from "@solana/actions";
  
  const organizerPubKey = "6rSrLGuhPEpxGqmbZzV1ZttwtLXzGx8V2WEACXd4qnVH";
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
  export const GET = async (req: Request) => {
    await connectToDatabase();
  
    const { pathname } = new URL(req.url);
    const pathSegments = pathname.split("/");
    const tournamentId = pathSegments[4];
  
    const orgData = await createTournamentSchema.findOne({ tournamentId });
    try {
      const payload: ActionGetResponse = {
        icon: `${orgData.image}`,
        title: `join the ${orgData.organizationName} tournament`,
        description: `${orgData.description}`,
        label: "Join Now",
        links: {
          actions: [
            {
              label: "Join Now",
              href: `/api/actions/join/${tournamentId}?name={name}&email={email}&teamType={teamType}&members={members}`,
              parameters: [
                {
                  type: "text",
                  name: "name",
                  label: "Enter Leader Name",
                  required: true,
                },
                {
                  type: "email",
                  name: "email",
                  label: "Enter Leader Email",
                  required: true,
                },
                {
                  type: "select",
                  name: "teamType",
                  label: "Select Team Type",
                  options: [
                    { label: "Team", value: "team" },
                    { label: "Solo", value: "solo" },
                  ],
                  required: true,
                },
                {
                  type: "radio",
                  name: "members",
                  label: "Select Team Member",
                  options: [
                    { label: "1", value: "1" },
                    { label: "2", value: "2" },
                    { label: "3", value: "3" },
                    { label: "4", value: "4" },
                  ],
                  required: true,
                },
              ],
            },
          ],
        },
      };
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
  
  export const OPTIONS = GET;
  
  export const POST = async (req: Request) => {
    try {
      const { pathname } = new URL(req.url);
      const pathSegments = pathname.split("/");
      const tournamentId = pathSegments[4];
      const body = await req.json();
      const playerPubKey = new PublicKey(body.account);
      const url = new URL(req.url);
      const playerName = url.searchParams.get("name") ?? "";
      const playerEmail = url.searchParams.get("email") ?? "";
      const teamType = url.searchParams.get("teamType") ?? "";
      const teamMember = url.searchParams.get("members") ?? "";
      const fees = 0.002;
  
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: playerPubKey,
          toPubkey: new PublicKey(organizerPubKey),
          lamports: fees * LAMPORTS_PER_SOL,
        })
      );
  
      transaction.feePayer = playerPubKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
  
      const payload: ActionPostResponse = await createPostResponse({
        fields: {
          transaction,
          message: `Your Event has been created, Share it now`,
          links: {
            next: {
              type: "post",
              href: `/api/actions/savePlayerData?playerName=${playerName}&playerEmail=${playerEmail}&teamType=${teamType}&teamMembers=${teamMember}&tournamentId=${tournamentId}`,
            },
          },
        },
      });
  
      return new Response(JSON.stringify(payload), {
        status: 200,
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
  