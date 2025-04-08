import { MdDashboard } from "react-icons/md";
import AuthSideInfo from "../_components/AuthSideInfo";
import { FaMessage } from "react-icons/fa6";
import SignupFormSection from "./_components/SignupFormSection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

async function page() {
  const authFeaturesSignup = [
    {
      title: "Unified Dashboard",
      description: "Manage multiple platforms from one place",
      icon: MdDashboard,
    },
    {
      title: "Engage & Respond",
      description: "Never miss an important comment or message",
      icon: FaMessage,
    },
  ];

  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="grid md:grid-cols-2 grid-cols-1  h-screen ">
      <AuthSideInfo
        features={authFeaturesSignup}
        heading={"Join Thousands of Social Media Managers"}
        description={
          "Create your account today and start managing all your social media platforms from one powerful dashboard."
        }
      />
      <SignupFormSection />
    </div>
  );
}

export default page;
