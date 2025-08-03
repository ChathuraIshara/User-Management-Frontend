import { Search } from "lucide-react";

export default function SearchAndFilter()
{
    return (
        <div className="flex justify-between items-center">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-3 w-3 text-gray-400" />
                </div>
                <input 
                    className="pl-8 pr-8 py-2 border text-sm border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 ease-in-out hover:border-gray-200" 
                    type="text" 
                    placeholder="Search users..." 
                />
            </div>
            <div>
                <div className="flex gap-4">
                     <p>Total: 3</p>
                     <p>Active: 2</p>
                     <p>Inactive: 1</p>
                </div>
            </div>
        </div>
    );
}