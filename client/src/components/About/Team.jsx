import React from 'react';

const TeamSection = () => {
  // Sample team data
  const teamMembers = [
    {
      id: 1,
      name: "Alex Morgan",
      role: "Product Designer",
      image: "/api/placeholder/400/400",
      bio: "Creative problem-solver with an eye for detail and user experience.",
      social: {
        twitter: "#",
        linkedin: "#",
        instagram: "#",
        github: "#"
      }
    },
    {
      id: 2,
      name: "Jamie Wilson",
      role: "Lead Developer",
      image: "/api/placeholder/400/400",
      bio: "Passionate about creating clean, efficient code and mentoring others.",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#"
      }
    },
    {
      id: 3,
      name: "Taylor Reed",
      role: "Marketing Specialist",
      image: "/api/placeholder/400/400",
      bio: "Strategies that connect products with people through compelling stories.",
      social: {
        twitter: "#",
        linkedin: "#",
        instagram: "#"
      }
    },
    {
      id: 4,
      name: "Casey Zhang",
      role: "UX Researcher",
      image: "/api/placeholder/400/400",
      bio: "Transforming user insights into meaningful product improvements.",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#"
      }
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-green-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header - reduced margins */}
        <div className="text-center mb-10">
          <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Our Team</h2>
          <p className="mt-1 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Meet the talent behind our success
          </p>
          <div className="mt-2 max-w-2xl mx-auto">
            <p className="text-lg text-gray-500">
              Passionate individuals working together to create extraordinary experiences.
            </p>
          </div>
          <div className="mt-4 relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full h-1 w-24"></span>
            </div>
          </div>
        </div>

        {/* Team members grid - reduced image height and padding */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div 
              key={member.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="relative">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <span className="text-xs text-white font-semibold bg-gradient-to-r from-green-500 to-emerald-600 px-2 py-1 rounded-full">
                    {member.role}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{member.bio}</p>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;