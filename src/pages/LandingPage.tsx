import BoardMember from "../component/BoardMember";
import HeroSection from "../component/HeroSection";
import JoinNima from "../component/JoinNima";
import MissionVision from "../component/MissionVision";

const LandingPage = () => {
  return (
    <div className="">
      <HeroSection />
      <MissionVision />
      <JoinNima />
      <BoardMember />
    </div>
  );
};

export default LandingPage;
