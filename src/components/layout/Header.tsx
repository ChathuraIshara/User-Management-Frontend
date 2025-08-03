import { Users, Plus } from "lucide-react";

export default function Header() {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-green-700 font-bold" />
                <h2 className="text-3xl font-bold">User Management</h2>
            </div>
            <button className="text-white bg-green-700 hover:outline-none flex items-center gap-2 px-4 py-2 rounded">
                <Plus className="h-5 w-5 text-white" />
                Add user
            </button>
        </div>
    );
}