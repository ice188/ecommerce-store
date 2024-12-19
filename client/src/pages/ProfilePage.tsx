import { useParams } from "react-router-dom";
import Header from "../features/navigation/components/Header";
import Profile from "../features/profile/components/Profile";
import { AddressProvider } from "../features/profile/contexts/AddressContext";

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <div>User not found</div>;
  }
  return (
    <>
      <Header />
      <AddressProvider id={id}>
      <Profile />
      </AddressProvider>
    </>
  );
};

export default ProfilePage;
