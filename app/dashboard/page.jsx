import { verifySession } from "@/app/lib/dal";

const DashboardPage = async () => {

  const session = await verifySession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg">Welcome to your dashboard!</p>
      <div className="mt-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">View Profile</button>
        <button className="bg-green-500 text-white px-4 py-2 rounded ml-2">Settings</button>
      </div>

      <p>{session?.user?.username}</p>
      <p>{JSON.stringify(session, null, 2)}</p>

    </div>
  );
};

export default DashboardPage;
