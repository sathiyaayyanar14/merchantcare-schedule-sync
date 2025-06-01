
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TeamInvitationRequest {
  name: string;
  email: string;
  role: string;
  inviterName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, role, inviterName = "Team Admin" }: TeamInvitationRequest = await req.json();

    console.log('Sending team invitation to:', { name, email, role });

    const emailResponse = await resend.emails.send({
      from: "Gokwik Merchant Care <onboarding@resend.dev>",
      to: [email],
      subject: "You've been invited to join Gokwik Merchant Care Team!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1e40af;">Welcome to Gokwik Merchant Care!</h1>
          
          <p>Hi ${name},</p>
          
          <p>${inviterName} has invited you to join the <strong>Gokwik Merchant Care</strong> team as a <strong>${role}</strong>.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Next Steps:</h3>
            <ol style="color: #4b5563;">
              <li>Click the button below to access the platform</li>
              <li>Create your account or sign in if you already have one</li>
              <li>Connect your Google Calendar for scheduling</li>
              <li>Set up your availability preferences</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get('SITE_URL') || 'https://your-domain.com'}/auth" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Join the Team
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            If you have any questions, please contact your team administrator.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px;">
            This invitation was sent by ${inviterName} from Gokwik Merchant Care.
          </p>
        </div>
      `,
    });

    console.log("Team invitation sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Invitation sent to ${email}`,
      emailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-team-invitation function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send invitation" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
