import { Headphones, Music, Users } from 'lucide-react';
import { useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@clerk/clerk-react';
import { useChatStore } from '@/stores/useChatStore';

function FriendsActivity() {
  const { isSignedIn, getToken, userId } = useAuth();
  const { users, fetchUsers, onlineUsers, userActivities, initSocket } = useChatStore();


  useEffect(() => {
    const fetchWithToken = async () => {
      const token = await getToken();
      if (isSignedIn && token && userId) {
        console.log("🔗 Initializing socket and fetching users for:", userId);
        // Initialize socket connection
        initSocket(userId);
        // Fetch users
        fetchUsers();
      }
    };
    fetchWithToken();
  }, [isSignedIn, getToken, fetchUsers, initSocket, userId]);

  // Filter out the logged-in user
  const friends = users.filter((user) => user.clerkId !== userId);

  return (
    <div className="h-full bg-zinc-900 rounded-xl flex flex-col shadow-md">
      <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-950 rounded-t-xl">
        <div className="flex items-center gap-3 text-white">
          <Users className="size-5" />
          <h2 className="text-lg font-semibold tracking-wide">What Friends Are Listening To</h2>
        </div>
      </div>

      {!isSignedIn || !users?.length ? (
        <LoginPrompt />
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-5 space-y-4">
            {friends.length === 0 ? (
              <div className="text-center text-zinc-500 mt-10">No friends to display</div>
            ) : (
              friends.map((user) => {
                const activity = userActivities.get(user._id) || 'Idle';
                const isPlayingSong = activity !== 'Idle';
                const songName = isPlayingSong ? activity.replace('Playing ', '').trim() : null;

                return (
                  <div
                    key={user._id}
                    className="p-4 rounded-xl transition-all flex items-center gap-4 hover:bg-zinc-800/40 cursor-pointer"
                  >
                    <div className="relative">
                      <Avatar className="size-12 border border-zinc-700 shadow-sm">
                        <AvatarImage src={user.imageUrl} alt={user.fullName} />
                        <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute bottom-0 right-0 h-3 w-3 border-2 border-zinc-900 rounded-full ${
                          onlineUsers.has(user.clerkId) ? 'bg-green-500' : 'bg-zinc-700'
                        }`}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium truncate">{user.fullName}</span>
                        {isPlayingSong && <Music className="size-4 text-emerald-400" />}
                      </div>
                      {isPlayingSong ? (
                        <div className="text-sm text-white mt-1 truncate">{songName}</div>
                      ) : (
                        <div className="text-sm text-zinc-500 mt-1">Idle</div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

const LoginPrompt = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="relative flex flex-col items-center justify-center space-y-4">
        <div
          className="absolute inset-20 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-lg opacity-75 animate-pulse"
          aria-hidden="true"
        />
        <div className="relative bg-zinc-900 rounded-full p-4 z-10">
          <Headphones className="size-8 text-emerald-400" />
        </div>
        <div className="space-y-2 max-w-[250px] z-10">
          <h3 className="text-white font-semibold text-lg">See What Friends Are Playing</h3>
          <p className="text-sm text-zinc-400">
            Login to discover the music you and your friends are listening to.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FriendsActivity;

