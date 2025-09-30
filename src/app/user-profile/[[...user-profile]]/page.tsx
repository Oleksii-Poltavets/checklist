import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
    return (
        <>
            <Header />
            <div className="flex justify-center items-center py-8">
                <UserProfile path="/user-profile" />
            </div>
        </>
    )
}
