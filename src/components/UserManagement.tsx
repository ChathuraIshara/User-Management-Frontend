import { useState } from "react";
import Header from "./layout/Header";
import Hero from "./ui/Hero";

export default function UserManagement() {
    // State to trigger user table refresh
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleUserCreated = () => {
        // Increment trigger to force UserTable to refresh
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <>
            <Header onUserCreated={handleUserCreated} />
            <Hero refreshTrigger={refreshTrigger} />
        </>
    );
}