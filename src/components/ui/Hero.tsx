import OverviewDescription from "./OverviewDescription";
import SearchAndFilter from "./SearchAndFilter";
import UserTable from "./UserTable";

export default function Hero(){
    return (
        <div className="flex flex-col gap-6">
           <OverviewDescription />
           <SearchAndFilter />
           <UserTable/>
        </div>
    );
}