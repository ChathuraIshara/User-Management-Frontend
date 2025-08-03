import OverviewDescription from "./OverviewDescription";
import SearchAndFilter from "./SearchAndFilter";
import UserTable from "./UserTable";

export default function Hero(){
    return (
        <div className="flex flex-col gap-6 border border-gray-200 rounded-xl shadow-sm bg-white p-6 mt-5">
           <OverviewDescription />
           <SearchAndFilter />
           <UserTable/>
        </div>
    );
}