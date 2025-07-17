import InvitationClientPage from "./invitation-client";

const InvitePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const tokenRaw = await searchParams.then((params) => params.token);
  const token = Array.isArray(tokenRaw)
    ? (tokenRaw[0] ?? "")
    : (tokenRaw ?? "");

  if (!token || token.trim() === "") return <div>Opps token in trouvable</div>;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <InvitationClientPage token={token} />
    </div>
  );
};

export default InvitePage;
