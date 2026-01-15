import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

type SendInviteEmailParams = {
  to: string;
  token: string;
  workspaceName: string;
};

export async function sendWorkspaceInviteEmail({
  to,
  token,
  workspaceName,
}: SendInviteEmailParams) {
  const inviteLink = `${
    process.env.CLIENT_URL
  }/invite?token=${token}&workspace=${encodeURIComponent(workspaceName)}`;

  console.log("Generated invite link:", inviteLink);

  const html = `
<div
  style="
    background-color: #cccccc;
    padding: 32px;
    font-family: Inter, Arial, sans-serif;
  "
>
  <div
    style="
      max-width: 520px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
    "
  >
    <h2 style="margin: 0 0 12px 0; color: #111827">
      You’re invited to join ${workspaceName}
    </h2>

    <p
      style="
        margin: 0 0 20px 0;
        color: #374151;
        font-size: 15px;
        line-height: 1.6;
      "
    >
      You’ve been invited to collaborate on <strong>${workspaceName}</strong>.
      Click the button below to accept the invitation.
    </p>

    <div style="text-align: center; margin: 32px 0">
      <a
        href="${inviteLink}"
        style="
          display: inline-block;
          padding: 9px 24px;
          background-color: #36abc9;
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
        "
      >
        Accept Invitation
      </a>
    </div>

    <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 13px">
      This invitation will expire in 7 days.
    </p>

    <p style="margin: 0; color: #9ca3af; font-size: 12px">
      If you weren’t expecting this invitation, you can safely ignore this
      email.
    </p>
  </div>

  <p
    style="
      text-align: center;
      margin-top: 16px;
      color: #9ca3af;
      font-size: 11px;
    "
  >
    © ${new Date().getFullYear()} Your Company
  </p>
</div>
  `;

  const res = await transporter.sendMail({
    from: process.env.GOOGLE_EMAIL,
    to,
    subject: `Invitation to join ${workspaceName}`,
    html,
  });
  console.log("Email send result: ", res.accepted);

  if (res.rejected.length > 0) {
    throw new Error(`Failed to send invite email to ${to}`);
  }
}
