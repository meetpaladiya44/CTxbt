"use client";

import {
  Header,
  ImpactLeaderboard,
  HeartbeatDashboard,
  Home,
  Footer
} from "../components/index";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#020617]">
      <Header />
      
      <main className="flex-grow px-6 py-8 max-w-screen-2xl mx-auto w-full">
        <div className="flex flex-col gap-8">
          
          {/* Flex layout for dashboard components with customizable widths */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left component - ImpactLeaderboard with customizable width */}
            <div className="lg:w-[50%] bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700/50 shadow-lg h-fit">
              <ImpactLeaderboard />
            </div>
            
            {/* Right component - HeartbeatDashboard with customizable width */}
            <div className="lg:w-[50%] bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700/50 shadow-lg h-fit">
              <HeartbeatDashboard />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;