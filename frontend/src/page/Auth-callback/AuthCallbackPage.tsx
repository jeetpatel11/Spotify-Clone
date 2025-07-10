import { Card, CardContent } from '@/components/ui/card'
import { axiosInstance } from '@/lib/axios';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Loader } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthCallbackPage() {
  const { isLoaded, user } = useUser();
  const { getToken } = useAuth(); // ✅ Get Clerk token
  const navigate = useNavigate();
  const syncAttempted = useRef(false);

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user || syncAttempted.current) return;

      try {
        syncAttempted.current = true;

        const token = await getToken(); // ✅ Fetch Clerk token

        const res = await axiosInstance.post(
          "/auth/callback",
          {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ Send token to backend
            },
          }
        );

        console.log("Backend response:", res.data);
      } catch (error) {
        console.error("Sync error:", error);
      } finally {
        navigate("/");
      }
    };

    syncUser();
  }, [isLoaded, user, getToken, navigate]);

  return (
    <div className="flex h-screen w-full bg-black justify-center items-center">
      <Card className="w-[90%] max-w-md bg-zinc-900 border-zinc-800">
        <CardContent className="flex flex-col gap-4 pt-6 items-center">
          <Loader className="size-6 text-emerald-500 animate-spin" />
          <h3 className="text-zinc-400 text-xl font-bold">Logging you in</h3>
          <p className="text-zinc-400 text-sm">Redirection...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default AuthCallbackPage;
